async function WordFetcher({ usedWords, apiKey, type, useAIMode }) {
  try {
    // Verify and map usedWords to strings if necessary
    const sanitizedUsedWords = usedWords.map(w => typeof w === 'string' ? w : w.word);

    const response = await fetch("/api/sender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usedWords: sanitizedUsedWords, apiKey, type, useAIMode }),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to get word");
    }

    return data;
  } catch (error) {
    throw new Error(error.message || "Failed to get a new word");
  }
}

export default WordFetcher;
