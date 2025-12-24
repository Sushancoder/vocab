
import { getAudioUrl } from './audioExtractor';

/**
 * Utility functions for integrating with free Dictionary API and Random Word API
 */

/**
 * Shuffles an array in place using Fisher-Yates algorithm
 * @param {Array} array 
 * @returns {Array}
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Fetch random words from one of the free APIs
 * @param {number} count Number of words to fetch
 * @returns {Promise<string|string[]>} Single word or array of words
 */
export async function fetchRandomWords(count = 1) {
    const endpoints = [
        `https://random-word-api.vercel.app/api?words=${count}`,
        `https://random-word-api.herokuapp.com/word?number=${count}`
    ];

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint);
            if (response.ok) {
                const data = await response.json();
                return count === 1 ? data[0] : data; // Return single word or array
            }
        } catch (error) {
            console.warn(`Failed to fetch from ${endpoint}:`, error);
            continue; // Try next endpoint
        }
    }
    throw new Error('Random word API unavailable');
}

/**
 * Fetch word details from Dictionary API
 * @param {string} word Word to fetch
 * @returns {Promise<Object|null>} API response or null if not found
 */
export async function fetchDictionaryWord(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`Dictionary API error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Dictionary API unavailable:', error);
        return null;
    }
}

/**
 * Check if dictionary data has at least one synonym
 * @param {Object} dictData Dictionary API response
 * @returns {boolean}
 */
export function hasSynonym(dictData) {
    if (!dictData || !dictData[0] || !dictData[0].meanings) return false;

    const data = dictData[0];

    // Check synonyms at root level (sometimes exists)
    if (data.meanings.some(m => m.synonyms && m.synonyms.length > 0)) return true;

    // Check synonyms inside definitions
    return data.meanings.some(m =>
        m.definitions && m.definitions.some(d => d.synonyms && d.synonyms.length > 0)
    );
}

/**
 * Find a random word that has synonyms available
 * @param {string[]} usedWords Array of words already learned
 * @param {number} maxAttempts Maximum attempts to find a suitable word
 * @returns {Promise<Object>} Object containing mainWord, dictData, and distractorWords (or definitionOnly flag)
 */
export async function findWordWithSynonym(usedWords = [], maxAttempts = 8) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            // Fetch one word at a time
            const randomWord = await fetchRandomWords(1);

            // Skip if already used
            if (usedWords.includes(randomWord.toLowerCase())) {
                continue;
            }

            // Check if this word has definition + synonym
            const dictData = await fetchDictionaryWord(randomWord);

            if (dictData && hasSynonym(dictData)) {
                // Found suitable word! Now fetch 2 more words for distractors
                const distractorWords = await fetchRandomWords(2);

                return {
                    mainWord: randomWord,
                    dictData,
                    distractorWords
                };
            }
        } catch (e) {
            console.warn(`Attempt ${attempt + 1} failed:`, e);
        }
        // If no synonym or error, loop continues to fetch next word
    }

    // Fallback: return definition-only mode after max attempts
    // We still need a word, so fetch one last random word
    try {
        const fallbackWord = await fetchRandomWords(1);
        const fallbackData = await fetchDictionaryWord(fallbackWord);

        if (fallbackData) {
            return {
                mainWord: fallbackWord,
                dictData: fallbackData,
                definitionOnly: true
            };
        }
    } catch (e) {
        console.error("Fallback failed", e);
    }

    throw new Error("Failed to find a suitable word");
}

/**
 * Transform Dictionary API data to app conformant schema
 * @param {Object} apiResponse Dictionary API response
 * @param {string[]} distractorWords Random words to use as distractors (or empty for definition only)
 * @returns {Object} App conformant word object
 */
export function transformDictionaryData(apiResponse, distractorWords = []) {
    const data = apiResponse[0];

    // Extract definitions (up to 2)
    const definitions = data.meanings
        .flatMap(m => m.definitions)
        .map(d => d.definition)
        .slice(0, 2);

    const combinedDefinition = definitions.length > 0 ? definitions.join("  OR  ") : "No definition available";

    // Extract synonym from meanings or definitions
    let realSynonym = null;

    // Try to find a synonym in meanings
    const meaningWithSynonym = data.meanings.find(m => m.synonyms && m.synonyms.length > 0);
    if (meaningWithSynonym) {
        realSynonym = meaningWithSynonym.synonyms[0];
    } else {
        // Try to find a synonym in definitions
        const defWithSynonym = data.meanings
            .flatMap(m => m.definitions)
            .find(d => d.synonyms && d.synonyms.length > 0);

        if (defWithSynonym) {
            realSynonym = defWithSynonym.synonyms[0];
        }
    }

    // Extract examples
    const examples = data.meanings
        .flatMap(m => m.definitions)
        .filter(d => d.example)
        .map(d => d.example)
        .slice(0, 3);

    // Determine if we can build a quiz
    const canBuildQuiz = realSynonym && distractorWords.length >= 2;

    // Create synonyms array for quiz (real + distractors)
    const quizSynonyms = canBuildQuiz
        ? shuffleArray([realSynonym, ...distractorWords].slice(0, 3))
        : [];

    return {
        word: data.word,
        definition: combinedDefinition,
        pronunciation: data.phonetic || (data.phonetics && data.phonetics[0]?.text) || "N/A",
        audio: getAudioUrl(apiResponse), // New field
        synonyms: quizSynonyms,
        correctSynonym: realSynonym || "",
        etymology: "Use AI for better results",
        examples: examples.length > 0 ? examples : ["No examples available"],
        origin: "Use AI for better results",
        mnemonic: "Use AI for better results"
    };
}
