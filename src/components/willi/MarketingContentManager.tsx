"use client";

import React, { useEffect, useState } from "react";

import {
  MarketingContentManagerProps,
  CampaniaMarketingData,
  Semana,
  Dia
} from "../../types/marketingWorkflowTypes";

import GWV from "@/utils/GWV";
import { useSession } from 'next-auth/react'; // Importar useSession correctamente
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
interface GeneratedContent {
  texto: string | null;
  imagen: string | null;
}


// REMOVED `async` from the component function
const MarketingContentManager: React.FC<MarketingContentManagerProps> = ({ CampaniaMarketingData }) => {
  // Estado para la sesión y el saldo
  console.log(CampaniaMarketingData)
  const { data: session, status } = useSession(); 
  const currentUserEmail = session?.user?.email;

    /* SUITE useTokens*/

          //-------- ACCIONES --------------
          const generatePost = async (post:any) => {
              try {
                  let bodyData = JSON.stringify({ item: 'post-final', post: post });
                  let bodyData_img = JSON.stringify({ item: 'post-final-img', post: post });
                  const response = await fetch(`/api/willi`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: bodyData,
                  });

                  const response_imagen = await fetch(`/api/willi`, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                      },
                      body: bodyData_img,
                  });

                  if (response.ok) {
                      const res = await response.json();
                      const texto_final = res[0].texto;

                      if (response_imagen.ok) {
                          const res_img = await response_imagen.json();
                          const imagen_final = res_img[0].data;
                          const response_final = {
                              texto: texto_final,
                              imagen: imagen_final,
                          };
                          return response_final;
                      } else if (response_imagen.status === 404) {
                          // Si la imagen no se encuentra o no se genera, devolvemos solo el texto.
                          console.warn("generatePost: Imagen no generada o no encontrada (404). Devolviendo solo texto.");
                          return { texto: texto_final, imagen: null };
                      } else {
                          const errorData = await response_imagen.json();
                          // Devolver solo el texto si la imagen falla por otra razón
                          return { texto: texto_final, imagen: null };
                      }
                  } else if (response.status === 404) {
                      return null;
                  }else{
                      return null;
                  }
              } catch (error) {
                
              }
          };

          const GeneratePost = async ({ week, day, post }:any) => {
              const getKey = (week:any, day:any) => `${week}_${day}`;
              const key = getKey(week, day);

              try {
                  const generated = await generatePost(post);
                  return { key, generated }; // `generated` puede ser `{texto, imagen}` o `null`
              } catch (err:any) {
                  // Retornar una estructura consistente incluso en error para que `ejecutarAccion` no falle
                  return { key, generated: { texto: `Error al generar: ${err.message}`, imagen: null } };
              }
          };
          //----------------------

          const ejecutarAccion = async (action:any, objectAction:any) =>{
              if (action === "generate-post") { // Usar === para comparación estricta
                  // GeneratePost ahora siempre devuelve un objeto { key, generated }
                  return await GeneratePost(objectAction);
              }

              // Para otras acciones, asegurarse que GWV también devuelve una estructura consistente
              // o manejar los errores de forma similar.
              if (action === "generate-estudio") {
                  const { mode, projectId, item } = objectAction;
                  try {
                      const result = await GWV(mode, projectId, item); // Asumir que GWV puede lanzar error o devolver null/estructura
                      return result; // o { key: "estudio_key", generated: result } si es necesario adaptar
                  } catch (error:any) {
                      return { key: "estudio_error", generated: { texto: `Error: ${error.message}` } }; // Ejemplo
                  }
              }
              if (action === "generate-estrategia") {
                  const { mode, projectId, item, estudio } = objectAction;
                  try {
                      const result = await GWV(mode, projectId, item, estudio);
                      return result;
                  } catch (error:any) {
                      return { key: "estrategia_error", generated: { texto: `Error: ${error.message}` } };
                  }
              }
              if (action === "generate-campania") {
                  const { mode, projectId, item, estudio, estrategia } = objectAction;
                  try {
                      const result = await GWV(mode, projectId, item, estudio, estrategia);
                      return result;
                  } catch (error:any) {
                      return { key: "campania_error", generated: { texto: `Error: ${error.message}` } };
                  }
              }
              return null; // O una estructura de error por defecto
          }

          // displayTokensModal no se usa actualmente, se podría eliminar o implementar si es necesario.

          // -----------------------------------------------
          const getPrice = async (action:any) => {
              if (!action) {
                  return null;
              }
              try {
                  const response = await fetch(`/api/pricing?a=${action}`); // No necesita headers ni method GET por defecto
                  if (!response.ok) {
                      const errorData = await response.json().catch(() => ({})); // Intenta parsear JSON, si falla, objeto vacío
                      // No usar alert aquí, mejor propagar el error o null.
                      return null;
                  }
                  const jsonPrice = await response.json();
                  return jsonPrice.price; // Asume que la API devuelve { price: X }
              } catch (e) {
                  return null;
              }
          }
          // -----------------------------------------------

          const validarSaldo = async (currentUserEmail:any) => {
              if (!currentUserEmail) {
                  return null;
              }
              try {
                  // El endpoint es /api/user-tokens/[email], no necesita query param 'e=' si se ajusta la API
                  // Asumiendo que la API está en /api/user-tokens/[email]
                  const response = await fetch(`/api/user-tokens/?e=${currentUserEmail}`);
                  if (!response.ok) {
                      return null;
                  }
                  const jsonData = await response.json();
                  return jsonData.tokens; // Asume { tokens: Y }
              } catch (e) {
                  return null;
              }
          }
          // -----------------------------------------------

          const descontarTokens = async (montoADejar:number, currentUserEmail:string) => {
              // El 'monto' aquí es el saldo final después del descuento, no la cantidad a descontar.
              // La API /api/user-tokens (PUT) debe estar diseñada para SETear el saldo.
              /*
              if (typeof montoADejar !== 'number' || montoADejar < 0) {
                  return null; // O false para indicar fallo
              }
              if (!currentUserEmail) {
                  return null;
              }
                  */



              const bodyData = JSON.stringify({ tokens: montoADejar, email:currentUserEmail }); // La API debe interpretar esto como el nuevo saldo
              try {
                  const response = await fetch(`/api/user-tokens`, { // Asumiendo API RESTful
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: bodyData,
                  });
                  if (!response.ok) {
                      const errorData = await response.json().catch(() => ({}));
                      return null; // O false
                  }
                  return await response.json(); // O true si la API devuelve el usuario actualizado o un success
              } catch (e) {
                  return null; // O false
              }
          }
          // -----------------------------------------------

          // historyTokens no se usa, se podría eliminar.

          // -----------------------------------------------

          const rollBackTokens = async (saldoOriginal:any, currentUserEmail:any) => {
              // Esta función es esencialmente la misma que descontarTokens si la API SETea el saldo.
              console.log(`rollBackTokens: Restaurando saldo a ${saldoOriginal} para ${currentUserEmail}`);
              return await descontarTokens(saldoOriginal, currentUserEmail); // Reutilizar descontarTokens
          }

          // main?
          const useTokens = async (action:any, objectAction:any) => {
              
              if (currentUserEmail) {
                  const saldoActual = await validarSaldo(currentUserEmail);

                  

                  const price = await getPrice(action);
                  if (price === null) { // getPrice ahora devuelve null en error
                      return { key: action, generated: { texto: `Error: No se pudo determinar el costo de la acción.`, imagen: null } };
                  }

                  
                  if (saldoActual === null) {
                      return { key: action, generated: { texto: `Error: No se pudo verificar el saldo.`, imagen: null } };
                  }

                  if (saldoActual >= price) {
                      const saldoDespuesDelDescuento = saldoActual - price;
                      const descuentoExitoso = await descontarTokens(saldoDespuesDelDescuento, currentUserEmail);

                      if (descuentoExitoso) { // Asumiendo que descontarTokens devuelve algo truthy en éxito
                          const resultadoAccion = await ejecutarAccion(action, objectAction);

                          // Verificar si la acción falló (ej. resultadoAccion.generated.texto contiene "Error:")
                          if (resultadoAccion && resultadoAccion.generated && typeof resultadoAccion.generated.texto === 'string' && resultadoAccion.generated.texto.startsWith("Error:")) {
                              await rollBackTokens(saldoActual, currentUserEmail); // Devolver tokens al saldo original
                              return resultadoAccion; // Devolver el error de la acción
                          }

                          if (resultadoAccion && resultadoAccion.key != null) { // Chequeo más robusto
                              return resultadoAccion;
                          } else {
                              await rollBackTokens(saldoActual, currentUserEmail); // Devolver tokens al saldo original
                              return {
                                  key: action,
                                  generated: {
                                      texto: "Oops! Fallo en la generación de contenido. Tus tokens han sido restaurados. Inténtalo de nuevo.",
                                      imagen: null
                                  }
                              };
                          }
                      } else {
                      return { key: action, generated: { texto: `Error: No se pudieron descontar los tokens ^saldoDespuesDelDescuento:${saldoDespuesDelDescuento}, currentUserEmail: ${currentUserEmail}.`, imagen: null } };
                      }
                  } else {
                      return { key: action, generated: { texto: "Saldo Insuficiente.", imagen: null } }; // Estructura consistente
                  }
              }
          }

  
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
        <img src="step5.png"/>
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
                          <img src=´data:image/jpeg;base64,{generatedContent.imagen}´ alt="Imagen generada" className="max-w-xs rounded-md shadow-md mt-1"/>
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

