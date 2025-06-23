"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useTokens, validarSaldo, getPrice } from "../tokens/simpleTokens";
import { CampaniaMarketingData, Semana, Dia } from "../../types/marketingWorkflowTypes";
import GWV from "@/utils/GWV";
import { useSearchParams, useRouter } from "next/navigation"; // Importar useRouter
import { useAppContext } from "../../app/AppContext";

interface GeneratedContent {
  texto: string | null; // Especificar que texto es string
  imagen: string | null; // Asumir que imagen es una URL (string)
}

const MarketingContentManager: React.FC = () => {
  const { session, status, saldo, setSaldo } = useAppContext();
  const router = useRouter(); // Inicializar router
  const searchParams = useSearchParams();
  const idProyecto = searchParams.get("id");

  const [campaignData, setCampaignData] = useState<CampaniaMarketingData | null>(null);
  const [isFetchingCampaign, setIsFetchingCampaign] = useState<boolean>(true);
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

  const fetchCampaignData = useCallback(async () => {
    if (!idProyecto) {
      setError("ID de proyecto no proporcionado.");
      setIsFetchingCampaign(false);
      return;
    }
    setIsFetchingCampaign(true);
    setError(null);
    try {
      const response = await GWV("check", idProyecto, "campania-marketing");
      setCampaignData(response);
    } catch (err) {
      setError("Failed to fetch campaign data.");
      console.error(err);
    } finally {
      setIsFetchingCampaign(false);
    }
  }, [idProyecto]);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/contents-manager" + (idProyecto ? `?id=${idProyecto}`: ''));
      return;
    }
    if (status === "authenticated") {
      fetchCampaignData();
    }
  }, [status, fetchCampaignData, router, idProyecto]);

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
    if (!session?.user?.email) {
      setError("Usuario no autenticado o email no disponible.");
      return;
    }
    const key = getKey(objectAction.week, objectAction.day);
    setGeneratingStates((prev) => new Map(prev).set(key, true));

    try {
      const exec = await useTokens(action, objectAction, session.user.email);
      if (exec && exec.generated) { // Asegurarse que exec.generated exista
        setGeneratedPosts((prev) => {
            const newMap = new Map(prev);
            newMap.set(key, { texto: exec.generated.texto, imagen: exec.generated.imagen });
            return newMap;
        });

        const updatedSaldo = await validarSaldo(session.user.email);
        if (updatedSaldo !== null) {
          setSaldo(updatedSaldo);
        }
      } else {
        // Manejar el caso donde exec o exec.generated es null/undefined
        console.warn("La generación de contenido no devolvió un resultado esperado:", exec);
        setError(`No se pudo generar el contenido para el post ${key}.`);
      }
    } catch (error: any) {
      console.error("Error al generar contenido:", error);
      setError(`Error al generar contenido: ${error.message}`);
    } finally {
        setGeneratingStates((prev) => new Map(prev).set(key, false));
    }
  };

  if (status === "loading" || isFetchingCampaign) {
    return (
      <div className={commonClasses.container}>
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Cargando datos de la campaña...
        </h2>
      </div>
    );
  }

  if (error) {
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

                  {generatedContent && (generatedContent.texto || generatedContent.imagen) && (
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

                  <div className={commonClasses.buttonGroup}>
                    {session?.user && (
                      <button
                        onClick={() =>
                          handleUseTokens("generate-post", {
                            week: weekIndex,
                            day: dayIndex,
                            post, // Enviar el objeto post completo
                            id_proyecto: idProyecto, // Enviar idProyecto
                            nombre_campaña: campaignData.nombre // Enviar nombre de la campaña
                          })
                        }
                        className={`${commonClasses.buttonBase} ${commonClasses.buttonGenerate} ${
                          isGenerating || saldo === null || (price !== null && saldo < price) ? commonClasses.buttonDisabled : ""
                        }`}
                        disabled={isGenerating || saldo === null || (price !== null && saldo < price)}
                        title={saldo !== null && price !== null && saldo < price ? "Saldo insuficiente" : ""}
                      >
                        {isGenerating ? "Generando..." : `Generar Post 🪙 ${price !== null ? price : '...'}`}
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