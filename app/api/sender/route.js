import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import { Resend } from 'resend';
import mime from 'mime';
import { writeFile } from 'fs';
import 'dotenv/config'; // To access the env. Var (It works)


// Resend Email Sending Function:
// const resend = async () => {
//     const resend = new Resend(process.env.RESEND_API_KEY);

//     const { data, error } = await resend.emails.send({
//         from: 'onboarding@resend.dev',
//         to: 'vigorous@freethecookies.com',
//         subject: 'Hello World',
//         html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
//     });

//     if (error) {
//         console.error('Resend error:', error);
//         throw error;
//     }

//     return data;
// }


// Gemini Text Response Function:

async function geminiText(exclusions, apiKey) {
    let responseText = '';

    let format = `Generate a new random word with its details in the following JSON format:
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
            "imageGen": "A prompt with proper context to generate the best possible related image to help learn the word. Relate it to the previous mnemonic",
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
    // const model = 'gemini-2.5-flash-preview-05-20';
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
        // resend();
        const wordData = await geminiText(body.usedWords, body.apiKey);
        console.log(wordData)

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