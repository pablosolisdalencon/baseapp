import { Anthropic } from '@anthropic-ai/sdk';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Inicializar el cliente de Anthropic con tu clave API
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
    return res.status(200).json({ 
      response: completion.content[0].text,
      usage: {
        prompt_tokens: completion.usage.input_tokens,
        completion_tokens: completion.usage.output_tokens,
        total_tokens: completion.usage.input_tokens + completion.usage.output_tokens
      }
    });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return res.status(500).json({ 
      error: 'Failed to communicate with AI service',
      details: error.message 
    });
  }
}
