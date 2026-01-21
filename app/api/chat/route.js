import { convertToModelMessages, streamText } from 'ai';
import { createGoogleGenerativeAI } from "@ai-sdk/google";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req) {
    const { messages } = await req.json();

    const apiKey = req.headers.get('x-goog-api-key');

    // Server-side request limit enforcement
    // Users with API keys are trusted and have unlimited access
    // Free users (without API key) are limited to MAX_FREE_REQUESTS per day
    const MAX_FREE_REQUESTS = 15;
    if (!apiKey) {
        const reqcountHeader = req.headers.get('x-request-count');
        const reqcount = reqcountHeader ? parseInt(reqcountHeader, 10) : 0;

        if (reqcount >= MAX_FREE_REQUESTS) {
            return new Response(
                JSON.stringify({
                    error: 'Free request limit reached. Please add an API key to continue.'
                }),
                {
                    status: 429,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
    }

    const google = createGoogleGenerativeAI({
        apiKey: apiKey || process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });
    console.log("API Key: ", apiKey);

    let model = "gemini-2.5-flash"
    if (!apiKey) {
        model = "gemma-3-27b-it"
    }

    const result = streamText({
        model: google(model),
        system: `
            You are a helpful, rhetoric and knowledgeable assistant.
            Format your responses with clear paragraphs and bullet points where appropriate.
            
            At the end inform the user what's incorrect grammatically or linguistically in their prompt. Like grammar, punctuation, etc. (Only when its necessary.)
            Or,
            - If their prompt can be framed properly (perhaps, by using advanced words, eloquently.), suggest the  better way to write them. Ultimately improve their language skills.
            - Strictly: Enclose the grammar part in the tag <grammar></grammar>  
            - Don't suggest the improvement, if it isn't necessary.
            - Be laconic.
             `
        ,
        messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
}
