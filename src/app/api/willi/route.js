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
  model: process.env.GOOGLE_GEMINI_API_MODET_TEXT,
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
  console.log("@@@@@@@ POST POST ")
  console.log(dataR)
  try {
    
    const finalPrompt = getPrompt(dataR.item,jsonToPrompt(dataR.maker),jsonToPrompt(dataR.estudio),jsonToPrompt(dataR.estrategia),jsonToPrompt(dataR.post));
    if(dataR.item=="post-final-img"){
      const fileMetaName = btoa(dataR.post.titulo);
      function saveBinaryFile(fileName, content) {
        writeFile(fileName, content, 'utf8', (err) => {
          if (err) {
            console.error(`Error writing file ${fileName}:`, err);
            return;
          }
          console.log(`File ${fileName} saved to file system.`);
        });
      }

    /*  async function savePostImg(data){    
            connectDB();
            const newData = new PostImage(data)
            const savedData = await newData.save() 
            console.log(savedData);          
            return NextResponse.json({"message": "holas proyecto POST"});
      }
            */
      
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
        const model = process.env.GOOGLE_GEMINI_API_MODET_IMAGE;
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
        for await (const chunk of response) {
          if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
            continue;
          }
          if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
            const fileName = `${process.env.POST_IMAGES_DIR}/${fileMetaName}`;
            const inlineData = chunk.candidates[0].content.parts[0].inlineData;
            const fileExtension = mime.getExtension(inlineData.mimeType || '');
            const buffer = Buffer.from(inlineData.data || '', 'base64');
            saveBinaryFile(`${fileName}.${fileExtension}`, buffer);
            //savePostImg(`${fileName}.${fileExtension}`)
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
      let williArray = new Array();
      williArray.push(JSON.parse(willJSON))
      let data = williArray;

      return NextResponse.json(data);
    }else{
      const result = await model.generateContent(finalPrompt); 
      let williTxt = result.response.text()
      let willJSON = jsonPure(williTxt)
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