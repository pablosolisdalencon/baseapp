import React, { Suspense } from 'react';
import EWavePack from '@/components/willi/eWavePack';

import type { eWavePackPageProps } from '@/types/marketingWorkflowTypes';

export default async function DynamicPage({ params }: eWavePackPageProps) {
  const parametros = await params;
  const { p: itemId } = parametros;

      let data: any | null = null;
      let errorMessage: string | null = null;

  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/maker?p=${itemId as string}`; 

    const res = await fetch(apiUrl, {
      cache: 'no-store',
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
                <h2 className="mkt-subtitle">Felicidades! has conseguido un eWavePack!</h2>
                <div className="cardMKTitemHidden">
                 <Suspense fallback={<p>Cargando...</p>}><EWavePack idProyecto={itemId} MakerData={data} /> </Suspense>
                </div> 
            </div>

        </div>    
    )
}
