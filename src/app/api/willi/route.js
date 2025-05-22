import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import EstudioMercado from "@/models/EstudioMercado";
import JsonToPrompt from "@/utils/JsonToPrompt";
import getPrompt from "@/ia-utils/templates-Prompts";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-001",
  system_instruction: {
    parts: [
      {
        text: `Eres una IA experta en Marketing, Neuroventas, Psicología, Optimización de Recursos y Administración de Empresas`
      }
    ]
  },
  tools: [
    {
      codeExecution: {},
    },
    
  ]
});

export async function POST(req) {
  const data = await req.json();
  const makerData = JsonToPrompt(data.maker);
  const estudioData = JsonToPrompt(data.estudio);
  const estrategiaData = JsonToPrompt(data.estrategia);
  const finalPrompt = getPrompt(makerData,estudioData,estrategiaData);

  console.log(finalPrompt)

  try {
    const result = await model.generateContent(finalPrompt);    

    return NextResponse.json(result.response.text());

  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}