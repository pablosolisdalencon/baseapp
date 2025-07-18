// src/app/ewave-maker/_components/DisplayMakerData.tsx
'use client';

import React from 'react';
import { MakerData, DisplayProps } from "@/types/marketingWorkflowTypes"

const DisplayMakerData: React.FC<DisplayProps<MakerData>> = ({ Input: makerData, onSave, showSaveButton = false }) => {
  if (!makerData) return null;

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mx-auto my-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 border-b pb-4">
        📊 Ficha del Proyecto: {makerData.proyecto?.nombre}
      </h1>

      <section className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
          Información General del Proyecto
        </h2>
        {makerData.proyecto ? (
          <>
            <p className="text-gray-700 mb-2">
              <strong className="font-medium">Descripción:</strong> {makerData.proyecto.descripcion}
            </p>
            <p className="text-gray-700 mb-2">
              <strong className="font-medium">Misión:</strong> {makerData.proyecto.mision}
            </p>
            <p className="text-gray-700 mb-2">
              <strong className="font-medium">Visión:</strong> {makerData.proyecto.vision}
            </p>
            {makerData.proyecto.frase && (
              <p className="text-gray-700 mb-2 italic">
                <strong className="font-medium">Frase clave:</strong> "{makerData.proyecto.frase}"
              </p>
            )}
            {makerData.proyecto.logo && (
              <div className="mt-4 flex items-center">
                <strong className="font-medium mr-2">Logo:</strong>
                <img src={makerData.proyecto.logo} alt="Logo del proyecto" className="h-12 w-auto object-contain" />
              </div>
            )}
          </>
        ) : (
          <p className="text-gray-500 italic">No se encontró información del proyecto.</p>
        )}
      </section>

      <section className="mb-8 p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
          Catálogo de Productos/Servicios
        </h2>
        {makerData.catalogo && makerData.catalogo.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {makerData.catalogo.map((item, index) => (
              <div key={index} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-indigo-700 mb-2">{item.nombre}</h3>
                <p className="text-gray-700 text-sm mb-2">{item.descripcion}</p>
                <p className="text-gray-800 font-bold">Precio: ${item.precio}</p>
                {item.foto && (
                  <img src={item.foto} alt={item.nombre} className="mt-3 w-full h-32 object-cover rounded-md" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No se encontraron productos o servicios en el catálogo.</p>
        )}
      </section>

      {showSaveButton && onSave && (
        <button
          onClick={() => onSave(makerData)}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Guardar MakerData
        </button>
      )}
    </div>
  );
};

export default DisplayMakerData;