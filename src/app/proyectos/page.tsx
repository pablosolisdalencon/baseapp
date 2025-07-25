// Esta página ahora es principalmente un contenedor y la lógica de cliente se maneja en ProyectosClient.
// Ya no es necesario getServerSession aquí si ProyectosClient maneja la sesión del lado del cliente.
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Carga dinámica del componente cliente
const ProyectosClient = dynamic(() => import("@/components/proyectos-client"));

export default function ProyectosPage() { // Renombrar para claridad si es necesario
  // El middleware ya protege esta ruta.
  // ProyectosClient se encargará de verificar la sesión del lado del cliente si es necesario
  // o mostrar un estado de carga/error.
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><p className="text-xl">Cargando proyectos...</p></div>}>
      <ProyectosClient />
    </Suspense>
  );
}