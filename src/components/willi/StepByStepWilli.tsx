// components/willi/StepByStepWilli.tsx
'use client';

import React, { useEffect, useState, useCallback } from "react";
import { Spinner } from '@heroui/react';
import { useSession } from 'next-auth/react'; // Importar useSession correctamente

import {
  EstudioMercadoData,
  EstrategiaMarketingData,
  CampaniaMarketingData,
  Semana,
  Dia,
  Post,
} from "../../types/marketingWorkflowTypes"; // Asegúrate de que la ruta sea correcta

interface GeneratedContent {
  texto: string | null;
  imagen: string | null;
}

interface StepByStepWilliProps {
  initialEstudio: EstudioMercadoData | null;
  initialEstrategia: EstrategiaMarketingData | null;
  initialCampania: CampaniaMarketingData | null;
  projectId: string; // Para las llamadas API
}

const StepByStepWilli: React.FC<StepByStepWilliProps> = ({
  initialEstudio,
  initialEstrategia,
  initialCampania,
  projectId
}) => {
  const { data: session, status } = useSession();
  const currentUserEmail = session?.user?.email;

  const [estudio, setEstudio] = useState<EstudioMercadoData | null>(initialEstudio);
  const [estrategia, setEstrategia] = useState<EstrategiaMarketingData | null>(initialEstrategia);
  const [campania, setCampania] = useState<CampaniaMarketingData | null>(initialCampania);

  const [saldo, setSaldo] = useState<number | null>(null); // Iniciar como null para indicar carga
  const [price, setPrice] = useState<Map<string, number | null>>(new Map()); // Precio por tipo de acción
  const [generatingStates, setGeneratingStates] = useState<Map<string, boolean>>(new Map());
  const [errors, setErrors] = useState<Map<string, string | null>>(new Map());
  const [generatedPostContent, setGeneratedPostContent] = useState<Map<string, GeneratedContent>>(new Map());


  // --- Helper Functions for Direct API Calls ---

  const generateContentApi = useCallback(async (itemType: string, payload: any): Promise<any | null> => {
    try {
      // Endpoint dinámico basado en el tipo de item
      const endpointMap: { [key: string]: string } = {
        'post-final': `/api/willi`, // Para generar posts (texto)
        'post-final-img': `/api/willi`, // Para generar posts (imagen)
        'estudio': `/api/estudio`, // Asumir endpoint para estudio
        'estrategia': `/api/estrategia`, // Asumir endpoint para estrategia
        'campania': `/api/campania`, // Asumir endpoint para campaña
      };
      const apiPath = endpointMap[itemType];
      if (!apiPath) {
        throw new Error(`Tipo de item desconocido para generación: ${itemType}`);
      }

      const bodyData = JSON.stringify(payload); // El payload ya contiene 'item' si es necesario para /api/willi

      const response = await fetch(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: bodyData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(errorData.message || `Fallo en la API ${itemType}: ${response.status}`);
      }
      return await response.json();
    } catch (error: any) {
      console.error(`Error al generar ${itemType}:`, error);
      throw error; // Re-lanzar para que se maneje en la función que llama
    }
  }, []);

  const getPriceApi = useCallback(async (action: string): Promise<number | null> => {
    try {
      const response = await fetch(`/api/pricing?a=${action}`);
      if (!response.ok) {
        console.error(`Fallo al obtener precio para ${action}: ${response.status}`);
        return null;
      }
      const jsonPrice = await response.json();
      return jsonPrice.price;
    } catch (e) {
      console.error(`Error en getPriceApi para ${action}:`, e);
      return null;
    }
  }, []);

  const getSaldoApi = useCallback(async (email: string): Promise<number | null> => {
    try {
      const response = await fetch(`/api/user-tokens/?e=${email}`);
      if (!response.ok) {
        console.error(`Fallo al validar saldo para ${email}: ${response.status}`);
        return null;
      }
      const jsonData = await response.json();
      return jsonData.tokens;
    } catch (e) {
      console.error(`Error en getSaldoApi para ${email}:`, e);
      return null;
    }
  }, []);

  const updateSaldoApi = useCallback(async (amountToLeave: number, email: string): Promise<any | null> => {
    try {
      const bodyData = JSON.stringify({ tokens: amountToLeave, email: email });
      const response = await fetch(`/api/user-tokens`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: bodyData,
      });
      if (!response.ok) {
        console.error(`Fallo al actualizar saldo para ${email}: ${response.status}`);
        return null;
      }
      return await response.json();
    } catch (e) {
      console.error(`Error en updateSaldoApi para ${email}:`, e);
      return null;
    }
  }, []);

  // --- Main Orchestration Logic (Handlers / Hooks) ---

  // Esto ahora reemplaza la lógica de 'useTokens' del ejemplo anterior
  const handleActionWithTokens = useCallback(async (action: string, objectAction: any) => {
    if (!currentUserEmail) {
      setErrors((prev) => new Map(prev).set(action, "Error: No autenticado. Debes iniciar sesión."));
      return;
    }

    const actionKey = objectAction.week != null && objectAction.day != null
      ? `${objectAction.week}_${objectAction.day}`
      : action; // Clave para manejar estado de posts vs otras acciones

    setGeneratingStates((prev) => new Map(prev).set(actionKey, true));
    setErrors((prev) => new Map(prev).set(actionKey, null));

    let originalSaldo: number | null = null; // Para rollback

    try {
      // 1. Validar Saldo
      originalSaldo = await getSaldoApi(currentUserEmail);
      if (originalSaldo === null) {
        throw new Error("No se pudo verificar el saldo.");
      }
      setSaldo(originalSaldo); // Actualizar saldo en UI

      // 2. Obtener Precio de la Acción
      const currentPrice = price.get(action);
      if (currentPrice === null || currentPrice === undefined) {
          throw new Error("No se pudo determinar el costo de la acción.");
      }

      // 3. Verificar Saldo Suficiente
      if (originalSaldo < currentPrice) {
        throw new Error("Saldo insuficiente.");
      }

      // 4. Descontar Tokens
      const saldoDespuesDelDescuento = originalSaldo - currentPrice;
      const descuentoExitoso = await updateSaldoApi(saldoDespuesDelDescuento, currentUserEmail);
      if (!descuentoExitoso) {
        throw new Error(`No se pudieron descontar los tokens.`);
      }
      setSaldo(saldoDespuesDelDescuento); // Actualizar saldo en UI inmediatamente


      // 5. Ejecutar la Acción de Generación
      let generatedResult: any = null;
      if (action === "generate-post") {
        const textResult = await generateContentApi('post-final', { item: 'post-final', post: objectAction.post });
        const imageResult = await generateContentApi('post-final-img', { item: 'post-final-img', post: objectAction.post });

        generatedResult = {
            texto: textResult?.[0]?.texto || null,
            imagen: imageResult?.[0]?.data || null,
        };
        // Actualizar el estado de los posts generados
        setGeneratedPostContent((prev) => new Map(prev).set(actionKey, generatedResult));

      } else if (action === "generate-estudio") {
        generatedResult = await generateContentApi('estudio', {
          mode: 'estudio', // Asumir la estructura del payload para la API
          projectId: projectId,
          item: objectAction.item // Puedes pasar item de la misma manera que antes
        });
        setEstudio(generatedResult);

      } else if (action === "generate-estrategia") {
        generatedResult = await generateContentApi('estrategia', {
          mode: 'estrategia',
          projectId: projectId,
          item: objectAction.item,
          estudio: objectAction.estudio // Asegúrate de pasar el estudio actual
        });
        setEstrategia(generatedResult);

      } else if (action === "generate-campania") {
        generatedResult = await generateContentApi('campania', {
          mode: 'campania',
          projectId: projectId,
          item: objectAction.item,
          estudio: objectAction.estudio, // Pasa el estudio actual
          estrategia: objectAction.estrategia // Pasa la estrategia actual
        });
        setCampania(generatedResult);

      } else {
        throw new Error(`Acción desconocida: ${action}`);
      }

      // 6. Verificar si la acción de generación tuvo un error interno
      if (!generatedResult || generatedResult.error || (generatedResult.texto && generatedResult.texto.startsWith("Error:"))) {
        throw new Error(generatedResult?.error || generatedResult?.texto || "Fallo en la generación de contenido.");
      }

    } catch (error: any) {
      console.error(`Fallo en la acción ${action}:`, error);
      setErrors((prev) => new Map(prev).set(actionKey, error.message || `Error desconocido en ${action}.`));

      // 7. Rollback de Tokens si hubo un fallo después del descuento
      if (originalSaldo !== null && saldo !== originalSaldo && currentUserEmail) {
        console.warn(`Realizando rollback de tokens a ${originalSaldo} para ${currentUserEmail}`);
        const rollbackExitoso = await updateSaldoApi(originalSaldo, currentUserEmail);
        if (rollbackExitoso) {
          setSaldo(originalSaldo); // Restaurar saldo en UI
          setErrors((prev) => new Map(prev).set(actionKey, `${error.message || "Error al generar contenido."} Tus tokens han sido restaurados.`));
        } else {
          setErrors((prev) => new Map(prev).set(actionKey, `${error.message || "Error al generar contenido."} Fallo al restaurar los tokens. Por favor, contacta a soporte.`));
        }
      }
    } finally {
      setGeneratingStates((prev) => new Map(prev).set(actionKey, false));
    }
  }, [currentUserEmail, price, generateContentApi, getSaldoApi, updateSaldoApi, getPriceApi, projectId, saldo]);


  // --- useEffects para Cargar Datos Iniciales y Precios ---

  useEffect(() => {
    // Cargar el saldo del usuario cuando la sesión esté disponible
    const loadUserSaldo = async () => {
      if (currentUserEmail) {
        const currentSaldo = await getSaldoApi(currentUserEmail);
        setSaldo(currentSaldo);
      }
    };
    if (status === 'authenticated') {
      loadUserSaldo();
    }
  }, [status, currentUserEmail, getSaldoApi]);

  useEffect(() => {
    // Cargar precios para todas las acciones relevantes
    const loadPrices = async () => {
      const actionsToPrice = ["generate-post", "generate-estudio", "generate-estrategia", "generate-campania"];
      const newPrices = new Map<string, number | null>();
      for (const action of actionsToPrice) {
        const fetchedPrice = await getPriceApi(action);
        newPrices.set(action, fetchedPrice);
      }
      setPrice(newPrices);
    };
    loadPrices();
  }, [getPriceApi]);


  // --- UI Rendering ---

  const commonClasses = {
    container: "bg-white p-8 rounded-lg shadow-xl w-full max-w-6xl mx-auto my-8 font-sans",
    section: "mb-10 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md border border-blue-100",
    sectionTitle: "text-3xl font-extrabold text-indigo-800 mb-6 pb-4 border-b-2 border-indigo-200 tracking-tight",
    postContainer: "p-3 bg-gray-50 rounded-md border border-gray-100 mb-4",
    generatedContentContainer: "bg-green-50 p-4 rounded-md mt-4 border border-green-200",
    errorText: "text-red-600 text-sm mt-1",
    buttonGroup: "flex flex-wrap gap-3 mt-4",
    buttonBase: "px-5 py-2 rounded-md font-semibold text-white transition-colors duration-200 ease-in-out",
    buttonGenerate: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-700 focus:ring-offset-2 focus:ring-purple-500",
    buttonDisabled: "bg-gray-400 cursor-not-allowed",
  };

  const getPriceForAction = (actionName: string) => price.get(actionName) || 'N/A';

  const renderContentSection = (title: string, data: any, actionName: string) => {
    const isGenerating = generatingStates.get(actionName) || false;
    const currentError = errors.get(actionName);
    const actionPrice = getPriceForAction(actionName);
    const isButtonDisabled = isGenerating || saldo === null || saldo < (price.get(actionName) || 0) || actionPrice === 'N/A';
    const buttonTitle = isGenerating ? "Generando..." :
                        saldo === null ? "Cargando saldo..." :
                        actionPrice === 'N/A' ? "Precio no disponible" :
                        saldo < (price.get(actionName) || 0) ? "Saldo insuficiente" : `Generar ${title}`;

    return (
      <section className={commonClasses.section}>
        <h2 className={commonClasses.sectionTitle}>{title}</h2>
        {data ? (
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">{JSON.stringify(data, null, 2)}</pre>
        ) : (
          <p className="text-gray-600">No hay datos de {title} disponibles.</p>
        )}
        {isGenerating && (
          <div className="flex items-center gap-2 mt-4">
            <Spinner classNames={{ label: "text-foreground" }} label="wave" variant="wave" />
            <p className="text-purple-600 italic">Generando {title}...</p>
          </div>
        )}
        {currentError && <p className={commonClasses.errorText}>{currentError}</p>}
        {status === 'authenticated' && (
          <button
            onClick={() => handleActionWithTokens(actionName, { projectId, item: title.toLowerCase(), estudio, estrategia, campania })}
            className={`${commonClasses.buttonBase} ${commonClasses.buttonGenerate} ${isButtonDisabled ? commonClasses.buttonDisabled : ""}`}
            disabled={isButtonDisabled}
            title={buttonTitle}
          >
            {isGenerating ? "Generando..." : `Generar ${title} ${actionPrice}`}
          </button>
        )}
        {status === 'loading' && <p className="text-gray-500 italic mt-4">Cargando sesión...</p>}
        {status === 'unauthenticated' && <p className="text-red-500 italic mt-4">Debes iniciar sesión para generar contenido.</p>}
      </section>
    );
  };

  return (
    <div className={commonClasses.container}>
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8 pb-4 border-b-4 border-indigo-400">
        Workflow de Marketing (Cliente)
      </h1>

      <div className="mb-6 text-lg font-semibold text-right text-gray-700">
        Saldo Actual: {saldo !== null ? `${saldo} tokens` : <Spinner classNames={{ label: "text-foreground inline-block ml-2" }} label="wave" variant="wave" />}
      </div>

      {renderContentSection("Estudio de Mercado", estudio, "generate-estudio")}
      {renderContentSection("Estrategia de Marketing", estrategia, "generate-estrategia")}
      {renderContentSection("Campaña de Marketing", campania, "generate-campania")}

      <section className={commonClasses.section}>
        <h2 className={commonClasses.sectionTitle}>Planificación de Contenido de Campaña</h2>
        <img src="/step4.png" className="flow-img" alt="Flow Diagram" />
        {!campania || campania.contenido.length === 0 ? (
          <p className="text-gray-600">No hay planificación de contenido de campaña disponible.</p>
        ) : (
          campania.contenido.map((semana: Semana, weekIndex: number) => (
            <div key={semana.numero} className="mb-8 p-6 bg-blue-50 rounded-lg shadow-md border border-blue-100">
              <h3 className="text-xl font-bold text-blue-800 mb-3">Semana {semana.numero}</h3>
              {semana.dias.map((dia: Dia, dayIndex: number) => {
                const post = dia.post;
                const key = `${weekIndex}_${dayIndex}`;
                const generated = generatedPostContent.get(key);
                const isGenerating = generatingStates.get(key) || false;
                const currentError = errors.get(key);
                const postPrice = getPriceForAction("generate-post");
                const isButtonDisabled = isGenerating || saldo === null || saldo < (price.get("generate-post") || 0) || postPrice === 'N/A';
                const buttonTitle = isGenerating ? "Generando..." :
                                    saldo === null ? "Cargando saldo..." :
                                    postPrice === 'N/A' ? "Precio no disponible" :
                                    saldo < (price.get("generate-post") || 0) ? "Saldo insuficiente" : "Generar post";

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

                    {generated && (generated.texto || generated.imagen) && !currentError && (
                      <div className={commonClasses.generatedContentContainer}>
                        <h5 className="text-base font-semibold text-green-800 mb-2">Contenido Generado</h5>
                        {generated.texto && (
                          <>
                            <p className="font-semibold">Texto:</p>
                            <textarea
                              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm resize-none"
                              rows={5}
                              readOnly
                              value={generated.texto}
                            />
                          </>
                        )}
                        {generated.imagen && (
                          <>
                            <p className="font-semibold mt-2">Imagen Generada:</p>
                            <img src={`data:image/jpeg;base64,${generated.imagen}`} alt="Imagen generada" className="max-w-xs rounded-md shadow-md mt-1" />
                          </>
                        )}
                      </div>
                    )}

                    {isGenerating && (
                      <div className="flex items-center gap-2 mt-4">
                        <Spinner classNames={{ label: "text-foreground" }} label="wave" variant="wave" />
                        <p className="text-purple-600 italic">Generando contenido...</p>
                      </div>
                    )}
                    {currentError && (
                      <p className={commonClasses.errorText}>{currentError}</p>
                    )}

                    <div className={commonClasses.buttonGroup}>
                      {status === 'authenticated' && (
                        <button
                          onClick={() =>
                            handleActionWithTokens("generate-post", { week: weekIndex, day: dayIndex, post })
                          }
                          className={`${commonClasses.buttonBase} ${commonClasses.buttonGenerate} ${isButtonDisabled ? commonClasses.buttonDisabled : ""}`}
                          disabled={isButtonDisabled}
                          title={buttonTitle}
                        >
                          {isGenerating ? "Generando..." : `Generar Post ${postPrice}`}
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
          ))
        )}
      </section>
    </div>
  );
};

export default StepByStepWilli;