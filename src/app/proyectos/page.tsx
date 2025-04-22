"use client";
import Link from "next/link";
import { connectDB } from "@/utils/mongoose";
import Proyecto from "@/models/Proyecto";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ItemType {
    _id: string;
    nombre: string;
    descripcion: string;
    logo: string;
}

  

export default function Proyectos(){
    const { data: session, status } = useSession();

        const [dataList,setDataList] = useState<ItemType[] | null>(null);
        const [isLoadingC, setIsLoadingC] = useState(true);
        const [errorC, setErrorC] = useState<string | null>(null);
    
        const [idProyecto, setIdProyecto] = useState<string | null>(null);


        const router = useRouter();

       useEffect( () => {
        router.refresh();
            const user = session?.user?.email;
            if (user){
                console.log(user);
                
            
    
            //traer el proyecto
    
            const getFichaProyecto = async () => {
                setIsLoadingC(true);
                setErrorC(null);
    
                try {
                    const response = await fetch('api/proyecto/?u='+user);
                    if(!response.ok){
                        throw new Error(`<br>HTTP error! in Catalogo status: ${response.status}`);
                    }
                    const jsonData: ItemType[] = await response.json();
                    setDataList(jsonData);
                
                }catch (e: any){
                    setErrorC('<br>Error al cargar Catalogo :'+e.message);
                    setDataList(null);
                } finally {
                    setIsLoadingC(false);
                }
            };
            
             
            if( !getFichaProyecto()){
                setErrorC('<br>Algo paso ejecutando la funcion getFichaProyecto(); linea 84');
            }
            
            
        }
        
    
        },[router]);
    
        
        
           
        if(isLoadingC){
            return <p>Cargando datos del Catalogo...</p>;
        }
        if(errorC){
            return <p>Error cargando el catalogo: {errorC}</p>;
        }
        
        
    
       

    const proyectos = dataList;

    return(
    <div className="contenedor-proyectos">
        <h1 className="titulo-proyectos">Mis Proyectos</h1>
        { proyectos?.length as number > 0 ?  (
        <ul className="lista-proyectos">

        { proyectos?.map(proyecto => (
            

            <li className="item-proyecto" key={proyecto._id}>
                <div className="contenido-proyecto">
                    <img src={proyecto.logo} alt={proyecto.nombre} className="imagen-proyecto" />
                    <div className="titulo-contenedor-proyecto">
                        <h2 className="nombre-proyecto">{proyecto.nombre}</h2>
                    </div>
                    <div className="acciones-proyecto">
                        <Link href={`catalogo/?id=${proyecto._id}`}><button className="boton-gestion">Gestionar Catálogo</button></Link>
                        <Link href={`updateproyecto/?id=${proyecto._id}`}> <button className="boton-ficha">Ver Ficha</button></Link>
                        <Link href={`catalogo/${proyecto._id}`}><button className="boton-app">Ver App</button></Link>
                        <Link href={`catalogo/${proyecto._id}`}><button className="boton-mkt">Ver MKT</button></Link>
                        <Link href={`catalogo/${proyecto._id}`}> <button className="boton-eliminar">Eliminar</button></Link>
                    </div>
                </div>
            </li>
        ))}
        </ul>
            ) :(

                <p>sin datos </p> 
            
            )
            }
        <hr />
        <Link href="addproyecto"><button className="button-add-proyecto"> + Agregar Nuevo Proyecto</button></Link>
    </div>
    );
 }
