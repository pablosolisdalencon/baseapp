"use client";

import React, { useEffect, useState } from "react";
import { useTokens, getPrice, validarSaldo } from "../tokens/simpleTokens";
import {
  MarketingContentManagerProps,
  CampaniaMarketingData,
  Semana,
  Dia
} from "../../types/marketingWorkflowTypes";

import { useSession } from 'next-auth/react'; // Importar useSession correctamente

interface GeneratedContent {
  texto: string | null;
  imagen: string | null;
}


// REMOVED `async` from the component function
const MarketingContentManager: React.FC<MarketingContentManagerProps> = ({ CampaniaMarketingData }) => {
  // Estado para la sesión y el saldo
  const { data: session, status } = useSession(); 


  /*   SALDO 
  const [saldo, setSaldo] = useState<number | null>(null); // Nuevo estado para el saldo

  // Effect para validar el saldo una vez que la sesión esté cargada
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      // Validar saldo es una función sincrónica o debería serlo para un Client Component
      // Si validarSaldo es asíncrona, debe ser manejada dentro de este useEffect con un await
      const currentSaldo = validarSaldo(session.user.email);
      setSaldo(currentSaldo as unknown as any);
    } else if (status === 'unauthenticated' || status === 'loading') {
      setSaldo(null); // O un valor por defecto si no hay sesión
    }
  }, [session, status]); // Dependencias: sesión y su estado
  */



  if (!CampaniaMarketingData) {
    return (
      <>
        Opps No hay Campaña para gestionar!
      </>
    );
  }

  const campaignData = CampaniaMarketingData;
 let saldo =100;
  
  const [postError, setPostError] = useState<Map<string, string | null>>(new Map());
  const [price, setPrice] = useState<number | null>(null);
  const [generatedPosts, setGeneratedPosts] = useState<Map<string, GeneratedContent>>(new Map());
  const [generatingStates, setGeneratingStates] = useState<Map<string, boolean>>(new Map());

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
    const getThisPrice = async () => {
      const responsePrice = await getPrice("generate-post");
      if (responsePrice !== null) {
        setPrice(responsePrice);
      } else {
        console.warn("MarketingContentManager: No se pudo obtener el precio para generate-post.");
      }
    };
    getThisPrice();
  }, []);

  const getKey = (weekIndex: number, dayIndex: number) => `${weekIndex}_${dayIndex}`;

  const handleUseTokens = async (action: string, objectAction: any) => {
    const key = getKey(objectAction.week, objectAction.day);
    setGeneratingStates((prev) => new Map(prev).set(key, true));
    setPostError((prev) => new Map(prev).set(key, null));

    try {
      const exec = await useTokens(action, objectAction);

      if (exec && exec.generated) {
        if (typeof exec.generated.texto === 'string' && exec.generated.texto.startsWith("Error:")) {
          setPostError((prev) => new Map(prev).set(key, exec.generated.texto));
        } else if (exec.generated.texto === "Saldo Insuficiente.") {
          setPostError((prev) => new Map(prev).set(key, "Saldo insuficiente para generar este post."));
        } else {
          setGeneratedPosts((prev) => {
            const newMap = new Map(prev);
            newMap.set(key, { texto: exec.generated.texto, imagen: exec.generated.imagen });
            return newMap;
          });
        }
       

      } else {
        console.warn("MarketingContentManager: La función useTokens no devolvió un resultado esperado.", exec);
        setPostError((prev) => new Map(prev).set(key, "Error inesperado durante la generación del contenido."));
      }
    } catch (error: any) {
      console.error("MarketingContentManager: Error al llamar a useTokens o procesar su resultado:", error);
      setPostError((prev) => new Map(prev).set(key, error.message || "Error desconocido al procesar la acción."));
    } finally {
      setGeneratingStates((prev) => new Map(prev).set(key, false));
    }
  };

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
        <h2 className={commonClasses.sectionTitle}>Planificación de Contenido - Saldo: 🪙{saldo !== null ? saldo : 'Cargando...'}</h2>
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
                          <img src={generatedContent.imagen} alt="Imagen generada" className="max-w-xs rounded-md shadow-md mt-1"/>
                        </>
                      )}
                    </div>
                  )}

                  {isGenerating && (
                    <p className="text-purple-600 italic mt-2">Generando contenido...</p>
                  )}
                  {currentPostError && (
                    <p className={commonClasses.errorText}>{currentPostError}</p>
                  )}

                  <div className={commonClasses.buttonGroup}>
                    {status === 'authenticated' && ( // Solo mostrar el botón si la sesión está autenticada
                      <button
                        onClick={() =>
                          handleUseTokens("generate-post", { week: weekIndex, day: dayIndex, post})
                        }
                        className={`${commonClasses.buttonBase} ${commonClasses.buttonGenerate} ${
                          isGenerating || saldo === null || saldo < (price || 0) ? commonClasses.buttonDisabled : ""
                        }`}
                        disabled={isGenerating || price === null || saldo === null || saldo < (price || 0)}
                        title={
                          price === null ? "Precio no disponible" :
                          saldo === null ? "Cargando saldo..." :
                          saldo < (price || 0) ? "Saldo insuficiente" : "Generar post"
                        }
                      >
                        {isGenerating ? "Generando..." : `Generar Post 🪙 ${price !== null ? price : 'N/A'}`}
                      </button>
                    )}
                    {status === 'loading' && (
                        <p className="text-gray-500 italic">Cargando sesión...</p>
                    )}
                    {status === 'unauthenticated' && (
                        <p className="text-red-500 italic">Debes iniciar sesión para generar contenido.</p>
                    )}
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

