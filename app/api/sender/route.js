import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
// import mime from 'mime';
// import { writeFile } from 'fs';
import 'dotenv/config'; // To access the env. Var (It works)



// Gemini Text Response Function:

// certain: Help me understand the word "Given" by providing its details

async function geminiText(exclusions, apiKey, type) {
    let responseText = '';
    
    let format = `${type} in the following JSON format:
            {
            "word": "The word",
            "definition": "Clear and coherent definition, 2 definitions distincted with or.",
            "pronunciation": "The pronunciation of the word",
            "synonyms": ["this array hold 3 plausible synonyms out of which one is the correct synonym", "Synonym2", "Synonym3"],
            "correctSynonym": "one of the correct synonyms",
            "etymology": "Brief etymology of the word",
            "examples": ["Example1", "Example2", "Example3"],
            "origin": "Historical origin and first known use",
            "mnemonic": "A helpful mnemonic to remember the word",
            "imageGen": "A prompt with proper context to generate the best possible relevant image to help learn the word. Try to relate it to the previous mnemonic",
            }
            Make sure the response is valid JSON that can be parsed with JSON.parse().
            And don't provide any of these words:
            ${exclusions}
    `
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing');
    }

    const ai = new GoogleGenAI({
        apiKey: apiKey,
    });
    const tools = [
        // { googleSearch: `${format}` },
    ];

    const config = {
        // responseMimeType: 'text/plain',
        responseMimeType: 'application/json',
        systemInstruction: `You are a vocabulary expert that helps people learn new words. Provide accurate and educational word details in the specified JSON format.`
    };
    const model = 'gemini-2.0-flash';
    // const model = 'gemini-2.5-flash-preview-04-17';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: `${format}`,
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

    try {
        return JSON.parse(responseText);
    } catch (error) {
        console.error('Failed to parse API response:', error);
        throw new Error('Received invalid JSON response from the API');
    }
}



export async function POST(req) {
    try {
        const body = await req.json();
        // console.log("The body is", body)

        let textData = "";

        if (body.type === "random123") {
            textData += "Generate a new random word with its details"
        }
        else{
            textData += `Help me understand the word "${body.type}" by providing its details`
            body.usedWords = ""
        }
        
        const wordData = await geminiText(body.usedWords, body.apiKey, body.type);
        // console.log(wordData)

        return NextResponse.json({
            success: true,
            message: 'Word generated successfully',
            data: wordData
        });

    } catch (error) {
        console.error("Error generating word:", error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate word' },
            { status: 500 }
        );
    }
}