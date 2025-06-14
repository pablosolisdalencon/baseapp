import { Suspense } from "react";
import MarketingWorkflow from "@/components/willi/StepByStepWilli";
import MarketingContentManager from "@/components/willi/MarketingContentManager";
export default function MktViewer(){
    return (
        <div>
            <div className="cardMKT MarketingContentManager">    
                <h2 className="mkt-subtitle">Generador y Gestor de Contenido con IA de Marketing Digital</h2>
                <div className="cardMKTitemHidden">
                    <Suspense><MarketingContentManager/></Suspense>
                </div> 
            </div>
        </div>    
    )
}