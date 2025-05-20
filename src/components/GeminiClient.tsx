'use client';

import { useState } from 'react';

export default function GeminiClient() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setResponse('');

    try {
      const res = await fetch('/api/ia-gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          { 
            prompt: input 
          }
        ),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.ia);
      } else {
        setResponse(`Error: ${data.error?.message}`);
      }
    } catch (error: any) {
      setResponse(`Error de conexión: ${error.message}`);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat con IA</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe tu mensaje..."
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={sendMessage}
        disabled={loading}
      >
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
      <div className="mt-6 bg-gray-100 p-4 rounded">
        <strong>Respuesta IA:</strong>
        <p className="mt-2 whitespace-pre-wrap">{response}</p>
      </div>
    </div>
  );
}
