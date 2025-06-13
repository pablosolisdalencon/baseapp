import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import getPrompt from "@/ia-utils/templates-Prompts";
import jsonPure from "@/utils/jsonPure";
import jsonToPrompt from "@/utils/JsonToPrompt";

//gemini-pro-vision
      //gemini-2.0-flash-preview-image-generation
      import {
        GoogleGenAI,
      } from '@google/genai';
      import mime from 'mime';
      import { writeFile } from 'fs';
      

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
    
    
    const finalPrompt = getPrompt(dataR.item,jsonToPrompt(dataR.maker),jsonToPrompt(dataR.estudio),jsonToPrompt(dataR.estrategia),jsonToPrompt(dataR.post));

    
    if(dataR.item=="post-final-img"){
      
      function saveBinaryFile(fileName, content) {
        writeFile(fileName, content, 'utf8', (err) => {
          if (err) {
            console.error(`Error writing file ${fileName}:`, err);
            return;
          }
          console.log(`File ${fileName} saved to file system.`);
        });
      }
      
      async function main() {
        const ai = new GoogleGenAI({
          apiKey: process.env.GOOGLE_GEMINI_API_KEY,
        });
        const config = {
          responseModalities: [
              'IMAGE',
              'TEXT',
          ],
          responseMimeType: 'text/plain',
        };
        const model = 'gemini-2.0-flash-preview-image-generation';
        const contents = [
          {
            role: 'user',
            parts: [
              {
                text: `${finalPrompt}`,
              },
            ],
          },
        ];
      
        const response = await ai.models.generateContentStream({
          model,
          config,
          contents,
        });
        let fileIndex = 0;
        for await (const chunk of response) {
          if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
            continue;
          }
          if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
            const fileName = `public/posts/ENTER_FILE_NAME_${fileIndex++}`;
            const inlineData = chunk.candidates[0].content.parts[0].inlineData;
            const fileExtension = mime.getExtension(inlineData.mimeType || '');
            const buffer = Buffer.from(inlineData.data || '', 'base64');
            console.log("============= IMAGE API Response")
            console.log(response);
            saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
            return inlineData
          }
          else {
            console.log(chunk.text);
          }
        }
      }
      
      
      const result_img = await main(); 
      let williTxt = result_img;
      let willJSON = jsonPure(williTxt)
      //let williJsonString = JSON.stringify(williTxt);
      let williArray = new Array();
      williArray.push(JSON.parse(willJSON))
      let data = williArray;
      console.log("++++++++ WILLI Generate Imagen say : data +++++++++")
      console.log(data)
      return NextResponse.json(data);
    }else{
      const result = await model.generateContent(finalPrompt); 
      let williTxt = result.response.text()
      let willJSON = jsonPure(williTxt)
      //let williJsonString = JSON.stringify(williTxt);
      let williArray = new Array();
      williArray.push(JSON.parse(willJSON))
      let data = williArray;
      console.log("++++++++ WILLI Generate content say : data +++++++++")
      console.log(data)
      return NextResponse.json(data);
    }
    
    
    
    

  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}