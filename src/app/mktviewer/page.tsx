/*import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Suspense } from "react";
import MarketingWorkflow from "@/components/willi/StepByStepWilli";

export default async function MktViewer(){
    return (
        <div>

            <div className="cardMKT williFlowItem">    
                <h2 className="mkt-subtitle">Flujo de Trabajo Marketing Digital</h2>
                <div className="cardMKTitemHidden">
                 <Suspense fallback={<p>Cargando...</p>}><MarketingWorkflow/></Suspense>
                </div> 
            </div>

        </div>    
    )
}
    */
import { CampaniaMarketingData } from "@/types/campaniaMarketingTypes";

interface CampaniaMarketingPageProps {
  params: {
    idProyecto: string; // El nombre del parámetro debe coincidir con el nombre de la carpeta `[productId]`
  };
}
// Función para obtener los productos desde la API
// Esta función se ejecutará exclusivamente en el servidor durante la renderización.

async function getCampaniaMarketing({ params }: CampaniaMarketingPageProps): Promise<CampaniaMarketingData[]>  {
  // 1. Extraer el parámetro de ruta dinámico 'productId'
  const idProyecto = params.idProyecto;

  try {
    // Next.js extiende automáticamente la API nativa `fetch` para incluir
    // un potente sistema de cacheo y revalidación.
    // Por defecto, las peticiones fetch se cachean automáticamente.
    // - cache: 'no-store' -> No cachear (siempre obtener datos frescos)
    // - next: { revalidate: 60 } -> Revalidar la caché cada 60 segundos
    const res = await fetch('/api/campania-marketing?p'+idProyecto, {
      // Ejemplo de opciones de cacheo:
      // cache: 'no-store', // Deshabilita el cacheo (para datos muy dinámicos)
      // next: { revalidate: 3600 }, // Revalida la caché cada hora (para datos que cambian ocasionalmente)
    });

    if (!res.ok) {
      // Si la respuesta no es exitosa, lanza un error.
      // Next.js puede capturar esto con un archivo `error.tsx` cercano.
      throw new Error(`Error al obtener CampaniaMarketingData: ${res.statusText}`);
    }

    // Devuelve los datos en formato JSON
    return res.json();
  } catch (error) {
    console.error('Hubo un error al obtener CampaniaMarketingData:', error);
    // En una aplicación real, podrías querer mostrar un mensaje de error
    // o redirigir, o incluso lanzar el error para que error.tsx lo capture.
    return []; // Devuelve un array vacío en caso de error para que la página no falle.
  }
}