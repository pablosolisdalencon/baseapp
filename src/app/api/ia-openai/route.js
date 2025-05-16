export const dynamic = 'force-dynamic'; // permite que sea SSR

export async function POST(req) {
  try {
    console.log("==================:POSTEO");
    const { message } = await req.json();
    console.log(`==================:Message: ${message}`);

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
