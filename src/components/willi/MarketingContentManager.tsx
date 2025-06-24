"use client";
import React, { useState, useEffect } from "react";
import { useTokens, getPrice } from "../tokens/simpleTokens";
import {
  CampaniaMarketingData,
  Semana,
  Dia
} from "../../types/marketingWorkflowTypes";
import GWV from "@/utils/GWV";
import { useSearchParams } from "next/navigation";
import { useSession } from 'next-auth/react';

interface GeneratedContent {
  texto: any | null;
  imagen: any | null;
}

const MarketingContentManager: React.FC = () => {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const idProyecto = searchParams.get("id");

  const [campaignData, setCampaignData] = useState<CampaniaMarketingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [generatedPosts, setGeneratedPosts] = useState<Map<string, GeneratedContent>>(new Map());
  const [generatingStates, setGeneratingStates] = useState<Map<string, boolean>>(new Map());

  const commonClasses = {
    container: "bg-white p-8 rounded-lg shadow-xl w-full max-w-6xl mx-auto my-8 font-sans",
    section: "mb-10 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md border border-blue-100",
    sectionTitle: "text-3xl font-extrabold text-indigo-800 mb-6 pb-4 border-b-2 border-indigo-200 tracking-tight",
    postContainer: "p-3 bg-gray-50 rounded-md border border-gray-100 mb-4",
    generatedContentContainer: "bg-green-50 p-4 rounded-md mt-4 border border-green-200",
    buttonGroup: "flex flex-wrap gap-3 mt-4",
    buttonBase: "px-5 py-2 rounded-md font-semibold text-white transition-colors duration-200 ease-in-out",
    buttonGenerate: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
    buttonDisabled: "bg-gray-400 cursor-not-allowed",
  };

  useEffect(() => {
    const fetchCampaignData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await GWV("check", idProyecto, "campania-marketing");
        setCampaignData(response);
      } catch (err) {
        setError("Failed to fetch campaign data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [idProyecto]);

  useEffect(() => {
    const getThisPrice = async () => {
      const responsePrice = await getPrice("generate-post");
      if (responsePrice) {
        setPrice(responsePrice);
      }
    };
    getThisPrice();
  }, []);

  const getKey = (weekIndex: number, dayIndex: number) => `${weekIndex}_${dayIndex}`;

  const handleUseTokens = async (action: string, objectAction: any) => {
    const key = getKey(objectAction.week, objectAction.day);
    setGeneratingStates((prev) => new Map(prev).set(key, true));

    try {
      const exec = await useTokens(action, objectAction);
      if (exec) {
        setGeneratedPosts((prev) => new Map(prev).set(key, exec.generated));
        setGeneratingStates((prev) => new Map(prev).set(key, false));
      } else {
        setGeneratingStates((prev) => new Map(prev).set(key, false));
      }
    } catch (error) {
      console.error("Error al generar contenido:", error);
      setGeneratingStates((prev) => new Map(prev).set(key, false));
    }
  };

  if (loading) {
    return (
      <div className={commonClasses.container}>
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Cargando datos de la campaña y billetera...
        </h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${commonClasses.container} text-red-700`}>
        <h2 className="text-2xl font-bold text-center">Error al cargar la campaña:</h2>
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
        <h2 className={commonClasses.sectionTitle}>Planificación de Contenido</h2>
        {campaignData.contenido.map((semana: Semana, weekIndex: number) => (
          <div key={semana.numero} className="mb-8 p-6 bg-blue-50 rounded-lg shadow-md border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Semana {semana.numero}</h3>
            {semana.dias.map((dia: Dia, dayIndex: number) => {
              const post = dia.post;
              const key = getKey(weekIndex, dayIndex);
              const generatedContent = generatedPosts.get(key);
              const isGenerating = generatingStates.get(key) || false;

              return (
                <div key={dia.fecha} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                  <p className="text-md font-bold text-indigo-700 mb-2">
                    Día: {dia.nombre} ({dia.fecha})
                  </p>
                  <div className={commonClasses.postContainer}>
                    <h5 className="text-base font-semibold text-gray-900 mb-2">Post Original</h5>
                    <p>Título: {post.titulo}</p>
                    <p>Contenido: {post.texto}</p>
                  </div>
                  <div className={commonClasses.generatedContentContainer}>
                    <h5 className="text-base font-semibold text-green-800 mb-2">Contenido Generado</h5>
                    {isGenerating ? (
                      <p className="text-green-600 italic">Generando contenido...</p>
                    ) : generatedContent ? (
                      <>
                        <textarea
                          className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm resize-none"
                          rows={5}
                          readOnly
                          value={generatedContent.texto}
                        />
                      </>
                    ) : (
                      <p>No se ha generado contenido para este post.</p>
                    )}
                  </div>
                  <div className={commonClasses.buttonGroup}>
                    {session?.user && (
                      <button
                        onClick={() =>
                          handleUseTokens("generate-post", { week: weekIndex, day: dayIndex, post})
                        }
                        className={`${commonClasses.buttonBase} ${commonClasses.buttonGenerate} ${
                          isGenerating ? commonClasses.buttonDisabled : ""
                        }`}
                        disabled={isGenerating}
                      >
                        {isGenerating ? "Generando..." : `Generar Post 🪙 ${price}`}
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