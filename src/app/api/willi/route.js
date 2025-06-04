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
<<<<<<< HEAD
  console.log("++++++++ WILLI SAY data +++++++++")
  console.log(data)
  let makerData= null
  let estudioData= null
  let estrategiaData= null
  if(data.maker){
    console.log("++++++++ WILLI SAY {hay maker}+++++++++")
    const makerData = data.maker;
  }
  if(data.estudio){
    const estudioData = data.estudio;
    console.log("++++++++ WILLI SAY {hay estudio}+++++++++")
  }
  if(data.estrategia){
    const estrategiaData = data.estrategia;
    console.log("++++++++ WILLI SAY {hay estrategia}+++++++++")
  }
   
  
=======
  const makerData = JsonToPrompt(data.maker);
  const estudioData = JsonToPrompt(data.estudio);
  const estrategiaData = JsonToPrompt(data.estrategia);
>>>>>>> 622eccce733ff14852b0ad547f45e5dead89d5bd
  const finalPrompt = getPrompt(makerData,estudioData,estrategiaData);

  try {
<<<<<<< HEAD
    const result = await model.generateContent(finalPrompt); 
    console.log("++++++++ WILLI Generate content say +++++++++")
    console.log(`reult ${result.response.text()}`)   
=======
    const result = await model.generateContent(finalPrompt);    
>>>>>>> 622eccce733ff14852b0ad547f45e5dead89d5bd

    return NextResponse.json(result.response.text());

  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}