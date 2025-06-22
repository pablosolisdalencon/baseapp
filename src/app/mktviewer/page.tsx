import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Suspense } from "react";
import MarketingWorkflow from "@/components/willi/StepByStepWilli";

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
                <Suspense><MarketingWorkflow/></Suspense>
                </div> 
            </div>

        </div>    
    )
}