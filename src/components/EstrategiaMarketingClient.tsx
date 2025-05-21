'use client';
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
        {/* Aquí puedes renderizar los datos del estudio de mercado de forma más visual */}
      </div>
    );
  }

  return <div>No se encontraron datos del estudio de mercado para este proyecto.</div>;
};

export default EstrategiaMarketingComponent;