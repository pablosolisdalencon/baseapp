/*
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
    */

// src/app/proyectos/[idProyecto]/page.tsx
// Este es un Page Server Component (por defecto es async)

import MarketingContentManager from "@/components/willi/MarketingContentManager";
import { Suspense } from "react";

import { CampaniaMarketingData } from "@/types/marketingWorkflowTypes";
// Define las props que el componente de página recibe de Next.js
interface PageProps {
  params: {
    idProyecto: string; // Coincide con el nombre de la carpeta dinámica [idProyecto]
  };
}

export default async function MarketingContentsManagerPage({ params }: PageProps) {
  const idProyecto = params.idProyecto; // ¡Extraemos el parámetro de la URL!

  let campania: CampaniaMarketingData | null = null;
  let errorMessage: string | null = null;

  try {
    // 1. Llamada a la API interna desde el Page Server Component
    // Next.js optimiza las llamadas a rutas API internas desde Server Components:
    // no se realiza una petición HTTP real, sino que se invoca directamente el handler.
    // Usamos una URL completa para mayor robustez en despliegues.
    // Asegúrate de tener NEXT_PUBLIC_BASE_URL en tu .env.local (ej. http://localhost:3000)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/campania-marketing?p=${idProyecto}`;
    
    const res = await fetch(apiUrl, {
      cache: 'no-store' // Opcional: Deshabilita el cacheo para siempre obtener datos frescos
    });

    if (!res.ok) {
      // Si la respuesta no es 200 OK, lanzamos un error o manejamos el caso
      const errorData = await res.json();
      if (res.status === 404) {
        errorMessage = errorData.message || `Campaña no encontrada para el ID de proyecto: ${idProyecto}`;
      } else {
        throw new Error(`Error al cargar la campaña: ${errorData.message || res.statusText}`);
      }
    } else {
      campania = await res.json(); // Obtenemos el objeto campania
    }
  } catch (error: any) {
    console.error('Error en ProyectoPage:', error.message);
    errorMessage = `Error al obtener los datos de la campaña: ${error.message}`;
  }

  return (
    <div className="container mx-auto p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
        Detalles del Proyecto ID: <span className="text-blue-600">{idProyecto}</span>
      </h1>

      {errorMessage ? (
        // Si hay un error, lo mostramos
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative my-8 text-center shadow-lg">
          <strong className="font-bold">¡Oops!</strong>
          <span className="block sm:inline ml-2">{errorMessage}</span>
          <p className="mt-2 text-sm">Intenta con ID 123 o 456 para ver ejemplos.</p>
        </div>
      ) : (
        // Si no hay error, pasamos el objeto campania al componente cliente
        // El componente MarketingContentsManager se renderizará con los datos obtenidos en el servidor.
        <Suspense fallback={<p>Cargando...</p>}><MarketingContentManager CampaniaMarketingData={campania} /></Suspense>
      )}
    </div>
  );
}