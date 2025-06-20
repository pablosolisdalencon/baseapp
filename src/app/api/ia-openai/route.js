export const dynamic = 'force-dynamic'; // permite que sea SSR
import { connectDB } from '../../../utils/mongoose'; // For Price model
import Price from '@/models/Price'; // Import Price model
import { getServerSession } from 'next-auth/next'; // Import for session
import { authOptions } from '../auth/[...nextauth]/route'; // Import authOptions

// Define the action name for price lookup
const actionName = "generar post openai";

export async function POST(req) {
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
    const host = req.headers.get('host');
    const absoluteUrl = `${protocol}://${host}/api/user/decrement-tokens`;

    const tokenDecrementResponse = await fetch(absoluteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': req.headers.get('cookie') || "", // Forward cookies
      },
      body: JSON.stringify({ tokensToDecrement }),
    });

    if (!tokenDecrementResponse.ok) {
      const errorData = await tokenDecrementResponse.json().catch(() => ({ message: 'Failed to parse error response from token decrement service.' }));
      // Ensure the status from tokenDecrementResponse is used
      return new Response(JSON.stringify({ message: errorData.message || 'Failed to decrement tokens.' }), { status: tokenDecrementResponse.status, headers: { 'Content-Type': 'application/json' } });
    }

    // 4. If token deduction is successful, proceed with original OpenAI API logic
    console.log("==================:POSTEO (after token deduction)");
    const { message } = await req.json();
    console.log(`==================:Message: ${message}`);

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required for OpenAI API' }), { status: 400 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Eres un asistente útil.' },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      }),
    });

    console.log(`==================:Response: ${JSON.stringify(response)}`);

    if (!response.ok) {
      const errorData = await response.json();
      return new Response(JSON.stringify({ error: errorData }), { status: 500 });
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content;

    return new Response(JSON.stringify({ message: aiMessage }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
