// src/app/ewave-maker/_components/GeneratedPostCard.tsx
'use client';

import React from 'react';
import { GeneratedPost } from '@/types/marketingWorkflowTypes';

interface GeneratedPostCardProps {
  post: GeneratedPost;
  onSave?: (post: GeneratedPost) => Promise<void> | void;
  onOptimize?: (post: GeneratedPost) => Promise<void> | void;
  onRetry?: (post: GeneratedPost) => Promise<void> | void;
  showSaveButton?: boolean;
  showOptimizeButton?: boolean;
  showRetryButton?: boolean;
  isRetryDisabled?: boolean;
  isLoading?: boolean; // Para mostrar un spinner si el post se está generando
}

const GeneratedPostCard: React.FC<GeneratedPostCardProps> = ({
  post,
  onSave,
  onOptimize,
  onRetry,
  showSaveButton = true,
  showOptimizeButton = true,
  showRetryButton = true,
  isRetryDisabled = false,
  isLoading = false,
}) => {
  const handleSaveClick = () => { if (onSave) onSave(post); };
  const handleOptimizeClick = () => { if (onOptimize) onOptimize(post); };
  const handleRetryClick = () => { if (onRetry) onRetry(post); };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6 flex flex-col items-center text-center">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-48 w-full bg-gray-100 rounded-md">
          <svg className="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Generando post...</p>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-bold text-gray-800 mb-4">{post.originalPostData?.titulo || `Post Generado #${post.id.substring(0, 8)}`}</h3>

          {post.image ? (
            // Asegúrate de que la imagen base64 tenga el prefijo adecuado (ej. data:image/png;base64,)
            <img
              src={`data:image/png;base64,${post.image}`} // Asumiendo PNG, ajusta si es otro formato
              alt={post.originalPostData?.titulo || "Imagen del Post"}
              className="w-full max-h-64 object-contain rounded-md mb-4 border border-gray-300"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-md mb-4 text-gray-500 italic">
              Imagen no disponible
            </div>
          )}

          <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap mb-6">{post.text}</p>

          <div className="flex flex-wrap justify-center space-x-2 space-y-2 sm:space-y-0 mt-auto">
            {showSaveButton && (
              <button
                onClick={handleSaveClick}
                className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 transition-colors duration-200"
              >
                GUARDAR
              </button>
            )}
            {showOptimizeButton && (
              <button
                onClick={handleOptimizeClick}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 transition-colors duration-200"
              >
                Willi, Optimizalo!
              </button>
            )}
            {showRetryButton && (
              <button
                onClick={handleRetryClick}
                disabled={isRetryDisabled}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 ${
                  isRetryDisabled
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-yellow-500 text-white hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75'
                }`}
              >
                Reintentar
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GeneratedPostCard;