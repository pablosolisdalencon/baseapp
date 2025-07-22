// Similar a ProyectosPage, esta página se simplifica.
import { Suspense } from "react";
import CatalogoClient from "@/components/catalogo-client";
import { PageProps } from "@/types/marketingWorkflowTypes";
// Este es un Server Component. No tiene estado ni efectos de cliente.
export default async function DynamicPage({ params }: PageProps) {
  const parametros = await params;
  const { p: idProyecto } = parametros;
  // El middleware protege esta ruta.
  // CatalogoClient manejará la lógica de cliente, incluyendo el estado de carga/sesión.
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><p className="text-xl">Cargando catálogo...</p></div>}>
      <CatalogoClient idProyecto={idProyecto} />
    </Suspense>
  );
}