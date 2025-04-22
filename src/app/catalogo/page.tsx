"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import FichaItem from "@/components/FichaItem";
import Link from "next/link";


interface DataType {
    id: string;
    nombre: string;
    
}
interface ItemType {
    _id: string;
    nombre: string;
    id_proyecto: string;
    data: ItemType[];
    foto: string;
    tipo: string;
}


export default  function Catalogo(){
    const [dataList,setDataList] = useState<ItemType[] | null>(null);
    const [isLoadingC, setIsLoadingC] = useState(true);
    const [errorC, setErrorC] = useState<string | null>(null);

    const [data,setData] = useState<DataType | null>(null);
    const [isLoadingP, setIsLoadingP] = useState(true);
    const [errorP, setErrorP] = useState<string | null>(null);

    const [idProyecto, setIdProyecto] = useState<string | null>(null);




    
   

    useEffect( () => {
        const searchParams = useSearchParams();
        const id = searchParams.get('id')
        if (id){
            console.log(id);
            setIdProyecto(id);
        

        //traer ficha proyecto
        const getFichaProyecto = async () => {
            setIsLoadingP(true);
            setErrorP(null);

            try {
                const response = await fetch('api/proyecto/'+id);
                if(!response.ok){
                    throw new Error(`<br>HTTP error! in Proyecto status: ${response.status}`);
                }

                const jsonData: DataType = await response.json();
                setData(jsonData);
            
            }catch (e: any){
                setErrorP('<br>Error al cargar Proyecto['+id+']:'+e.message);
                setData(null);
            } finally {
                setIsLoadingP(false);
            }
        };
       

        // traer todo el catalogo del proyecto

        const getCatalogo = async () => {
            setIsLoadingC(true);
            setErrorC(null);

            try {
                const response = await fetch('api/item/?p='+id);
                if(!response.ok){
                    throw new Error(`<br>HTTP error! in Catalogo status: ${response.status}`);
                }
                const jsonData: ItemType = await response.json();
                setDataList(jsonData.data);
            
            }catch (e: any){
                setErrorC('<br>Error al cargar Catalogo :'+e.message);
                setDataList(null);
            } finally {
                setIsLoadingC(false);
            }
        };
        
         
        if( !getFichaProyecto()){
            setErrorC('<br>Algo paso ejecutando la funcion getFichaProyecto(); linea 84');
        }else{
            getCatalogo();
        }
        
        
    }
    

    },[]);

    
    
    if(isLoadingP){
        return <p>Cargando ficha Proyecto...</p>;
    }
    if(errorP){
        return <p>Error cargando el proyecto: {errorP}</p>;
    }

    if(isLoadingC){
        return <p>Cargando datos del Catalogo...</p>;
    }
    if(errorC){
        return <p>Error cargando el catalogo: {errorC}</p>;
    }
    
    const nombreProyecto=data?.nombre as string;

   
    return(
        <div className="catalog-manager-container">
            <h1 className="project-title">{nombreProyecto}</h1>
            <h2 className="catalog-subtitle">Gestión del Catálogo del Proyecto</h2>

            { dataList?.length as number > 0 ?  (
                    <ul className="catalog-list">
                          {dataList?.map((item) => (
                                <li className="catalog-item" key={item._id}>
                                    <div className="catalog-item-content">
                                        <img src={item.foto} alt="Producto 1" className="product-image"/>
                                        <div className="product-info">
                                            <h3 className="product-name">{item.nombre}</h3>
                                            <span className="product-type-label">{item.tipo}</span>
                                        </div>
                                        <div className="catalog-actions">
                                            <Link href={`fichaitem/?id=${item._id}&nombreProyecto=${nombreProyecto}&idProyecto=${idProyecto}`} > <button className="button-edit" >Editar</button></Link>
                                            <button className="button-delete">Eliminar</button>
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
            <Link href={`fichaitem/?idProyecto=${idProyecto}`}><button className="button-add-proyecto"> + Agregar Nuevo Item al Catalogo</button></Link>
        </div>
    );
}