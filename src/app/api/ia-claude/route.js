import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

// Manejador para solicitudes POST
export async function POST(request) {
  try {
    // Parsear el cuerpo de la solicitud
    const body = await request.json();
    const { message } = body;
    console.log(body)
    if (!message) {
      
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Inicializar el cliente de Anthropic con la clave API
    const anthropic = new Anthropic({
      apiKey: process.env.CLAUDE_API_KEY,
    });

    // Llamar a la API de Claude
    const completion = await anthropic.messages.create({
      model: "claude-3-opus-20240229", // Puedes usar el modelo que prefieras
      max_tokens: 1000,
      messages: [
        { role: "user", content: message }
      ]
    });

    // Devolver la respuesta de Claude
    return NextResponse.json({
      response: completion.content[0].text,
      usage: {
        prompt_tokens: completion.usage.input_tokens,
        completion_tokens: completion.usage.output_tokens,
        total_tokens: completion.usage.input_tokens + completion.usage.output_tokens
      }
    });
    
  } catch (error) {
    console.error('Error calling Claude API:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to communicate with AI service',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Manejador para solicitudes GET (opcional, para verificar si la API está funcionando)
export async function GET() {
  return NextResponse.json(
    { status: 'API is running' },
    { status: 200 }
  );
}