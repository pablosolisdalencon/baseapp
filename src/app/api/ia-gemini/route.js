import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  tools: [
    {
      codeExecution: {},
    },
  ],
});

/**
 * API route for generating content using Gemini AI model.
 */
export async function POST(req) {
  /**
   * Get the prompt from the request body.
   */
  const data = await req.json();
  const prompt = data.text || "Explain how AI works";

  /**
   * Use the Gemini AI model to generate content from the prompt.
   */
  try {
    const result = await model.generateContent(prompt);

    /**
     * Return the generated content as a JSON response.
     */
    console.log(result.response.text())
    return NextResponse.json({
      summary: result.response.text(),
    });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}