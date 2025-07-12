import React, { Suspense } from 'react';
import MarketingContentManager from "@/components/willi/MarketingContentManager";
import type { CampaniaMarketingPageProps, CampaniaMarketingData } from '@/types/marketingWorkflowTypes';


export default async function DynamicPage({ params }: CampaniaMarketingPageProps) {
  const parametros = await params;
  const { p: itemId } = parametros;

      let data: CampaniaMarketingData | null = null;
      let errorMessage: string | null = null;

  try {
    // 3. Realiza la llamada a la API interna desde el Server Component.
    // Next.js optimiza estas llamadas: no se realiza una petición HTTP real
    // entre el Server Component y una API Route dentro del mismo proyecto;
    // en su lugar, se invoca directamente el handler de la API Route.
    // `process.env.NEXT_PUBLIC_BASE_URL` debe estar configurado en tu `.env.local`
    // (ejemplo: NEXT_PUBLIC_BASE_URL=http://localhost:3000)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/campania-marketing?p=${itemId as string}`; // Ruta a tu API Route dinámica

    const res = await fetch(apiUrl, {
      cache: 'no-store', // Opcional: Deshabilita el cacheo para siempre obtener datos frescos
    });

    if (!res.ok) {
      // Si la respuesta no es exitosa (ej. 404, 500), parsea el error y setea el mensaje.
      const errorResponse = await res.json();
      errorMessage = errorResponse.message || `Error desconocido al cargar datos para ID: ${itemId}`;
      console.error(`Error fetching data for ID '${itemId}':`, errorMessage);
    } else {
 
     const response  = await res.json();
         let mydata = response.data;

          if(mydata){
            data = mydata[0]
      }else{
         // Captura cualquier error de red o de ejecución durante el fetch.
    console.error('Error en Jsonificando:');
    errorMessage = `Error Jsonificando`;
      }
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
                 <Suspense fallback={<p>Cargando...</p>}><MarketingContentManager CampaniaMarketingData={data}/></Suspense>
                </div> 
            </div>

        </div>    
    )
}
