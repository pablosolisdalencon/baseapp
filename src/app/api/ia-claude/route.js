import { Anthropic } from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';
import { connectDB } from '../../../utils/mongoose'; // For Price model
import Price from '@/models/Price'; // Import Price model
import { getServerSession } from 'next-auth/next'; // Import for session
import { authOptions } from '../auth/[...nextauth]/route'; // Import authOptions

// Define the action name for price lookup
const actionName = "generar post claude";

// Manejador para solicitudes POST
export async function POST(request) {
  try {
    // 0. Connect to DB (for Price model)
    await connectDB();

    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user).id) {
      return new Response(JSON.stringify({ message: 'Unauthorized: User not authenticated.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // 2. Fetch the price for the action
    const priceEntry = await Price.findOne({ actionName });
    if (!priceEntry) {
      return new Response(JSON.stringify({ message: `Price not found for action: ${actionName}` }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    const tokensToDecrement = priceEntry.price;
    if (typeof tokensToDecrement !== 'number' || tokensToDecrement <= 0) {
      return new Response(JSON.stringify({ message: `Invalid price configured for action: ${actionName}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // 3. Call token decrement endpoint
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host');
    const absoluteUrl = `${protocol}://${host}/api/user/decrement-tokens`;

    const tokenDecrementResponse = await fetch(absoluteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('Cookie') || '',
      },
      body: JSON.stringify({ tokensToDecrement }),
    });

    if (!tokenDecrementResponse.ok) {
      const errorData = await tokenDecrementResponse.json().catch(() => ({ message: 'Failed to parse error response from token decrement service.' }));
      return new Response(JSON.stringify({ message: errorData.message || 'Failed to decrement tokens.' }), { status: tokenDecrementResponse.status, headers: { 'Content-Type': 'application/json' } });
    }

    // 4. If token deduction is successful, proceed with original Claude API logic
    // Parsear el cuerpo de la solicitud
    const body = await request.json(); // This needs to be after token deduction
    const { message } = body;
    console.log(body)
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required for Claude API' }, // Clarified error message
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