/*

   
import { Suspense } from "react";
import MarketingWorkflow from "@/components/willi/StepByStepWilli";

interface CampaniaMarketingPageProps {
  params: {
    idProyecto: string; // El nombre del parámetro debe coincidir con el nombre de la carpeta `[productId]`
  };
}
// Función para obtener los productos desde la API
// Esta función se ejecutará exclusivamente en el servidor durante la renderización.


export default async function CampaniaMarketingPage({ params }: CampaniaMarketingPageProps) {
  const idProyecto = await params.idProyecto as string;


      return (
        <div>
            <div className="cardMKT williFlowItem">    
                <h2 className="mkt-subtitle">Flujo de Trabajo Marketing Digital</h2>
                <div className="cardMKTitemHidden">
                 <Suspense fallback={<p>Cargando...</p>}><MarketingWorkflow idProyectoD={idProyecto}/></Suspense>
                </div> 
            </div>

        </div>    
    )
}
    */