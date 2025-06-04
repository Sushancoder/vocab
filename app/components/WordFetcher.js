async function WordFetcher({ usedWords, apiKey, type }) {
  try {
    const response = await fetch("/api/sender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ usedWords, apiKey, type }),
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
