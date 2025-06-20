"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from "next-auth/react"; // Added for session management
// Import only the necessary types from the central types file
import {
  CampaniaMarketingData,
  Semana,
  Dia,
  Post
} from '../../types/marketingWorkflowTypes';
import GWV from '@/utils/GWV';
import { useSearchParams } from "next/navigation";

// Define type for generated content, which is the output format from 'Generar'
interface GeneratedContent {
  texto: any|null;
  imagen: any|null;
}

// Helper para renderizar arrays de strings como tags (if needed for post details)
const renderTags = (items: string[] | undefined, label: string = '', baseClass: string = '') => {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {label && <span className="text-sm font-medium text-gray-600 mr-1">{label}:</span>}
      {items.map((item, i) => (
        <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold ${baseClass}`}>
          {item.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
        </span>
      ))}
    </div>
  );
};

const MarketingContentManager: React.FC = () => {
  const searchParams = useSearchParams();
    const idProyecto = searchParams.get('id');
  const { data: session } = useSession(); // Added for session data
  const [campaignData, setCampaignData] = useState<CampaniaMarketingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Using a Map to store generated content for each post (key: 'weekIndex_dayIndex')
  const [generatedPosts, setGeneratedPosts] = useState<Map<string, GeneratedContent>>(new Map());
  // Using a Map to track loading state for each generate button
  const [generatingStates, setGeneratingStates] = useState<Map<string, boolean>>(new Map());
  const [postPrice, setPostPrice] = useState<number | null>(null);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Common Tailwind CSS classes for consistent styling
  const commonClasses = {
    container: "bg-white p-8 rounded-lg shadow-xl w-full max-w-6xl mx-auto my-8 font-sans",
    section: "mb-10 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md border border-blue-100",
    sectionTitle: "text-3xl font-extrabold text-indigo-800 mb-6 pb-4 border-b-2 border-indigo-200 tracking-tight",
    subsection: "mb-6 p-5 bg-white rounded-lg shadow-sm border border-gray-100",
    subsectionTitle: "text-2xl font-bold text-blue-700 mb-4 border-b border-blue-200 pb-2",
    itemContainer: "p-4 bg-gray-50 rounded-md shadow-sm border border-gray-200 mb-3",
    itemTitle: "text-lg font-semibold text-gray-800 mb-1",
    paragraph: "text-gray-700 leading-relaxed mb-2",
    tagPrimary: "bg-indigo-100 text-indigo-800",
    tagSecondary: "bg-green-100 text-green-800",
    tagInfo: "bg-blue-100 text-blue-800",
    noData: "text-gray-500 italic text-center py-4",
    // Classes for generated content and buttons
    generatedContentContainer: "bg-green-50 p-4 rounded-md mt-4 border border-green-200",
    buttonGroup: "flex flex-wrap gap-3 mt-4",
    buttonBase: "px-5 py-2 rounded-md font-semibold text-white transition-colors duration-200 ease-in-out",
    buttonGenerate: "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
    buttonSave: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    buttonPublish: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    buttonDisabled: "bg-gray-400 cursor-not-allowed",
    postContainer: "p-3 bg-gray-50 rounded-md border border-gray-100 mb-4",
    postDetails: "text-sm text-gray-700 mt-1",
    generatedTextArea: "w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 text-sm resize-none"
  };

  useEffect(() => {
    const fetchCampaignData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulating API call to fetch campaign data using the new structure
        const response = await GWV('check',idProyecto,"campania-marketing");
        setCampaignData(response);
      } catch (err) {
        setError("Failed to fetch campaign data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaignData();
  }, [idProyecto]); // Added idProyecto as dependency, though GWV might not need it in useEffect's dep array if it's stable

  useEffect(() => {
    const fetchPostPrice = async () => {
      try {
        // Assuming /api/precios can filter by actionName query parameter
        // and returns either a single price object or an array with one item.
        const res = await fetch('/api/precios?actionName=generar post');
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({})); // Try to parse error, default if not parsable
          throw new Error(errorData.message || `Failed to fetch price: ${res.statusText}`);
        }
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          // If it's an array, find the specific action or take the first if only one is expected
          const priceDetail = data.find(p => p.actionName === "generar post") || data[0];
          if (priceDetail && typeof priceDetail.price === 'number') {
            setPostPrice(priceDetail.price);
          } else {
            throw new Error("Price data for 'generar post' is not in expected format or actionName not found in array.");
          }
        } else if (!Array.isArray(data) && data && typeof data.price === 'number') {
          // If it's a single object directly (e.g. API filtered perfectly)
          setPostPrice(data.price);
        } else {
          // If data is an empty array or not the expected object structure
          setPriceError("Price data for 'generar post' not found or in unexpected format.");
          console.warn("Received data for price:", data);
        }
      } catch (err) {
        console.error("Error fetching post price:", err);
        setPriceError(err instanceof Error ? err.message : "Could not load post price.");
      }
    };
    fetchPostPrice();
  }, []);

  const generatePost = async (originalPost:any) => {
    
    setError(null);
    try 

    
    {

      let bodyData = JSON.stringify({  item: 'post-final', post: originalPost });

      let bodyData_img = JSON.stringify({  item: 'post-final-img', post: originalPost });
        const response = await fetch(`/api/willi`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: bodyData,
        });

        
        const response_imagen = await fetch(`/api/willi?p=${idProyecto}`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: bodyData_img,
      });
      
    
        if (response.ok) {
          // Si la respuesta es 200 OK, asumimos que el item fue encontrado.
          // La API debería devolver los datos del item directamente.
          const res  = await response.json();
          //  FIN OK
          //-------------------------/
          const texto_final = res[0].texto;
          
          if (response_imagen.ok) {
            // Si la respuesta es 200 OK, asumimos que el item fue encontrado.
            // La API debería devolver los datos del item directamente.
            const res_img  = await response_imagen.json();
            //  FIN OK
            //-------------------------/
            const imagen_final = res_img[0].data;
            const response_final = {
              texto: texto_final,
              imagen: imagen_final
            }
            //-------------------------/
            return response_final as GeneratedContent
  
          } else if (response_imagen.status === 404) {
            // Si la API devuelve 404 Not Found, significa que no existe La api o seting para este artefacto?.
            return null
          } else {
            // Manejo de otros posibles errores de la API
            const errorData = await response_imagen.json();
            throw new Error(errorData.message || `generatePostImagen Error al crear  idProyecto(${idProyecto}) = status[${response.status}] StatusText [${response.statusText}]`);
          }
          //-------------------------/
          

        } else if (response.status === 404) {
          // Si la API devuelve 404 Not Found, significa que no existe La api o seting para este artefacto?.
          return null
        } else {
          // Manejo de otros posibles errores de la API
          const errorData = await response.json();
          throw new Error(errorData.message || `generatePost Error al crear  idProyecto(${idProyecto}) = status[${response.status}] StatusText [${response.statusText}]`);
        }


        

        


        

    } catch (error) {
        console.error(` generatePost    Fallo al crear : idProyecto(${idProyecto})`, error);
        // Relanza el error para que el componente lo maneje en el estado `error`
        throw new Error(`generatePost   No se pudo crear  : idProyecto(${idProyecto})`);
    }
  };

  

  
 

  // Key now uses weekIndex and dayIndex because each day has one post
  const getKey = (weekIndex: number, dayIndex: number) =>
    `${weekIndex}_${dayIndex}`;

  const handleGeneratePost = async (weekIndex: number, dayIndex: number, originalPost: Post) => {
    const key = getKey(weekIndex, dayIndex);
    setGeneratingStates(prev => new Map(prev).set(key, true));

    // Check for session
    if (!session || !session.user || (session.user as any).tokens === undefined) {
      alert("No se pudo verificar tu sesión. Por favor, intenta recargar la página.");
      setGeneratingStates(prev => new Map(prev).set(key, false));
      return;
    }
    const userTokens = (session.user as any).tokens;

    // Client-Side Token Check using fetched postPrice
    if (postPrice === null && !priceError) {
      alert("Cargando precio del post. Inténtalo de nuevo en un momento.");
      setGeneratingStates(prev => new Map(prev).set(key, false));
      return;
    }
    if (priceError) {
      alert(`No se pudo determinar el costo del post: ${priceError}`);
      setGeneratingStates(prev => new Map(prev).set(key, false));
      return;
    }
    // Add ! to postPrice because we've checked for null/error above
    if (userTokens < postPrice!) {
      alert(`No tienes suficientes tokens. Necesitas ${postPrice} tokens, tienes ${userTokens}.`);
      setGeneratingStates(prev => new Map(prev).set(key, false));
      return;
    }

    console.log(`Generating content for post: "${originalPost.titulo}" (Tema: ${originalPost.tema}). User has ${userTokens} tokens. Cost: ${postPrice} tokens.`);

    try {
      const generated: any = await generatePost(originalPost); // generatePost now only calls /api/willi

      setGeneratedPosts(prev => new Map(prev).set(key, generated));
      console.log(`Content generated for ${key}:`, generated);

      // Assuming 'generated' might now contain { texto: ..., imagen: ..., newTokens: ... }
      // The backend (/api/willi -> ia-* routes) should handle token deduction and ideally return the new balance.
      if (session && session.user && generated.newTokens !== undefined) {
        (session.user as any).tokens = generated.newTokens;
        // No specific alert for token update here, session will reflect it.
        // Or, if you want to be explicit:
        // alert(`Post generado exitosamente. Tokens restantes: ${generated.newTokens}`);
      } else {
        // If newTokens is not returned, user might need to refresh or session polling would update it.
        // Fetch new token count manually as a fallback if not returned by generatePost
        const tokenInfoResponse = await fetch('/api/auth/session'); // Or your specific endpoint to get updated session
        if (tokenInfoResponse.ok) {
          const updatedSession = await tokenInfoResponse.json();
          if (updatedSession && updatedSession.user && updatedSession.user.tokens !== undefined) {
            (session.user as any).tokens = updatedSession.user.tokens;
          }
        }
      }
      alert('Post generado exitosamente.'); // Simpler success message

    } catch (err) {
      console.error(`Error generating content for ${key}:`, err);
      alert(`Error al generar el contenido: ${err instanceof Error ? err.message : "Error desconocido"}`);
    } finally {
      setGeneratingStates(prev => new Map(prev).set(key, false));
    }
  };

  const handleSavePost = (weekIndex: number, dayIndex: number) => {
    const key = getKey(weekIndex, dayIndex);
    const contentToSave = generatedPosts.get(key);
    if (contentToSave) {
      console.log(`Saving content for post ${key}:`, contentToSave);
      // Implement actual save logic here (e.g., API call to your backend)
      alert(`Contenido de post para el día ${dayIndex + 1} de la semana ${weekIndex + 1} guardado.`);
    } else {
      alert("No hay contenido generado para guardar.");
    }
  };

  const handlePublishPost = (weekIndex: number, dayIndex: number) => {
    const key = getKey(weekIndex, dayIndex);
    const contentToPublish = generatedPosts.get(key);
    if (contentToPublish) {
      console.log(`Publishing content for post ${key}:`, contentToPublish);
      // Implement actual publishing logic here (e.g., API call to social media scheduler)
      alert(`Contenido de post para el día ${dayIndex + 1} de la semana ${weekIndex + 1} enviado a publicar.`);
    } else {
      alert("No hay contenido generado para publicar.");
    }
  };

  if (loading) {
    return (
      <div className={commonClasses.container}>
        <h2 className="text-2xl font-bold text-center text-gray-700">Cargando datos de la campaña...</h2>
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
        <h2 className="text-2xl font-bold text-center text-gray-700">No hay datos de campaña o planificación de contenido disponible.</h2>
      </div>
    );
  }

  return (
    <div className={commonClasses.container}>
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8 pb-4 border-b-4 border-indigo-400">
        Gestor de Contenido de Campaña: {campaignData.nombre || "Sin Nombre"}
      </h1>
      <p className="text-center text-gray-600 mb-10 text-lg italic">
        Objetivo: {campaignData.objetivo || "No definido."} | Target: {campaignData.target || "No definido."}
      </p>

      {/* Display Token Count */}
      {session && session.user && (session.user as any).tokens !== undefined && (
        <div className="my-4 p-3 bg-blue-100 border border-blue-300 rounded-md shadow text-center">
          <p className="text-lg font-semibold text-blue-700">
            Tokens restantes: <span className="font-bold text-xl">{(session.user as any).tokens}</span>
          </p>
          {postPrice !== null && (
            <p className="text-sm text-blue-600">Costo por generar post: {postPrice} tokens</p>
          )}
          {priceError && (
            <p className="text-sm text-red-600">Error al cargar precio del post: {priceError}</p>
          )}
        </div>
      )}

      <section className={commonClasses.section}>
        <h2 className={commonClasses.sectionTitle}>Planificación de Contenido</h2>
        {campaignData.contenido.map((semana: Semana, weekIndex: number) => (
          <div key={semana.numero} className="mb-8 p-6 bg-blue-50 rounded-lg shadow-md border border-blue-100">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Semana {semana.numero}</h3>

            {semana.dias && semana.dias.length > 0 ? (
              <div className="mt-4">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Planificación Diaria</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {semana.dias.map((dia: Dia, dayIndex: number) => {
                    const post = dia.post; // Direct access to the single post for the day
                    const key = getKey(weekIndex, dayIndex);
                    const generatedContent = generatedPosts.get(key);
                    const isGenerating = generatingStates.get(key) || false;

                    console.log(" +++++++++++ generatedContent  ============")
                    console.log(generatedContent)

                    return (
                      <div key={dia.fecha} className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <p className="text-md font-bold text-indigo-700 mb-2">Día: {dia.nombre} ({dia.fecha})</p>

                        {/* Contenedor para el Post Original */}
                        <div className={commonClasses.postContainer}>
                          <h5 className="text-base font-semibold text-gray-900 mb-2">Post Original</h5>
                          <p className={commonClasses.postDetails}>
                            <span className="font-bold">Título:</span> {post.titulo}
                          </p>
                          <p className={commonClasses.postDetails}>
                            <span className="font-bold">Hora:</span> {post.hora} | <span className="font-bold">Canal:</span> {post.canal}
                          </p>
                          <p className={commonClasses.postDetails}>
                            <span className="font-bold">Temática:</span> {post.tema}
                          </p>
                          <p className={commonClasses.postDetails}>
                            <span className="font-bold">Objetivo:</span> {post.objetivo}
                          </p>
                          <p className={commonClasses.postDetails}>
                            <span className="font-bold">Contenido:</span> {post.texto}
                          </p>
                          <p className={commonClasses.postDetails}>
                            <span className="font-bold">CTA:</span> {post.cta}
                          </p>
                          <p className={commonClasses.postDetails}>
                            <span className="font-bold">Imagen Propuesta:</span> {post.imagen}
                          </p>
                          <p className={commonClasses.postDetails}>
                            <span className="font-bold">Estado:</span> <span className={`font-semibold ${post.estado === 'pendiente' ? 'text-orange-500' : 'text-green-600'}`}>{post.estado}</span>
                          </p>
                          {post.fundamento && (
                            <p className={commonClasses.postDetails}>
                              <span className="font-bold">Fundamento:</span> {post.fundamento}
                            </p>
                          )}
                           {post.recomendacion_creacion && (
                            <p className={commonClasses.postDetails}>
                              <span className="font-bold">Rec. Creación:</span> {post.recomendacion_creacion}
                            </p>
                          )}
                           {post.recomendacion_publicacion_seguimiento && (
                            <p className={commonClasses.postDetails}>
                              <span className="font-bold">Rec. Publicación/Seguimiento:</span> {post.recomendacion_publicacion_seguimiento}
                            </p>
                          )}
                        </div>

                        {/* Contenedor para GeneratedPost */}
                        <div className={commonClasses.generatedContentContainer}>
                          <h5 className="text-base font-semibold text-green-800 mb-2">Contenido Generado</h5>
                          {isGenerating ? (
                            <p className="text-green-600 italic">Generando contenido...</p>
                          ) : generatedContent ? (
                            <>
                              <img
                                src={`data:image/png;base64,${generatedContent.imagen}`}
                                alt={`Imagen generada para ${post.titulo}`}
                                className="w-full h-auto max-h-48 object-cover rounded-md mb-3"
                              />
                              <textarea
                                className={commonClasses.generatedTextArea}
                                rows={5}
                                readOnly
                                value={generatedContent.texto}
                              >{generatedContent.texto}</textarea>
                            </>
                          ) : (
                            <p className={commonClasses.noData}>Aún no se ha generado contenido para este post.</p>
                          )}
                        </div>

                        {/* Contenedor de botones Generar, Guardar, Publicar */}
                        <div className={commonClasses.buttonGroup}>
                          <button
                            onClick={() => handleGeneratePost(weekIndex, dayIndex, post)}
                            className={`${commonClasses.buttonBase} ${commonClasses.buttonGenerate} ${isGenerating ? commonClasses.buttonDisabled : ''}`}
                            disabled={isGenerating}
                          >
                            {isGenerating ? 'Generando...' : 'Generar'}
                          </button>
                          <button
                            onClick={() => handleSavePost(weekIndex, dayIndex)}
                            className={`${commonClasses.buttonBase} ${commonClasses.buttonSave} ${!generatedContent ? commonClasses.buttonDisabled : ''}`}
                            disabled={!generatedContent}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => handlePublishPost(weekIndex, dayIndex)}
                            className={`${commonClasses.buttonBase} ${commonClasses.buttonPublish} ${!generatedContent ? commonClasses.buttonDisabled : ''}`}
                            disabled={!generatedContent}
                          >
                            Publicar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className={commonClasses.noData}>No hay planificación diaria disponible para esta semana.</p>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default MarketingContentManager;