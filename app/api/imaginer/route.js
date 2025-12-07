import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";
import mime from 'mime';
import 'dotenv/config';


async function geminiImage(prompt, apiKey) {
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing');
    }

    const ai = new GoogleGenAI({
        apiKey: apiKey,
    });
    const config = {
        responseModalities: [
            'IMAGE',
            'TEXT',
        ],
        responseMimeType: 'text/plain',
    };
    const model = 'gemini-2.0-flash-preview-image-generation';
    const contents = [
        {
            role: 'user',
            parts: [
                {
                    text: `Generate the described image: ${prompt}`,
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
        if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
            continue;
        }
        if (chunk.candidates[0].content.parts[0].inlineData) {
            const fileName = 'image';
            const inlineData = chunk.candidates[0].content.parts[0].inlineData;
            const fileExtension = mime.getExtension(inlineData.mimeType || '');
            const buffer = Buffer.from(inlineData.data || '', 'base64');
            return `data:image/png;base64,${inlineData.data}`;
        }
        else {
            console.log(chunk.text);
        }
    }
}


export async function GET(req) {
    try {
        const { searchParams } = req.nextUrl;
        const prompt = searchParams.get('prompt');
        const apiKey = searchParams.get('apiKey');

        // console.log(prompt)
        const image = await geminiImage(prompt, apiKey)

        return NextResponse.json({
            success: true,
            message: 'Image generated successfully',
            image: image
        });

    } catch (error) {
        console.error("Error generating image:", error);
        return NextResponse.json(
            { success: false, error: 'Failed to generate image' },
            { status: 500 }
        );
    }
}