import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

// Asegúrate de tener tu clave de API de Google configurada como una variable de entorno
const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("La clave de API de Google (GOOGLE_API_KEY) no está configurada.");
}

async function generateResponse(prompt) {
  if (!apiKey) {
    return { error: "Clave de API de Google no configurada." };
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.GenerativeModel({ model: "gemini-pro" });

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text;
    return { result: responseText };
  } catch (error) {
    console.error("Error al generar respuesta con Gemini:", error);
    return { error: "Error al generar respuesta con Gemini." };
  }
}

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Se requiere un prompt." }, { status: 400 });
    }

    const aiResponse = await generateResponse(prompt);

    if (aiResponse.error) {
      return NextResponse.json({ error: aiResponse.error }, { status: 500 });
    }

    return NextResponse.json({ result: aiResponse.result });

  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}