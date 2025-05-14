"use client";
import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import { Message } from '@/types/Chat';

export default function WilliClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSendMessage = async (message: string): Promise<void> => {
    setLoading(true);
    
    // Agregar mensaje del usuario a la lista de mensajes
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    
    try {
      // Enviar mensaje a nuestra API
      const response = await fetch('/api/ai/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }
      
      // Agregar respuesta de la IA a la lista de mensajes
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { 
        role: 'system', 
        content: 'Error: Failed to get AI response' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <main>
        <h1>Chat con Claude AI</h1>
        <ChatInterface 
          messages={messages} 
          onSendMessage={handleSendMessage} 
          loading={loading} 
        />
      </main>
    </div>
  );
}