'use client';
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import JsonToPrompt from "@/utils/JsonToPrompt";
import EstudioMercadoDisplay from "./EstudioMercadoDisplay";



const Willi = () => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const idProyecto = searchParams.get('id');
  const [dataEstudioMercado, setDataEstudioMercado] = useState<string | null>(null);
  const [dataEstrategiaMarketing, setDataEstrategiaMarketing] = useState<string | null>(null);
  const [dataCampaniaMarketing, setDataCampaniaMarketing] = useState<string | null>(null);


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
        const existenciaData = await existenciaResponse.json();

        if (existenciaData.id_proyecto == null){

        
          //if (existenciaResponse.status === 404) {
          if (existenciaData.id_proyecto != idProyecto) {
            // Flujo > [ 1 ] No existe, CREAR ESTUDIO MERCADO

                // ---------------------------------------//
                // ######### MAKER  #########
                // 1 llamamos a /api/maker para obtener el contexto
                const makerResponse = await fetch(`/api/maker?p=${idProyecto}`);

                if (!makerResponse.ok) {
                setError(`Error al llamar a /api/maker: ${makerResponse}`);
                setIsLoading(false);
                return;
                }
                const makerData = await makerResponse.json();
                // end ######### MAKER  #########
                // ---------------------------------------//



                // ######### ESTUDIO  #########
                // Llamamos a /api/willi para solicitar el estudio de mercado con el prompt de maker
                const estudioResponse = await fetch(`/api/willi`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ maker: makerData }),
                });

                if (!estudioResponse.ok) {
                    console.log(`Error al llamar a /api/willi/estudio-mercado (con id_proyecto): ${idProyecto}`)
                    setError(`Error al llamar a /api/willi/estudio-mercado (con id_proyecto): ${idProyecto}`);
                    setIsLoading(false);
                    return;
                }
                const estudioData = await estudioResponse.json();
                setDataEstudioMercado(estudioData);
                // end ######### ESTUDIO  #########
                // ---------------------------------------//


            // Flujo > [ 2 ] Con el Estudio Mercado CREAR ESTRATEGIA
            /*
            console.log("======= estudioData ===========")
            console.log(estudioData)

            const textEstudio = JsonToPrompt(estudioData)
            const textMaker = JsonToPrompt(makerData)

             
            //Llamamos a /api/estrategia-marketing con el prompt de maker
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

            */
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
    return <div>Cargando datos del Estrategia de Marketing...</div>;
  }

  if (error) {
    return <div>Error al cargar los datos Estrategia de Marketing: {error}</div>;
  }

  if (dataEstudioMercado) {
    
    return (
        <div>
            <h2>Datos Estudio Mercado para el Proyecto: {idProyecto}</h2>
            <div>
                <EstudioMercadoDisplay Jestudio={`${dataEstudioMercado}`} />
            </div>
        </div>
    )

    }
  return <div>No se encontraron datos del estudio de mercado para este proyecto.</div>;
}

export default Willi;