// src/app/items/[p]/page.tsx
// Este es un Page Server Component para una ruta dinámica `[p]` en el App Router.
// Se ejecuta completamente en el servidor, ideal para operaciones de fetching de datos.

import React, { Suspense } from 'react';
import ModuleClientComponent from '@/components/module/moduleClient';

// 1. Define la interfaz para las props que este Page Component recibirá de Next.js.
// El nombre del parámetro (`p`) debe coincidir exactamente con el nombre de la carpeta dinámica `[p]`.
interface PageProps {
  params: {
    p: string; // El valor del parámetro dinámico de la URL (e.g., "123" si la URL es /items/123)
  };
}

// 2. Define la interfaz para la estructura de datos que esperas de tu API.
// Esto ayuda a TypeScript a validar los datos obtenidos.
interface FetchedData {
  id: string;
  name: string;
  description: string;
}

/**
 * DynamicPage: Este es un Page Server Component.
 * Es `async` por defecto, permitiendo el uso de `await` para cargar datos directamente.
 * Se encarga de:
 * 1. Extraer el parámetro dinámico de la URL.
 * 2. Realizar una llamada a una API (interna en este caso).
 * 3. Pasar los datos obtenidos a un Client Component.
 */
export default async function DynamicPage({ params }: PageProps) {
  const itemId = params.p; // Accede al valor del parámetro 'p' de la URL

  let itemData: FetchedData | null = null;
  let errorMessage: string | null = null;

  try {
    // 3. Realiza la llamada a la API interna desde el Server Component.
    // Next.js optimiza estas llamadas: no se realiza una petición HTTP real
    // entre el Server Component y una API Route dentro del mismo proyecto;
    // en su lugar, se invoca directamente el handler de la API Route.
    // `process.env.NEXT_PUBLIC_BASE_URL` debe estar configurado en tu `.env.local`
    // (ejemplo: NEXT_PUBLIC_BASE_URL=http://localhost:3000)
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/data/${itemId}`; // Ruta a tu API Route dinámica

    const res = await fetch(apiUrl, {
      cache: 'no-store', // Opcional: Deshabilita el cacheo para siempre obtener datos frescos
    });

    if (!res.ok) {
      // Si la respuesta no es exitosa (ej. 404, 500), parsea el error y setea el mensaje.
      const errorResponse = await res.json();
      errorMessage = errorResponse.message || `Error desconocido al cargar datos para ID: ${itemId}`;
      console.error(`Error fetching data for ID '${itemId}':`, errorMessage);
    } else {
      // Si la respuesta es exitosa, parsea el JSON a tu interfaz `FetchedData`.
      itemData = await res.json();
    }
  } catch (error: any) {
    // Captura cualquier error de red o de ejecución durante el fetch.
    console.error('Error en DynamicPage durante el fetching:', error.message);
    errorMessage = `Error de conexión o inesperado: ${error.message}`;
  }

  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-indigo-50 to-blue-50 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center leading-tight">
        Detalles para el ID: <span className="text-purple-700">{itemId}</span>
      </h1>

      {errorMessage ? (
        // Si hay un error, muestra un mensaje amigable al usuario.
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md text-center max-w-md w-full animate-fade-in">
          <strong className="font-bold">¡Lo siento!</strong>
          <span className="block sm:inline ml-2">{errorMessage}</span>
          <p className="mt-3 text-sm italic">
            Por favor, intenta con las siguientes rutas para ver ejemplos:
            <br />
            `/items/123`, `/items/456`, o `/items/789`.
          </p>
        </div>
      ) : (
        // Si no hay errores, pasa los datos obtenidos al Client Component.
        // Envuelve el Client Component en <Suspense> para mostrar un fallback
        // mientras el componente cliente se "hidrata" en el navegador.
        <Suspense fallback={
          <div className="p-6 bg-white shadow-lg rounded-lg text-center text-gray-600 animate-pulse max-w-md w-full">
            <p>Cargando contenido dinámico...</p>
          </div>
        }>
          <ModuleClientComponent data={itemData} />
        </Suspense>
      )}
    </div>
  );
}