import { Suspense } from 'react';
import WilliEwavePackGenerator from '@/components/willi/eWavePack';
import { EwaveMakerPageProps } from "@/types/marketingWorkflowTypes";
// Define las props esperadas para el componente de la página


// Este es un Server Component. No tiene estado ni efectos de cliente.
export default async function DynamicPage({ params }: EwaveMakerPageProps) {
  const parametros = await params;
  const { p: idProyecto } = parametros;

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-600">
          <svg className="animate-spin h-10 w-10 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg">Cargando Generador de eWavePack...</p>
        </div>
      </div>
    }>
      <WilliEwavePackGenerator idProyecto={idProyecto} />
    </Suspense>
  );
}