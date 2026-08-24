import { GoogleGenAI } from "@google/genai";

const globalForGemini = globalThis;

function getGeminiClient() {
  if (globalForGemini.gemini) return globalForGemini.gemini;

  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  if (process.env.NODE_ENV !== "production") {
    globalForGemini.gemini = client;
  }

  return client;
}

export async function generateText(prompt) {
  const gemini = getGeminiClient();
  const result = await gemini.models.generateContent({
    model: "gemini-3.6-flash",
    contents: prompt,
  });
  return result.text;
}

export default getGeminiClient;
