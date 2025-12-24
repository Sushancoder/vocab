import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';
import { wordSchema } from '@/lib/schemas';
import {
    findWordWithSynonym,
    fetchDictionaryWord,
    transformDictionaryData,
    shuffleArray
} from '@/lib/dictionary-helper';
import { getAudioUrl } from '@/lib/audioExtractor';

// Gemini Text Response Function:
const jsonSchema = {
    type: 'OBJECT',
    properties: {
        word: { type: 'STRING', description: "The word" },
        definition: { type: 'STRING', description: "Clear and coherent definition, 2 definitions distincted with or." },
        pronunciation: { type: 'STRING', description: "The pronunciation of the word" },
        synonyms: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            minItems: 3,
            maxItems: 3,
            description: "3 plausible synonyms out of which one is the correct synonym"
        },
        correctSynonym: { type: 'STRING', description: "one of the correct synonyms" },
        etymology: { type: 'STRING', description: "Brief etymology of the word" },
        examples: {
            type: 'ARRAY',
            items: { type: 'STRING' },
            description: "3 examples using the word"
        },
        origin: { type: 'STRING', description: "Historical origin and first known use" },
        mnemonic: { type: 'STRING', description: "A helpful mnemonic to remember the word" },
    },
    required: ["word", "definition", "pronunciation", "synonyms", "correctSynonym", "etymology", "examples", "origin", "mnemonic"],
};


async function geminiText(exclusions, apiKey, type) {
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing');
    }

    const ai = new GoogleGenAI({
        apiKey: apiKey,
    });

    const config = {
        responseMimeType: 'application/json',
        responseSchema: jsonSchema,
        systemInstruction: `You are a vocabulary expert that helps people learn new words. Provide accurate and educational word details.`
    };

    const model = 'models/gemini-2.5-flash';

    const prompt = `${type}.
    Make sure to response with valid JSON matching the schema.
    And don't provide any of these words: ${exclusions}`;

    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: prompt,
                },
            ],
        },
    ];

    const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
    });

    let responseText = '';
    for await (const chunk of response) {
        responseText += chunk.text;
    }

    try {
        const parsed = JSON.parse(responseText);
        // Validate with Zod
        return wordSchema.parse(parsed);
    } catch (error) {
        console.error('Failed to parse or validate API response:', error);
        if (error.errors) {
            console.error('Zod Validation Errors:', JSON.stringify(error.errors, null, 2));
        }
        throw new Error('Received invalid JSON response from the API');
    }
}

// Handle Dictionary API requests
async function handleDictionaryAPIRequest(type, usedWords) {
    if (type === "random123") {
        // Random word mode with optimization
        const usedWordsArray = Array.isArray(usedWords) ? usedWords.map(w => w.toLowerCase()) : [];
        const { mainWord, dictData, distractorWords, definitionOnly } = await findWordWithSynonym(usedWordsArray);

        // Transform data
        return transformDictionaryData(
            dictData,
            definitionOnly ? [] : distractorWords
        );
    } else {
        // Specific word search
        const dictData = await fetchDictionaryWord(type);

        if (!dictData) {
            // Word not found in dictionary
            const error = new Error('Definition not available for this word');
            error.statusCode = 404;
            throw error;
        }

        // Use empty array for distractors as we can't easily generate valid quiz 
        // for a specific searched word without finding related words
        return transformDictionaryData(dictData, []);
    }
}




export async function POST(req) {
    try {
        const body = await req.json();
        const { apiKey, type, usedWords, useAIMode } = body;

        // Logic flow:
        // 1. If useAIMode is explicitly true AND apiKey exists -> Use Gemini
        // 2. Default fallback -> Use Dictionary API
        const shouldUseAI = useAIMode === true && !!apiKey;

        let wordData;

        if (shouldUseAI) {
            let textData = "";
            if (type === "random123") {
                textData += "Generate a new random word with its details"
            } else {
                textData += `Help me understand the word "${type}" by providing its details`
                // body.usedWords = "" // Not needed to modify body
            }

            // Pass empty string for usedWords if specific search
            const exclusions = type === "random123" ? usedWords : "";
            wordData = await geminiText(exclusions, apiKey, type === "random123" ? textData : type);

            // Shuffle synonyms from Gemini
            if (wordData.synonyms) {
                wordData.synonyms = shuffleArray(wordData.synonyms);
            }

            // Fetch audio URL from Dictionary API for AI-generated word
            const dictData = await fetchDictionaryWord(wordData.word);
            if (dictData) {
                wordData.audio = getAudioUrl(dictData);
            }
        } else {
            // Use Dictionary API
            console.log("Using Dictionary API fallback");
            wordData = await handleDictionaryAPIRequest(type, usedWords);
        }

        return NextResponse.json({
            success: true,
            message: 'Word generated successfully',
            data: wordData
        });

    } catch (error) {
        console.error("Error generating word:", error);

        const status = error.statusCode || 500;
        const message = error.message || 'Failed to generate word';

        return NextResponse.json(
            { success: false, error: message },
            { status: status }
        );
    }
}