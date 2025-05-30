"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from "@/components/ConfirmModal";


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


export default  function CatalogoClient(){
    const [dataList,setDataList] = useState<ItemType[] | null>(null);
    const [isLoadingC, setIsLoadingC] = useState(true);
    const [errorC, setErrorC] = useState<string | null>(null);

    const [data,setData] = useState<DataType | null>(null);
    const [isLoadingP, setIsLoadingP] = useState(true);
    const [errorP, setErrorP] = useState<string | null>(null);

    const [idProyecto, setIdProyecto] = useState<string | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ItemType | null>(null);

    const handleDeleteClick = (item: ItemType) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
    };
    
    const  handelConfirmDelete = () => {
    if(itemToDelete){
        // borrado
        eliminar(itemToDelete);
        // cerrar modal y limpiar estado
        closeDeleteModal();
    }
    };

    const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    }


   
    const router = useRouter();
    router.refresh();
    const searchParams = useSearchParams();
    
    useEffect( () => {
        
        
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
    },[router]);

    // ELIMINAR 
  const eliminar = async (item:ItemType) => {
    const res = await fetch('api/item/'+item._id, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await res.json()
    if(data){
        alert("Eliminado correctamente");
        console.log(data)
        router.refresh()
        router.push(`proyectos`)
    }
    
  }

    
    
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
                    <div className="container mx-auto py-8">
                          {dataList?.map((item) => (
                                <div className="app-card item-card"  key={item._id}>
                                    <div className="app-card-image-container">
                                        <img src={item.foto} alt={item.nombre} className="app-card-image" />
                                    </div>
                                    <div className="app-card-content">
                                        <div>
                                            <h2 className="app-card-title">{item.nombre}</h2>
                                            <p className="app-card-description"><span className="product-type-label">TIPO: {item.tipo}</span></p>
                                        </div>
                                        <div className="app-card-buttons">
                                            <a href={`updateitem?id=${item._id}&nombreProyecto=${nombreProyecto}&idProyecto=${idProyecto}`} className="app-card-button boton-ficha"><FontAwesomeIcon icon={faEdit}/><br />Editar</a>
                                            <a href="#" onClick={()=>handleDeleteClick(item)}className="app-card-button boton-eliminar"><FontAwesomeIcon icon={faTrashCan}/><br />Eliminar</a>
                                        </div>
                                    </div>
                                </div>


                        ))}
                    </div>
            ) :(

                <p>sin datos </p> 
               
            )
            }
        <hr />
            <Link href={`additem/?idProyecto=${idProyecto}`}><button className="button-add-proyecto"> + Agregar Nuevo Item al Catalogo</button></Link>
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handelConfirmDelete}
                title="Confirmar Eliminacion"
                message={
                <>
                    <p>¿Realmente deseas eliminar este elemento?</p>
                    {itemToDelete && (
                    <div className="mt-2 p-3 bg-gray-100 rounded">
                        <p><strong>ID:</strong>{itemToDelete._id}</p>
                        <p><strong>Nombre:</strong><h2>{itemToDelete.nombre}</h2></p>
                    </div>
                    )}
                    <p className="mt-2 text-sm text-gray-500">Esta acción no se puede deshacer.</p>
                </>
                }
            />
        </div>
    );
}

function refreshRouter() {
    throw new Error("Function not implemented.");
}