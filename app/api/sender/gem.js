
import { GoogleGenAI, Modality } from '@google/genai';
import 'dotenv/config';
import fs from 'fs';

async function geminiText() {
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
    });
    let responseText = '';
    const config = {
        responseMimeType: 'application/json',
    };
    const model = 'gemma-3n-e4b-it';
    // const model = 'gemini-2.5-flash-preview-05-20';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: `What are a few hosting providers and their proper description?`,
                },
            ],
        },
    ];

    const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
    });
    for await (const chunk of response) {
        // console.log(chunk.text);
        responseText += chunk.text;
    }
    // console.log("The response is:\n", responseText)
}


geminiText();


const geminiImage = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const contents =
        "Hi, can you create a 3d rendered image of a pig " +
        "with wings and a top hat flying over a happy " +
        "futuristic scifi city with lots of greenery?";

    // Set responseModalities to include "Image" so the model can generate  an image
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: contents,
        config: {
            responseModalities: [Modality.TEXT, Modality.IMAGE],
        },
    });
    for (const part of response.candidates[0].content.parts) {
        // Based on the part type, either show the text or save the image
        if (part.text) {
            console.log(part.text);
        } else if (part.inlineData) {
            const imageData = part.inlineData.data;
            const buffer = Buffer.from(imageData, "base64");
            fs.writeFileSync("gemini-native-image.png", buffer);
            console.log("Image saved as gemini-native-image.png");
        }
    }
}