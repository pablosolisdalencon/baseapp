import { getServerSession } from "next-auth";
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