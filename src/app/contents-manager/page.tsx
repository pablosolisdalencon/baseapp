// Simplificación similar para ContentsManager page
import { Suspense } from "react";
import dynamic from "next/dynamic";

const MarketingContentManager = dynamic(() => import("@/components/willi/MarketingContentManager"), {
  suspense: true
});

export default function ContentsManagerPage() {
  // El middleware protege esta ruta.
  // MarketingContentManager se encargará de la lógica de cliente.
  return (
    <div>
      <div className="cardMKT MarketingContentManager">
        <h2 className="mkt-subtitle">Generador y Gestor de Contenido con IA de Marketing Digital</h2>
        <div className="cardMKTitemHidden">
          <Suspense fallback={<div className="flex justify-center items-center h-screen"><p className="text-xl">Cargando gestor de contenidos...</p></div>}>
            <MarketingContentManager />
          </Suspense>
        </div>
      </div>
    </div>
  );
}