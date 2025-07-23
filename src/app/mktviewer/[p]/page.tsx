// app/mktviewer/page.tsx
import {
  EstudioMercadoData,
  EstrategiaMarketingData,
  CampaniaMarketingData,
  PageProps
} from "@/types/marketingWorkflowTypes"; // Asegúrate de que la ruta sea correcta
import StepByStepWilli from "@/components/willi/StepByStepWilli"; // Ajusta la ruta a tu componente de cliente


// Función para obtener datos de forma segura en el servidor
// Puedes usar un archivo de utilidades de servidor para esto
async function fetchServerData<T>(endpoint: string, projectId: string): Promise<T | null> {
  try {
    const response = await fetch(`${process.env.NEXTAUTH_URL}/api/${endpoint}?projectId=${projectId}`, {
      cache: 'no-store', // Para asegurar que siempre se obtenga la última versión
    });

    if (!response.ok) {
      console.error(`Error al obtener ${endpoint}: ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Excepción al obtener ${endpoint}:`, error);
    return null;
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const parametros = await params;
  const { p: projectId } = parametros;

  // Obtener los datos iniciales para estudio, estrategia y campaña
  // Asumiendo que tienes endpoints de API para obtener estos datos por projectId
  const initialEstudio = await fetchServerData<EstudioMercadoData>("estudio-mercado", projectId);
  const initialEstrategia = await fetchServerData<EstrategiaMarketingData>("estrategia-marketing", projectId);
  const initialCampania = await fetchServerData<CampaniaMarketingData>("campania-marketing", projectId);

  return (
    <div className="container mx-auto p-4">
      {/* Pasar los datos obtenidos como props al componente de cliente */}
      <StepByStepWilli initialEstudio={initialEstudio}
        initialEstrategia={initialEstrategia}
        initialCampania={initialCampania}
        idProyectoD={projectId} // También pasar el projectId si es necesario para las acciones del cliente
      />
    </div>
  );
}
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