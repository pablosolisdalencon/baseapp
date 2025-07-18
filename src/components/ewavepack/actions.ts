// src/app/ewave-maker/_components/actions.ts
'use server';

import {
  MakerData,
  EstudioMercadoData,
  EstrategiaMarketingData,
  CampaniaMarketingData,
  Post, // El tipo Post original de la campaña
  GeneratedPost,
  EwavePackGenerationResult } from "@/types/marketingWorkflowTypes";
import { revalidatePath } from 'next/cache'; // Para revalidar datos si se guardan en BD y se muestran en otra página

// Función auxiliar para llamar a las APIs
async function callApi<T>(url: string, method: string, body?: any): Promise<T> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'; // Asegúrate de que esta URL sea correcta para tu entorno de desarrollo/producción
  const fullUrl = url.startsWith('https') ? url : `${baseUrl}${url}`;

  try {
    let options:RequestInit;
    if (body) {
      options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        cache: 'no-store', // Muy importante para las llamadas a Willi/IA
      };
     
    }else{
      options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Muy importante para las llamadas a Willi/IA
      };
    }

    const res = await fetch(fullUrl, options);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error calling API ${fullUrl}: ${res.status} ${res.statusText} - ${errorText}`);
      throw new Error(`Error ${res.status}: ${errorText}`);
    }

    return res.json() as Promise<T>;
  } catch (error: any) {
    console.error(`Failed to call API ${fullUrl}:`, error.message);
    throw new Error(`Failed to connect or process API response for ${fullUrl}: ${error.message}`);
  }
}

export async function generateEwavePack(idProyecto: string): Promise<EwavePackGenerationResult> {
  let makerDataRes: any | null = null;
  let estudioMercadoRes: any | null = null;
  let estrategiaMarketingRes: any | null = null;
  let campaniaMarketingRes: any | null = null;
  let makerData: MakerData | null = null;
  let estudioMercado: EstudioMercadoData | null = null;
  let estrategiaMarketing: EstrategiaMarketingData | null = null;
  let campaniaMarketing: CampaniaMarketingData | null = null;
  const generatedPosts: GeneratedPost[] = [];

  try {
    // 1. Obtener MakerData (combinando proyecto y catalogo)
    // Asumo que tienes endpoints /api/proyecto y /api/catalogo o una API única /api/maker/#id
    // Si la API /api/maker ya retorna el objeto combinado, úsalo directamente.
    // Basado en data.json, la API /api/maker/#idProyecto# debería retornar un objeto con 'proyecto' y 'catalogo'.
    makerDataRes = await callApi<any>(`/api/maker?p=${idProyecto}`,'GET');

    console.log("### GenerateEwavePak actions ## say makerData:")
    console.log(makerDataRes)
    makerData = makerDataRes.data[0];


    // 2. Obtener EstudioMercado (POST a /api/willi con MakerData)
    // El 'maker' en el body del POST se espera como el objeto MakerData completo.
    
    estudioMercadoRes = await callApi<any>('/api/willi', 'POST', { 
      item:"estudio-mercado",
      maker: makerData
    });

    estudioMercado = estudioMercadoRes.data[0]

    console.log("### GenerateEwavePak actions ## say estudioMercadoData:")
    console.log(estudioMercado)
    
    // 3. Obtener EstrategiaMarketing (POST a /api/willi con MakerData y EstudioMercado)
    // Asegúrate de que la API de Willi espera los objetos completos y no solo sus representaciones en texto.
    estrategiaMarketingRes = await callApi<EstrategiaMarketingData>('/api/willi', 'POST', {
      item:"estrategia-marketing", 
      maker: makerData,
      estudio: estudioMercado,
    });
    estrategiaMarketing = estrategiaMarketingRes.data[0]

    // 4. Obtener CampaniaMarketing (POST a /api/willi con MakerData, EstudioMercado, EstrategiaMarketing)
    campaniaMarketingRes = await callApi<CampaniaMarketingData>('/api/willi', 'POST', {
      item:"campania-marketing", 
      maker: makerData,
      estudio: estudioMercado,
      estrategia: estrategiaMarketing, // Asegúrate de que el nombre de la propiedad sea el que espera Willi
    });
    campaniaMarketing = campaniaMarketingRes.data[0]

    // 5. Generar Posts (Texto e Imagen)
    if (campaniaMarketing?.contenido) {
      for (const semana of campaniaMarketing.contenido) {
        for (const dia of semana.dias) {
          if (dia.post) {
            const originalPost: Post = dia.post;

            // Generar texto del post
            const textResponse = await callApi<{ text: string }>('/api/willi', 'POST', {
              item: "post-final",
              post: originalPost,
              modo: 'text',
            });

            // Generar imagen del post
            const imageResponse = await callApi<{ image: string }>('/api/willi', 'POST', {
              item: "post-final-img",
              post: originalPost,
              modo: 'image',
            });

            generatedPosts.push({
              id: originalPost.titulo + '-' + Date.now(), // Un ID simple, podrías usar un UUID
              originalPostData: originalPost,
              text: textResponse.text,
              image: imageResponse.image,
            });

            // OPCIONAL: Guardar cada post generado en la BD aquí
            // await callApi('/api/db/save-generated-post', 'POST', { idProyecto, ...generatedPosts[generatedPosts.length - 1] });
          }
        }
      }
    }

    // OPCIONAL: Guardar todo el eWavePack en BD aquí al final
    // Este POST a tu API interna de guardado podría incluir todos los objetos generados.
    // if (makerData && estudioMercado && estrategiaMarketing && campaniaMarketing && generatedPosts.length > 0) {
    //   await callApi('/api/db/save-ewavepack', 'POST', {
    //     idProyecto,
    //     makerData,
    //     estudioMercado,
    //     estrategiaMarketing,
    //     campaniaMarketing,
    //     generatedPosts,
    //   });
    //   revalidatePath(`/mktviewer/${idProyecto}`); // Si tienes una ruta de visualización que necesita revalidarse
    //   revalidatePath(`/contents-manager/${idProyecto}`);
    // }

    return { makerData, estudioMercado, estrategiaMarketing, campaniaMarketing, generatedPosts, error: null };
  } catch (error: any) {
    console.error("Error en Server Action generateEwavePack:", error);
    return {
      makerData: null,
      estudioMercado: null,
      estrategiaMarketing: null,
      campaniaMarketing: null,
      generatedPosts: [],
      error: error.message || 'Error desconocido al generar eWavePack.',
    };
  }
}

// Ejemplo de Server Action para guardar un objeto específico (si se habilita el botón "Guardar")
export async function saveObjectToDB<T>(idProyecto: string, objectType: string, data: T) {
  try {
    await callApi(`/api/db/save-object`, 'POST', { idProyecto, objectType, data });
    revalidatePath(`/ewave-maker?id=${idProyecto}`); // O la ruta relevante donde se muestran los datos guardados
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Ejemplo de Server Action para optimizar un objeto específico
export async function optimizeObjectWithWilli<T>(idProyecto: string, objectType: string, data: T) {
  try {
    // Aquí deberías llamar a la API de Willi con el objeto para que lo "optimice"
    // Esto implicaría una nueva interacción con Willi, quizás un endpoint como /api/willi/optimize
    const optimizedData = await callApi<T>('/api/willi/optimize', 'POST', { idProyecto, objectType, data });
    return { success: true, optimizedData };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Ejemplo de Server Action para reintentar la generación de un post específico
export async function retryGeneratePost(idProyecto: string, originalPostData: Post): Promise<{ success: boolean, generatedPost?: GeneratedPost, error?: string }> {
  try {
    const textResponse = await callApi<{ text: string }>('/api/willi', 'POST', {
      post: originalPostData,
      modo: 'text',
    });
    const imageResponse = await callApi<{ image: string }>('/api/willi', 'POST', {
      post: originalPostData,
      modo: 'image',
    });

    const newGeneratedPost: GeneratedPost = {
      id: originalPostData.titulo + '-' + Date.now(),
      originalPostData: originalPostData,
      text: textResponse.text,
      image: imageResponse.image,
    };

    return { success: true, generatedPost: newGeneratedPost };
  } catch (error: any) {
    return { success: false, error: error.message || 'Error al reintentar generar el post.' };
  }
}