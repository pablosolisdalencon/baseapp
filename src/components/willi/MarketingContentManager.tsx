"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTokens, getPrice, validarSaldo } from "../tokens/simpleTokens";
import {
  CampaniaMarketingData,
  Semana,
  Dia
} from "../../types/marketingWorkflowTypes";
import GWV from "@/utils/GWV";
import { useSearchParams } from "next/navigation";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

interface GeneratedContent {
  texto: string | null;
  imagen: string | null;
}

const MarketingContentManager: React.FC = async () => {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = await useSearchParams();
  const idProyecto = searchParams.get("id");
  const saldo = validarSaldo(session?.user?.email)

  const [campaignData, setCampaignData] = useState<CampaniaMarketingData | null>(null);
  const [isFetchingCampaign, setIsFetchingCampaign] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Para errores generales de la página
  const [postError, setPostError] = useState<Map<string, string | null>>(new Map()); // Para errores por post
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

  const fetchCampaignData = async () => {
    setIsFetchingCampaign(true);
    setError(null);
    try {
      const res = await fetch(`/api/campania-marketing?p=${idProyecto}`);
      if (!res.ok) {
        throw new Error(`HTTP error! : ${res}`);
      }
      const jsonData: any = await res.json();
      setCampaignData(jsonData.data);
    } catch (err: any) {
      setError(`Error al cargar Campaign: ${err.message}`);
      setCampaignData(null);
    } finally {
      setIsFetchingCampaign(false);
    }
  };

  useEffect(() => {

    if (session?.user?.email) {
      fetchCampaignData();
    } else if (!session?.user?.email) {
        setError("No se pudo obtener el email del usuario.");
        setIsFetchingCampaign(false);
    }
  }, [session, router]); // Añadir router a las dependencias

  useEffect(() => {
    const getThisPrice = async () => {
      const responsePrice = await getPrice("generate-post");
      if (responsePrice !== null) { // Chequear contra null explícitamente
        setPrice(responsePrice);
      } else {
        console.warn("MarketingContentManager: No se pudo obtener el precio para generate-post.");
        // Podrías setear un error aquí o manejarlo de otra forma si el precio es crucial.
      }
    };
    getThisPrice();
  }, []);

  const getKey = (weekIndex: number, dayIndex: number) => `${weekIndex}_${dayIndex}`;

  const handleUseTokens = async (action: string, objectAction: any) => {

    const key = getKey(objectAction.week, objectAction.day);
    setGeneratingStates((prev) => new Map(prev).set(key, true));
    setPostError((prev) => new Map(prev).set(key, null)); // Limpiar error previo para este post

    try {

      const exec = await useTokens(action, objectAction);

      if (exec && exec.generated) {
        // Si el texto generado indica un error (convención de simpleTokens.js)
        if (typeof exec.generated.texto === 'string' && exec.generated.texto.startsWith("Error:")) {
            setPostError((prev) => new Map(prev).set(key, exec.generated.texto));
            // No actualizar generatedPosts si hubo un error en la generación del contenido en sí
        } else if (exec.generated.texto === "Saldo Insuficiente.") {
            setPostError((prev) => new Map(prev).set(key, "Saldo insuficiente para generar este post."));
        } else {
            setGeneratedPosts((prev) => {
                const newMap = new Map(prev);
                newMap.set(key, { texto: exec.generated.texto, imagen: exec.generated.imagen });
                return newMap;
            });
        }

        // Siempre intentar revalidar y actualizar el saldo del contexto,
        // ya que `useTokens` maneja el descuento internamente si la acción tuvo costo.
        
      } else {
        console.warn("MarketingContentManager: La función useTokens no devolvió un resultado esperado.", exec);
        setPostError((prev) => new Map(prev).set(key, "Error inesperado durante la generación del contenido."));
      }
    } catch (error: any) { // Capturar errores de la llamada a useTokens en sí (ej. si useTokens lanza una excepción)
      console.error("MarketingContentManager: Error al llamar a useTokens o procesar su resultado:", error);
      setPostError((prev) => new Map(prev).set(key, error.message || "Error desconocido al procesar la acción."));
    } finally {
      setGeneratingStates((prev) => new Map(prev).set(key, false));
    }
  };

  if (isFetchingCampaign) {
    return (
      <div className={commonClasses.container}>
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Cargando datos de la campaña...
        </h2>
      </div>
    );
  }

  if (error) { // Error general de carga de la página/campaña
    return (
      <div className={`${commonClasses.container} text-red-700`}>
        <h2 className="text-2xl font-bold text-center">Error:</h2>
        <p className="text-center">{error}</p>
      </div>
    );
  }

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
        <h2 className={commonClasses.sectionTitle}>Planificación de Contenido - Saldo: 🪙{saldo !== null ? saldo : '...'}</h2>
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
                          {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    {session?.user && ( // Asegurar que hay sesión antes de mostrar el botón
                      <button
                        onClick={() =>

                          handleUseTokens("generate-post", { week: weekIndex, day: dayIndex, post})

                        }
                        className={`${commonClasses.buttonBase} ${commonClasses.buttonGenerate} ${
                          isGenerating || saldo === null ? commonClasses.buttonDisabled : ""
                        }`}
                        disabled={isGenerating || price === null}
                        title={
                            price === null ? "Precio no disponible" :"Generar post"
                            
                        }
                      >
                        {isGenerating ? "Generando..." : `Generar Post 🪙 ${price !== null ? price : 'N/A'}`}
                      </button>
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