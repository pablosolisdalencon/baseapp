import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Suspense } from "react";
import dynamic from "next/dynamic";
const MarketingWorkflow = dynamic(() => import("@/components/willi/StepByStepWilli"));

export default async function MktViewer(){
    const session = await getServerSession(authOptions);

    if (!session) {
      return (
        <div>
          <p>No estás autenticado. Redirigiendo...</p>
          <meta http-equiv="refresh" content="0; url=/api/auth/signin?callbackUrl=/proyectos" />
        </div>
      );
    }
  
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