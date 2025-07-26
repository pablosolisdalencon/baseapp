/*'use client';
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JsonToPrompt from "@/utils/JsonToPrompt";



interface EstrategiaMarketingData {
  // Define la estructura de los datos del estudio de mercado según tu API
  [key: string]: any;
}

const EstrategiaMarketingComponent = () => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const idProyecto = searchParams.get('id');
  const [dataEstrategiaMarketing, setDataEstrategiaMarketing] = useState<EstrategiaMarketingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    router.refresh();
    const fetchData = async () => {
      if (!idProyecto) {
        setError('El parámetro idProyecto no fue encontrado en la URL.');
        setIsLoading(false);
        return;
      }

      try {
        // Consulta inicial para verificar la existencia del estudio de mercado
        const existenciaResponse = await fetch(`/api/estudio-mercado?p=${idProyecto}`);
        console.log("========== Type Response");
        console.log(typeof existenciaResponse)
        const existenciaData = await existenciaResponse.json();

        if (existenciaData.id_proyecto == null) {
          //if (existenciaResponse.status === 404) {
          if (existenciaData.id_proyecto != idProyecto) {
            // No existe, entonces llamamos a /api/maker
            const makerResponse = await fetch(`/api/maker?p=${idProyecto}`);

            if (!makerResponse.ok) {
              
              setError(`Error al llamar a /api/maker: ${makerResponse}`);
              setIsLoading(false);
              return;
            }

            const makerData = await makerResponse.json();
            // Llamamos a /api/estudio-mercado con el prompt de maker
            const estudioResponse = await fetch(`/api/willi/estudio-mercado?p=${idProyecto}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt: makerData }),
            });

            if (!estudioResponse.ok) {
         
              console.log(`Error al llamar a /api/willi/estudio-mercado (con id_proyecto): ${idProyecto}`)
              setError(`Error al llamar a /api/willi/estudio-mercado (con id_proyecto): ${idProyecto}`);
              setIsLoading(false);
              return;
            }

            const estudioData = await estudioResponse.json();

            const textEstudio = JsonToPrompt(estudioData)
            const textMaker = JsonToPrompt(makerData)

            // Llamamos a /api/estrategia-marketing con el prompt de maker
            const estrategiaResponse = await fetch(`/api/willi/estrategia-marketing?p=${idProyecto}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ maker: textMaker, estudio_mercado: textEstudio }),
            });

            if (!estrategiaResponse.ok) {
         
              console.log(`Error al llamar a /api/willi/estrategia-marketing (con id_proyecto): ${idProyecto}`)
              setError(`Error al llamar a /api/willi/estrategia-marketing (con id_proyecto): ${idProyecto}`);
              setIsLoading(false);
              return;
            }

            
            const estrategiaData = await estrategiaResponse.json();
            setDataEstrategiaMarketing(estrategiaData);
          } else {
            setError(`Error al verificar existencia del estudio de mercado: ${existenciaResponse}`);
          }
        } else {
          // El estudio de mercado ya existe
          const estudioData = await existenciaResponse.json();
          setDataEstrategiaMarketing(estudioData);
        }
      } catch (err: any) {
        setError(`Ocurrió un error inesperado: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [idProyecto]);

  if (isLoading) {
    return <div>Cargando datos del Estrategia de Marketing...</div>;
  }

  if (error) {
    return <div>Error al cargar los datos Estrategia de Marketing: {error}</div>;
  }

  if (dataEstrategiaMarketing) {
    return (
      <div>
        <h2>Datos Estrategia de Marketing para el Proyecto: {idProyecto}</h2>
        <textarea>{JSON.stringify(dataEstrategiaMarketing, null, 2)}</textarea>
      </div>
    );
  }

  return <div>No se encontraron datos del estudio de mercado para este proyecto.</div>;
};

export default EstrategiaMarketingComponent;






// Componente para mostrar la Estrategia de Marketing
const EstrategiaMarketingDisplay = ({ EstrategiaInput, onSave, showSaveButton = false }) => {
  if (!EstrategiaInput) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Estrategia de Marketing</h3>
      <div className="bg-gray-50 p-4 rounded-md">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
          {JSON.stringify(EstrategiaInput, null, 2)}
        </pre>
      </div>
      {showSaveButton && (
        <button
          onClick={onSave}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Guardar Estrategia de Marketing
        </button>
      )}
    </div>
  );
};
*/
'use client';
import React from 'react';
import { EstrategiaMarketingData, ObjetivoGeneral, AnalisisMercadoTarget, PilarEstrategico, CanalYTacticaInicial, PlanDeAccionFase1Item, DisplayProps } from '../types/marketingWorkflowTypes'; // Asegúrate de ajustar la ruta

// Definición de clases de Tailwind CSS para mantener consistencia con el ejemplo
const commonClasses = {
  container: "bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mx-auto my-8",
  title: "text-3xl font-bold text-center text-gray-800 mb-6 border-b pb-4",
  summary: "text-center text-gray-600 mb-8",
  section: "mb-8 p-6 bg-gray-50 rounded-lg shadow-md",
  sectionTitle: "text-2xl font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200",
  subsectionTitle: "text-xl font-medium text-indigo-700 mb-3",
  list: "space-y-4",
  listItem: "p-4 bg-white rounded-md shadow-sm border border-gray-200",
  sublistItem: "p-3 bg-gray-100 rounded-md border border-gray-300",
  paragraph: "text-gray-700 mb-2",
  tag: "inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2 mb-1",
  noData: "text-gray-500 italic"
};

const EstrategiaMarketingDisplay: React.FC<DisplayProps<EstrategiaMarketingData>> = ({ Input: estrategiaInput, onSave, showSaveButton = false }) => {
   if (!estrategiaInput) return null;
   const estrategia =estrategiaInput;
   console.log("##########  EstudioMercado Display say EstudioMercadoInput")
   console.log(estrategiaInput)
   if (!estrategia) {
     return <p>Cargando estrategia o no hay datos...</p>;
   }
  console.log("##########  EstrategiMarketing Display say estrategiaInput")
  console.log(estrategiaInput)

  const handleSaveClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Si onSave existe y los datos de la estrategia están disponibles, llámalo.
    if (onSave && estrategia) {
      onSave(estrategia);
    }
  };
  return (
    <div className={commonClasses.container}>
      <h1 className={commonClasses.title}>
        {estrategia.nombre_estrategia || "Estrategia General de Marketing - Modo EPIC"}
      </h1>
      <p className={commonClasses.summary}>
        He definido una estrategia de marketing integral y profundamente personalizada bajo el modo operativo EPIC.
      </p>

      {/* 1. Nombre de la Estrategia (ya en el título principal) */}
      {/* 2. Objetivos Generales */}
      <section className={commonClasses.section}>
        <h2 className={commonClasses.sectionTitle}>Objetivos Generales</h2>
        {estrategia.objetivos_generales && estrategia.objetivos_generales.length > 0 ? (
          <ul className={commonClasses.list}>
            {estrategia.objetivos_generales.map((obj: ObjetivoGeneral, index: number) => (
              <li key={index} className={commonClasses.listItem}>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{obj.nombre}</h3>
                <p className={commonClasses.paragraph}>{obj.descripcion}</p>
                {obj.metricas_clave && obj.metricas_clave.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium text-gray-700 mb-1">Métricas Clave:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 pl-4 space-y-1">
                      {obj.metricas_clave.map((metrica, i) => (
                        <li key={i}>{metrica}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className={commonClasses.noData}>No se definieron objetivos generales.</p>
        )}
      </section>

      {/* 3. Análisis de Mercado Target */}
      <section className={commonClasses.section}>
        <h2 className={commonClasses.sectionTitle}>Análisis de Mercado Target</h2>
        {estrategia.analisis_mercado_target ? (
          <div className={commonClasses.listItem}>
            <p className={commonClasses.paragraph}>
              <strong className="font-medium">Base de Estudio de Mercado:</strong> {estrategia.analisis_mercado_target.base_estudio_mercado}
            </p>
            <p className={commonClasses.paragraph}>
              <strong className="font-medium">Identificación de Target:</strong> {estrategia.analisis_mercado_target.identificacion_target}
            </p>
          </div>
        ) : (
          <p className={commonClasses.noData}>No se proporcionó información de análisis de mercado y target.</p>
        )}
      </section>

      {/* 4. Pilares Estratégicos */}
      <section className={commonClasses.section}>
        <h2 className={commonClasses.sectionTitle}>Pilares Estratégicos</h2>
        {estrategia.pilares_estrategicos && estrategia.pilares_estrategicos.length > 0 ? (
          <ul className={commonClasses.list}>
            {estrategia.pilares_estrategicos.map((pilar: PilarEstrategico, index: number) => (
              <li key={index} className={commonClasses.listItem}>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{pilar.nombre}</h3>
                <p className={commonClasses.paragraph}>{pilar.descripcion}</p>
                {pilar.canales_principales && pilar.canales_principales.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium text-gray-700 mb-1">Canales Principales:</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {pilar.canales_principales.map((canal, i) => (
                        <span key={i} className={commonClasses.tag}>{canal}</span>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className={commonClasses.noData}>No se definieron pilares estratégicos.</p>
        )}
      </section>

      {/* 5. Canales y Tácticas Iniciales */}
      <section className={commonClasses.section}>
        <h2 className={commonClasses.sectionTitle}>Canales y Tácticas Iniciales</h2>
        {estrategia.canales_y_tacticas_iniciales && estrategia.canales_y_tacticas_iniciales.length > 0 ? (
          <ul className={commonClasses.list}>
            {estrategia.canales_y_tacticas_iniciales.map((item: CanalYTacticaInicial, index: number) => (
              <li key={index} className={commonClasses.listItem}>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Canal: {item.canal}</h3>
                {item.tacticas && item.tacticas.length > 0 && (
                  <div className="mt-2">
                    <p className="font-medium text-gray-700 mb-1">Tácticas:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 pl-4 space-y-1">
                      {item.tacticas.map((tactica, i) => (
                        <li key={i}>{tactica}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className={commonClasses.noData}>No se definieron canales y tácticas iniciales.</p>
        )}
      </section>

      {/* 6. Plan de Acción Fase 1 */}
      <section className={commonClasses.section}>
        <h2 className={commonClasses.sectionTitle}>Plan de Acción Fase 1</h2>
        {estrategia.plan_de_accion_fase_1 && estrategia.plan_de_accion_fase_1.length > 0 ? (
          <ul className={commonClasses.list}>
            {estrategia.plan_de_accion_fase_1.map((accion: PlanDeAccionFase1Item, index: number) => (
              <li key={index} className={commonClasses.listItem}>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Día: {accion.dia}</h3>
                <p className={commonClasses.paragraph}><strong className="font-medium">Acción:</strong> {accion.descripcion}</p>
                <p className={commonClasses.paragraph}><strong className="font-medium">Responsable:</strong> {accion.responsable}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={commonClasses.noData}>No se definió un plan de acción para la fase 1.</p>
        )}
      </section>

      {/* 7. Consideraciones Adicionales */}
      <section className={commonClasses.section}>
        <h2 className={commonClasses.sectionTitle}>Consideraciones Adicionales</h2>
        {estrategia.consideraciones_adicionales && estrategia.consideraciones_adicionales.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {estrategia.consideraciones_adicionales.map((consideracion:any, index:any) => (
              <li key={index}>{consideracion}</li>
            ))}
          </ul>
        ) : (
          <p className={commonClasses.noData}>No se añadieron consideraciones adicionales.</p>
        )}
      </section>
      {showSaveButton && onSave && (
        <button
          onClick={handleSaveClick}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Guardar Estrategia de Marketing
        </button>
      )}
    </div>
  );
};

export default EstrategiaMarketingDisplay;