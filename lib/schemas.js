import { z } from "zod";

export const wordSchema = z.object({
    word: z.string().describe("The word"),
    definition: z.string().describe("Clear and coherent definition, 2 definitions distincted with or."),
    pronunciation: z.string().describe("The pronunciation of the word"),
    synonyms: z.array(z.string()).length(3).describe("3 plausible synonyms out of which one is the correct synonym"),
    correctSynonym: z.string().describe("one of the correct synonyms"),
    etymology: z.string().describe("Brief etymology of the word"),
    examples: z.array(z.string()).describe("3 examples using the word"),
    origin: z.string().describe("Historical origin and first known use"),
    mnemonic: z.string().describe("A helpful mnemonic to remember the word"),
    audio: z.string().optional().describe("Audio URL for the word"),
});
