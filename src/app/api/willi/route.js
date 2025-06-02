import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import EstudioMercado from "@/models/EstudioMercado";
import JsonToPrompt from "@/utils/JsonToPrompt";
import getPrompt from "@/ia-utils/templates-Prompts";
import jsonPure from "@/utils/jsonPure";

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
  const makerData = data.maker;
  const estudioData = data.estudio;
  const estrategiaData = data.estrategia;
  const finalPrompt = getPrompt(makerData,estudioData,estrategiaData);
  console.log("++++++++ WILLI SAY +++++++++")
  console.log(`GET PROMPT: ${makerData},${estudioData},${estrategiaData}`)

  try {
    const result = await model.generateContent(finalPrompt); 
    console.log("++++++++ WILLI Generate content say +++++++++")
    console.log(`reult ${jsonPure(JSON.stringify(result.response.text()))}`)   

    return NextResponse.json(jsonPure(result.response.text()));

  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}