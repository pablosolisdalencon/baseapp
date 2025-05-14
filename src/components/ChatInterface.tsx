"use client";
import { useState, FormEvent } from 'react';
import { Message } from '@/types/Chat';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => Promise<void>;
  loading: boolean;
}

export default function ChatInterface({ messages, onSendMessage, loading }: ChatInterfaceProps) {
  const [input, setInput] = useState<string>('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            Envía un mensaje para iniciar la conversación.
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}
            >
              <div className="message-content">{msg.content}</div>
            </div>
          ))
        )}
        {loading && (
          <div className="message ai-message">
            <div className="message-content loading">
              Pensando...
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={loading}
          className="message-input"
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim()} 
          className="send-button"
        >
          Enviar
        </button>
      </form>
    </div>
  );
}