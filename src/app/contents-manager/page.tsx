import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { Suspense } from "react";
import MarketingContentManager from "@/components/willi/MarketingContentManager";

export default async function ContentsManager(){
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
            <div className="cardMKT MarketingContentManager">    
                <h2 className="mkt-subtitle">Generador y Gestor de Contenido con IA de Marketing Digital</h2>
                <div className="cardMKTitemHidden">
                    <Suspense><MarketingContentManager/></Suspense>
                </div> 
            </div>
        </div>    
    )
}