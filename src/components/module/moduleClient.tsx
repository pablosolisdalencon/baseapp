// src/components/MyClientComponent.tsx
"use client"; // ¡Importante! Esto indica que es un Client Component

import React from 'react';

// Interfaz para la estructura de los datos que este componente espera recibir
interface FetchedData {
  id: string;
  name: string;
  description: string;
}

// Interfaz para las props del componente
interface MyClientComponentProps {
  data: FetchedData | null; // Los datos pueden ser nulos si no se encuentran
}

/**
 * MyClientComponent: Componente de cliente que muestra los datos recibidos.
 * Se hidrata en el navegador y permite interactividad (aunque en este ejemplo es solo visual).
 */
const ModuleClientComponent: React.FC<MyClientComponentProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md border border-yellow-200">
        <p className="font-semibold">¡Atención!</p>
        <p>No se encontraron datos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg border border-gray-200 transform hover:scale-105 transition-transform duration-300">
      <h2 className="text-2xl font-extrabold text-blue-700 mb-4 pb-2 border-b-2 border-blue-200">
        Detalles del Elemento
      </h2>
      <div className="space-y-2 text-gray-700">
        <p>
          <strong className="text-gray-900">ID:</strong> {data.id}
        </p>
        <p>
          <strong className="text-gray-900">Nombre:</strong> {data.name}
        </p>
        <p>
          <strong className="text-gray-900">Descripción:</strong> {data.description}
        </p>
      </div>
    </div>
  );
};

export default ModuleClientComponent;