async function ImageGenerator({ prompt, apiKey }) {
    if (!prompt) {
        throw new Error('No image generation prompt available');
    }

    try {
        const response = await fetch(`/api/imaginer?prompt=${encodeURIComponent(prompt)}&apiKey=${encodeURIComponent(apiKey)}`);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to get image');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message || 'An error occurred while generating the image');
    }
}

export default ImageGenerator; 