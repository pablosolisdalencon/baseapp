// Similar a ProyectosPage, esta página se simplifica.
import { Suspense } from "react";
import dynamic from "next/dynamic";

const CatalogoClient = dynamic(() => import("@/components/catalogo-client"));

export default function CatalogoPage() {
  // El middleware protege esta ruta.
  // CatalogoClient manejará la lógica de cliente, incluyendo el estado de carga/sesión.
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><p className="text-xl">Cargando catálogo...</p></div>}>
      <CatalogoClient />
    </Suspense>
  );
}