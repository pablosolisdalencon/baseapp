'use client';
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EstudioMercadoDisplay from "./EstudioMercadoDisplay";
import jsonPure from "@/utils/jsonPure";

interface Tendencia {
  nombre: string;
  descripcion: string;
  relevancia: string;
}

interface Oportunidad {
  nombre: string;
  descripcion: string;
  alineacion: string;
}

interface Desafio {
  nombre: string;
  descripcion: string;
}

// Estructura completa del objeto EstudioMercado
interface EstudioMercado {
  nombre_del_estudio: string;
  resumen_competitivo: string;
  tendencias_clave_mercado: Tendencia[];
  oportunidades_principales: Oportunidad[];
  desafios_clave: Desafio[];
  recomendaciones_iniciales: string;
}

const Willi = () => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const idProyecto = searchParams.get('id');
  const [dataEstudioMercado, setDataEstudioMercado] = useState<EstudioMercado | null>(null);
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

        console.log('###########  SE VA A VERIFICAR EXISTENCIA DE Estudio en BD   ###############')
        console.log('------ existenciaData ------')
        //console.log(existenciaData)
        console.log('------ existenciaData Lenght ------')
        console.log(existenciaData.data.length)
        console.log(existenciaData.data[0])

        if (existenciaData.data.length <= 0){
          console.log("--------------- existenciaData.data.length <=  -------------")

        
          //if (existenciaResponse.status === 404) {
          
            console.log("--------------- existenciaData.id_proyecto != idProyecto <=  -------------")
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


                const makerDataPure = jsonPure(makerData)
                // ######### ESTUDIO  #########
                // Llamamos a /api/willi para solicitar el estudio de mercado con el prompt de maker
                const estudioResponse = await fetch(`/api/willi`, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ maker: makerDataPure }),
                });

                if (!estudioResponse.ok) {
                    console.log(`Error al llamar a /api/willi/estudio-mercado (con id_proyecto): ${idProyecto}`)
                    setError(`Error al llamar a /api/willi/estudio-mercado (con id_proyecto): ${idProyecto}`);
                    setIsLoading(false);
                    return;
                }
                
                const estudioData = await estudioResponse.json();
                
                setDataEstudioMercado(estudioData);
                //guardar estudio en BD

                //console.log('###########  SE VA A GUARDAR EL ESTUDIO EN BD   ###############')
                //console.log('------ dataEstudioMercado ------')
                //console.log(dataEstudioMercado)
                //console.log('------ destudioData ------')
                //console.log(estudioData)
                //console.log('------ jsonPure destudioData ------')
                const cleanStudio = jsonPure(estudioData);

                const saveEstudioMercado = async () => {
                  const res = await fetch('api/estudio-mercado?p='+idProyecto, {
                    method: "POST",
                    body: JSON.stringify(cleanStudio),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                };
                saveEstudioMercado();



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
          if (!existenciaData.data[0].id_proyecto) {
            console.log("--------------- existenciaData.id_proyecto == idProyecto <=  -------------")
            setError(`Error al verificar existencia del estudio de mercado: ${existenciaResponse}`);
          } else {
            console.log("--------------- existenciaData.data.length mayor = a 1  -------------")
          // El estudio de mercado ya existe
          setDataEstudioMercado(existenciaData.data[0]);
            
          }
          
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
    return <div>Cargando datos del dataEstudioMercado  ...</div>;
  }

  if (error) {
    return <div>Error al cargar los datos dataEstudioMercado  : {error}</div>;
  }

  if (dataEstudioMercado) {
    
    return (
        <div>
            <h1>Estudio Mercado</h1>
            <div>
                <EstudioMercadoDisplay Jestudio={dataEstudioMercado} />
            </div>
        </div>
    )

    }
  return <div>No se encontraron datos generados por Willi para este proyecto.</div>;
}

export default Willi;