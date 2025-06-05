import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import getPrompt from "@/ia-utils/templates-Prompts";
import jsonPure from "@/utils/jsonPure";
import jsonToPrompt from "@/utils/JsonToPrompt";

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
  const dataR = await req.json();
  /*
  console.log("++++++++ WILLI SAY data +++++++++")
  console.log(data)
  let makerData= null
  let estudioData= null
  let estrategiaData= null
  if(data.maker!=null){
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
 
  
  const finalPrompt = getPrompt(makerData,estudioData,estrategiaData);
   */
  

  try {
    //console.log(`++++++++ WILLI Generate trying ++++++++ ${data.maker},${data.estudio},${data.estrategia}`)
    
    
    const finalPrompt = getPrompt(dataR.item,jsonToPrompt(dataR.maker),jsonToPrompt(dataR.estudio),jsonToPrompt(dataR.estrategia));
    const result = await model.generateContent(finalPrompt); 
    console.log("++++++++ WILLI Prompt?  +++++++++")
    console.log(finalPrompt)
    


    
    let williTxt = result.response.text()
    let willJSON = jsonPure(williTxt)
    //let williJsonString = JSON.stringify(williTxt);
    let williArray = new Array();
    williArray.push(JSON.parse(willJSON))
    let data = williArray;
    console.log("++++++++ WILLI Generate content say : data +++++++++")
    console.log(data)
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}