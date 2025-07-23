'use client';

import React, { useEffect, useState } from "react";
import { Spinner } from '@heroui/react';
import {
  CampaniaMarketingData,
  Semana,
  Dia,
  // Asegúrate de importar tus tipos de marketingWorkflowTypes
} from "@/types/marketingWorkflowTypes";

// Importar la Server Action
import { executeMarketingAction } from "@/components/willi/StepByStepWilliActions"; // Ajusta la ruta

interface GeneratedContent {
  texto: string | null|undefined;
  imagen: string | null|undefined;
}

interface MarketingContentManagerProps {
  CampaniaMarketingData: CampaniaMarketingData | null;
}

const MarketingContentManager: React.FC<MarketingContentManagerProps> = ({ CampaniaMarketingData }) => {
  // Ya no necesitas useSession aquí si la Server Action maneja la autenticación
  // const { data: session, status } = useSession(); // REMOVED

  const [postError, setPostError] = useState<Map<string, string | null>>(new Map());
  const [price, setPrice] = useState<number | null>(null); // Todavía necesitas el precio para mostrar en el botón
  const [generatedPosts, setGeneratedPosts] = useState<Map<string, GeneratedContent>>(new Map());
  const [generatingStates, setGeneratingStates] = useState<Map<string, boolean>>(new Map());

  // ... (commonClasses tal cual) ...
  const commonClasses = {
    container: "bg-white p-8 rounded-lg shadow-xl w-full max-w-6xl mx-auto my-8 font-sans",
    section: "mb-10 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md border border-blue-100",
    sectionTitle: "text-3xl font-extrabold text-indigo-800 mb-6 pb-4 border-b-2 border-indigo-200 tracking-tight",
    postContainer: "p-3 bg-gray-50 rounded-md border border-gray-100 mb-4",
    generatedContentContainer: "bg-green-50 p-4 rounded-md mt-4 border border-green-200",
    errorText: "text-red-600 text-sm mt-1",
    buttonGroup: "flex flex-wrap gap-3 mt-4",
    buttonBase: "px-5 py-2 rounded-md font-semibold text-white transition-colors duration-200 ease-in-out",
    buttonGenerate: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
    buttonDisabled: "bg-gray-400 cursor-not-allowed",
  };

  useEffect(() => {
    // Aquí puedes hacer una llamada a una Server Action para obtener el precio
    const getInitialPrice = async () => {
      // Necesitarás una Server Action específica para obtener solo el precio si no quieres ejecutar toda la lógica.
      // Por simplicidad, aquí simulamos una llamada directa o podrías crear una Server Action 'getPricingInfo'
      const responsePrice = await executeMarketingAction("get-price", { action: "generate-post" }); // O una Server Action más simple
      if (responsePrice && 'generated' in responsePrice && typeof responsePrice.generated === 'number') { // Asumiendo que get-price devuelve solo un número en 'generated'
        setPrice(responsePrice.generated);
      } else {
        console.warn("MarketingContentManager: No se pudo obtener el precio inicial.");
      }
    };
    getInitialPrice();
  }, []);

  const getKey = (weekIndex: number, dayIndex: number) => `${weekIndex}_${dayIndex}`;

  const handleExecuteAction = async (action: string, objectAction: any) => {
    const key = getKey(objectAction.week, objectAction.day); // Para posts
    setGeneratingStates((prev) => new Map(prev).set(key, true));
    setPostError((prev) => new Map(prev).set(key, null));

    try {
      // Invocar la Server Action
      const result = await executeMarketingAction(action, objectAction);

      if ('error' in result) {
        setPostError((prev) => new Map(prev).set(key, result.error));
      } else if ('generated' in result && result.generated) {
        setGeneratedPosts((prev) => {
          const newMap = new Map(prev);
          newMap.set(key, { texto: result.generated?.texto, imagen: result.generated?.imagen });
          return newMap;
        });
      } else {
        console.warn("MarketingContentManager: La Server Action no devolvió un resultado esperado.", result);
        setPostError((prev) => new Map(prev).set(key, "Error inesperado durante la generación del contenido."));
      }
    } catch (error: any) {
      console.error("MarketingContentManager: Error al llamar a la Server Action:", error);
      setPostError((prev) => new Map(prev).set(key, error.message || "Error desconocido al procesar la acción."));
    } finally {
      setGeneratingStates((prev) => new Map(prev).set(key, false));
    }
  };

  const campaignData = CampaniaMarketingData;

  if (!campaignData || !campaignData.contenido || campaignData.contenido.length === 0) {
    return (
      <div className={commonClasses.container}>
        <h2 className="text-2xl font-bold text-center text-gray-700">
          No hay datos de campaña o planificación de contenido disponible.
        </h2>
      </div>
    );
  }

  return (
    <div className={commonClasses.container}>
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8 pb-4 border-b-4 border-indigo-400">
        Gestor de Contenido de Campaña: {campaignData.nombre || "Sin Nombre"}
      </h1>

      <section className={commonClasses.section}>
        <h2 className={commonClasses.sectionTitle}>Planificación de Contenido </h2>
        <img src="/step4.png" className="flow-img" alt="Flow Diagram" />
        {campaignData.contenido.map((semana: Semana, weekIndex: number) => (
          <div key={semana.numero} className="mb-8 p-6 bg-blue-50 rounded-lg shadow-md border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Semana {semana.numero}</h3>
            {semana.dias.map((dia: Dia, dayIndex: number) => {
              const post = dia.post;
              const key = getKey(weekIndex, dayIndex);
              const generatedContent = generatedPosts.get(key);
              const isGenerating = generatingStates.get(key) || false;
              const currentPostError = postError.get(key);

              return (
                <div key={dia.fecha} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
                  <p className="text-md font-bold text-indigo-700 mb-2">
                    Día: {dia.nombre} ({dia.fecha})
                  </p>
                  <div className={commonClasses.postContainer}>
                    <h5 className="text-base font-semibold text-gray-900 mb-2">Post Original</h5>
                    <p><strong>Título:</strong> {post.titulo}</p>
                    <p><strong>Contenido:</strong> {post.texto}</p>
                    {post.imagen && <p><strong>Imagen (prompt):</strong> {post.imagen}</p>}
                  </div>

                  {generatedContent && (generatedContent.texto || generatedContent.imagen) && !currentPostError && (
                    <div className={commonClasses.generatedContentContainer}>
                      <h5 className="text-base font-semibold text-green-800 mb-2">Contenido Generado</h5>
                      {generatedContent.texto && (
                        <>
                          <p className="font-semibold">Texto:</p>
                          <textarea
                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm resize-none"
                            rows={5}
                            readOnly
                            value={generatedContent.texto}
                          />
                        </>
                      )}
                      {generatedContent.imagen && (
                        <>
                          <p className="font-semibold mt-2">Imagen Generada:</p>
                          <img src={`data:image/jpeg;base64,${generatedContent.imagen}`} alt="Imagen generada" className="max-w-xs rounded-md shadow-md mt-1" />
                        </>
                      )}
                    </div>
                  )}

                  {isGenerating && (
                    <><Spinner classNames={{ label: "text-foreground mt-4" }} label="wave" variant="wave" /><p className="text-purple-600 italic mt-2">Generando contenido...</p></>
                  )}
                  {currentPostError && (
                    <p className={commonClasses.errorText}>{currentPostError}</p>
                  )}

                  <div className={commonClasses.buttonGroup}>
                    {/* El estado de autenticación (status) se debería obtener de la sesión inicial del Server Component o de un contexto.
                        Si solo se necesita para habilitar/deshabilitar el botón, podría pasarse como prop o el botón se renderizaría condicionalmente desde un Server Component padre.
                        Para este ejemplo, asumimos que `price` y la autenticación se manejan a través de la Server Action o props.
                     */}
                    <button
                      onClick={() =>
                        handleExecuteAction("generate-post", { week: weekIndex, day: dayIndex, post })
                      }
                      className={`${commonClasses.buttonBase} ${commonClasses.buttonGenerate} ${
                        isGenerating || price === null ? commonClasses.buttonDisabled : "" // Ya no necesitamos 'saldo' aquí directamente
                      }`}
                      disabled={isGenerating || price === null} // Simplificado, ya que la Server Action valida saldo
                      title={
                        price === null ? "Cargando precio..." : "Generar post"
                      }
                    >
                      {isGenerating ? "Generando..." : `Generar Post ${price !== null ? price : 'N/A'}`}
                    </button>
                    {/* Si necesitas mostrar el estado de autenticación en el cliente: */}
                    {/* <p className="text-red-500 italic">Debes iniciar sesión para generar contenido.</p> */}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </section>
    </div>
  );
};

export default MarketingContentManager;