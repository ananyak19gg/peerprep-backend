import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("❌ GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function callGemini(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const result = await model.generateContent(prompt);
  return result.response.text();
}
