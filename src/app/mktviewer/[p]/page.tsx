/*
import React, { Suspense } from 'react';
import MarketingWorkflow from "@/components/willi/StepByStepWilli";
import type { CampaniaMarketingPageProps, CampaniaMarketingData, MarketingContentManagerProps } from '@/types/marketingWorkflowTypes';

export default async function CampaniaMarketingPage({ params }: CampaniaMarketingPageProps) {
      const parametros = await params;
      const { p: itemId } = parametros;

      let itemData: CampaniaMarketingData | null = null;
      let errorMessage: string | null = null;

  try {
   
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/campania-marketing?p=${itemId}`; // Ruta a tu API Route dinámica

    const res = await fetch(apiUrl, {
      cache: 'no-store', // Opcional: Deshabilita el cacheo para siempre obtener datos frescos
    });

    if (!res.ok) {
      // Si la respuesta no es exitosa (ej. 404, 500), parsea el error y setea el mensaje.
      const errorResponse = await res.json();
      errorMessage = errorResponse.message || `Error desconocido al cargar datos para ID: ${itemId}`;
      console.error(`Error fetching data for ID '${itemId}':`, errorMessage);
    } else {
      // Si la respuesta es exitosa, parsea el JSON a tu interfaz `FetchedData`.
      itemData = await res.json();
    }
  } catch (error: any) {
    // Captura cualquier error de red o de ejecución durante el fetch.
    console.error('Error en DynamicPage durante el fetching:', error.message);
    errorMessage = `Error de conexión o inesperado: ${error.message}`;
  }

      return (
        <div>
            <div className="cardMKT williFlowItem">    
                <h2 className="mkt-subtitle">Flujo de Trabajo Marketing Digital</h2>
                <div className="cardMKTitemHidden">
                 <Suspense fallback={<p>Cargando...</p>}><MarketingWorkflow idProyectoD={itemId}/></Suspense>
                </div> 
            </div>

        </div>    
    )
}

*/

// app/mktviewer/[p]/page.tsx
import React, { Suspense } from 'react';
import MarketingWorkflow from "@/components/willi/StepByStepWilli";
import type { 
  PageProps, 
  CampaniaMarketingData, 
  EstudioMercadoData, 
  EstrategiaMarketingData,
  MakerData // Asumiendo que MakerData también podría ser necesario en el workflow
} from '@/types/marketingWorkflowTypes';
import GWV from '@/utils/GWV'; // Importa tus utilidades de fetching/generación

// Definición de las Server Actions
// Todas las Server Actions deben estar marcadas con 'use server';
// Pueden definirse aquí o en un archivo separado e importarse.
// Para este ejemplo, las definiremos aquí por simplicidad.

'use server'; // Marcar este bloque como código de servidor

/**
 * Server Action para generar o actualizar un Estudio de Mercado.
 * @param projectId ID del proyecto.
 * @returns El objeto EstudioMercadoData generado o actualizado.
 */
async function generateEstudio(projectId: string): Promise<EstudioMercadoData | null> {
  console.log(`Server Action: Intentando generar estudio para el proyecto ${projectId}`);
  try {
    // GWV('generate', ...) internamente llama a /api/willi,
    // y GWV('check', ...) llama a /api/item.
    // Asegúrate de que tu GWV.js maneje la obtención de 'maker' si es necesario para 'generate'.
    const newEstudio = await GWV('generate', projectId, 'estudio-mercado', null, null);
    console.log('Estudio generado/verificado en server action:', newEstudio);
    return newEstudio as EstudioMercadoData; // Asegura el tipo de retorno
  } catch (error) {
    console.error(`Error en Server Action generateEstudio para ${projectId}:`, error);
    return null;
  }
}

/**
 * Server Action para guardar un Estudio de Mercado existente.
 * Asume que tienes una API Route para guardar (e.g., /api/estudio-mercado/save).
 * Esta Server Action encapsularía la llamada a esa API.
 * @param projectId ID del proyecto.
 * @param data Los datos del estudio a guardar.
 * @returns true si se guardó correctamente, false en caso contrario.
 */
async function saveEstudio(projectId: string, data: EstudioMercadoData): Promise<boolean> {
  console.log(`Server Action: Guardando estudio para el proyecto ${projectId}`);
  try {
    // Esta parte simula la llamada a tu API /api/estudio-mercado para guardar.
    // Deberías reemplazar esto con una llamada real a tu API interna de guardado.
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/estudio-mercado`; // Asume una API para guardar
    const res = await fetch(apiUrl, {
      method: 'POST', // O PUT, dependiendo de tu API de guardado
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, data }), // Envía el projectId y los datos
    });

    if (!res.ok) {
      const errorResponse = await res.json();
      console.error(`Error al guardar estudio para ${projectId}:`, errorResponse.message);
      return false;
    }
    console.log('Estudio guardado exitosamente.');
    return true;
  } catch (error) {
    console.error(`Error en Server Action saveEstudio para ${projectId}:`, error);
    return false;
  }
}

// Repite patrones similares para generar y guardar Estrategia y Campaña:
async function generateEstrategia(projectId: string, estudio: EstudioMercadoData | null): Promise<EstrategiaMarketingData | null> {
  console.log(`Server Action: Intentando generar estrategia para el proyecto ${projectId}`);
  try {
    const newEstrategia = await GWV('generate', projectId, 'estrategia-marketing', estudio, null);
    return newEstrategia as EstrategiaMarketingData;
  } catch (error) {
    console.error(`Error en Server Action generateEstrategia para ${projectId}:`, error);
    return null;
  }
}

async function saveEstrategia(projectId: string, data: EstrategiaMarketingData): Promise<boolean> {
  console.log(`Server Action: Guardando estrategia para el proyecto ${projectId}`);
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/estrategia-marketing`;
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, data }),
    });
    return res.ok;
  } catch (error) {
    console.error(`Error en Server Action saveEstrategia para ${projectId}:`, error);
    return false;
  }
}

async function generateCampania(projectId: string, estudio: EstudioMercadoData | null, estrategia: EstrategiaMarketingData | null): Promise<CampaniaMarketingData | null> {
  console.log(`Server Action: Intentando generar campaña para el proyecto ${projectId}`);
  try {
    const newCampania = await GWV('generate', projectId, 'campania-marketing', estudio, estrategia);
    return newCampania as CampaniaMarketingData;
  } catch (error) {
    console.error(`Error en Server Action generateCampania para ${projectId}:`, error);
    return null;
  }
}

async function saveCampania(projectId: string, data: CampaniaMarketingData): Promise<boolean> {
  console.log(`Server Action: Guardando campaña para el proyecto ${projectId}`);
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/campania-marketing`;
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, data }),
    });
    return res.ok;
  } catch (error) {
    console.error(`Error en Server Action saveCampania para ${projectId}:`, error);
    return false;
  }
}


export default async function CampaniaMarketingPage({ params }: PageProps) {
const parametros = await params;
  const { p: itemId } = parametros;
  
  let estudioData: EstudioMercadoData | null = null;
  let estrategiaData: EstrategiaMarketingData | null = null;
  let campaniaData: CampaniaMarketingData | null = null;
  let errorMessage: string | null = null;

  try {
    // 1. Fetch de Estudio de Mercado (Condicional)
    estudioData = await GWV('check', itemId, 'estudio-mercado');

    if (estudioData) {
      // 2. Fetch de Estrategia de Marketing (Condicional)
      estrategiaData = await GWV('check', itemId, 'estrategia-marketing');
    }

    if (estrategiaData) {
      // 3. Fetch de Campaña de Marketing (Condicional)
      // Aunque el page.tsx original fetcheaba 'campania-marketing' primero,
      // la lógica de dependencia sugiere que la campaña solo existe si existe la estrategia.
      // Reajustamos para que siga la dependencia.
      campaniaData = await GWV('check', itemId, 'campania-marketing');
    }

    // Aquí también podrías fetchear MakerData si es un prerrequisito para alguna generación
    const makerData = await GWV('check', itemId, 'maker') as MakerData | null;
    // Si makerData es crítico para el workflow y su falta impide todo lo demás,
    // podrías agregar una lógica condicional aquí o pasarla como prop.


  } catch (error: any) {
    console.error('Error en DynamicPage durante el fetching inicial:', error.message);
    errorMessage = `Error de conexión o inesperado durante la carga inicial: ${error.message}`;
  }

  if (errorMessage) {
    return (
      <div className="text-red-600 p-4">
        <h2>Error al cargar el contenido:</h2>
        <p>{errorMessage}</p>
        <p>Asegúrate de que el ID del proyecto es correcto y las APIs están disponibles.</p>
      </div>
    );
  }

  // Pasa todos los datos iniciales y las Server Actions al Client Component
  return (
    <div>
      <div className="cardMKT williFlowItem">
        <h2 className="mkt-subtitle">Flujo de Trabajo Marketing Digital</h2>
        <div className="cardMKTitemHidden">
          <Suspense fallback={<p>Cargando flujo de marketing...</p>}>
            <MarketingWorkflow
              idProyectoD={itemId}
              initialEstudioData={estudioData}
              initialEstrategiaData={estrategiaData}
              initialCampaniaData={campaniaData}
              // Pasa las Server Actions como props al Client Component
              onGenerateEstudio={generateEstudio}
              onSaveEstudio={saveEstudio}
              onGenerateEstrategia={generateEstrategia}
              onSaveEstrategia={saveEstrategia}
              onGenerateCampania={generateCampania}
              onSaveCampania={saveCampania}
              // También puedes pasar makerData si MarketingWorkflow lo necesita para alguna lógica cliente
              // initialMakerData={makerData} 
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}