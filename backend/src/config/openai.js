
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use Gemini 2.5 Flash by default
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing in .env file");
}

export const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
