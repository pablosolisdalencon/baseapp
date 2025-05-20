'use client';
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


interface EstudioMercadoData {
  // Define la estructura de los datos del estudio de mercado según tu API
  [key: string]: any;
}

const EstudioMercadoComponent = () => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const idProyecto = searchParams.get('id');
  const [dataEstudioMercado, setDataEstudioMercado] = useState<EstudioMercadoData | null>(null);
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
          console.log("==== IN NULL ")
          //if (existenciaResponse.status === 404) {
          if (existenciaData.id_proyecto != idProyecto) {
            // No existe, entonces llamamos a /api/maker
            console.log("==== 404 ")
            const makerResponse = await fetch(`/api/maker?p=${idProyecto}`);
            console.log("=== Maker response ")
            console.log(makerResponse)

            if (!makerResponse.ok) {
              
              setError(`Error al llamar a /api/maker: ${makerResponse}`);
              setIsLoading(false);
              return;
            }

            const makerData = await makerResponse.json();

            console.log("======= maker DATA =====")
            console.log(makerData)

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
            setDataEstudioMercado(estudioData);
          } else {
            setError(`Error al verificar existencia del estudio de mercado: ${existenciaResponse}`);
          }
        } else {
          // El estudio de mercado ya existe
          const estudioData = await existenciaResponse.json();
          setDataEstudioMercado(estudioData);
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
    return <div>Cargando datos del estudio de mercado...</div>;
  }

  if (error) {
    return <div>Error al cargar los datos: {error}</div>;
  }

  if (dataEstudioMercado) {
    return (
      <div>
        <h2>Datos del Estudio de Mercado para el Proyecto: {idProyecto}</h2>
        <pre>{JSON.stringify(dataEstudioMercado, null, 2)}</pre>
        {/* Aquí puedes renderizar los datos del estudio de mercado de forma más visual */}
      </div>
    );
  }

  return <div>No se encontraron datos del estudio de mercado para este proyecto.</div>;
};

export default EstudioMercadoComponent;