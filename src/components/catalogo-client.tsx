"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react"; // Importar useCallback
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from "@/components/ConfirmModal";
import { useSession } from 'next-auth/react';
import { ClientProps } from "@/types/marketingWorkflowTypes";

interface ProyectoDataType { // Renombrado para claridad
    _id: string; // Asumiendo que el proyecto también tiene un _id
    nombre: string;
}
interface ItemType {
    _id: string;
    nombre: string;
    id_proyecto: string;
    // data: ItemType[]; // Esta propiedad parece recursiva y podría no ser necesaria aquí
    foto: string;
    tipo: string;
}



  
const CatalogoClient: React.FC<ClientProps> = ({idProyecto}) => {
  //const { data: session } = useSession();
  const router = useRouter();

    const [catalogoItems, setCatalogoItems] = useState<ItemType[] | null>(null);
    const [isFetchingCatalogo, setIsFetchingCatalogo] = useState(true);
    const [errorCatalogo, setErrorCatalogo] = useState<string | null>(null);

    const [proyectoData, setProyectoData] = useState<ProyectoDataType | null>(null);
    const [isFetchingProyecto, setIsFetchingProyecto] = useState(true);
    const [errorProyecto, setErrorProyecto] = useState<string | null>(null);


    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<ItemType | null>(null);

    const handleDeleteClick = (item: ItemType) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const fetchCatalogo = useCallback(async (proyectoId: string) => {
        setIsFetchingCatalogo(true);
        setErrorCatalogo(null);
        try {
            const response = await fetch(`/api/item/?p=${proyectoId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! in Catalogo status: ${response}`);
            }
            const jsonData: { data: ItemType[] } = await response.json(); // Asumir que la API devuelve un objeto con una propiedad 'data'
            setCatalogoItems(jsonData.data);
        } catch (e: any) {
            setErrorCatalogo(`Error al cargar Catalogo: ${e.message}`);
            setCatalogoItems(null);
        } finally {
            setIsFetchingCatalogo(false);
        }
    }, []); // No hay dependencias que cambien la función en sí

    const fetchProyectoData = useCallback(async (proyectoId: string) => {
        setIsFetchingProyecto(true);
        setErrorProyecto(null);
        try {
            const response = await fetch(`/api/proyecto/${proyectoId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! in Proyecto status: ${response}`);
            }
            const jsonData: {data: ProyectoDataType} = await response.json(); // Asumir que la API devuelve un objeto con una propiedad 'data'
            setProyectoData(jsonData.data);
        } catch (e: any) {
            setErrorProyecto(`Error al cargar Proyecto [${proyectoId}]: ${e.message}`);
            setProyectoData(null);
        } finally {
            setIsFetchingProyecto(false);
        }
    }, []);


    const handelConfirmDelete = async () => {
        if (itemToDelete && idProyecto) {
            try {
                const res = await fetch(`/api/item/${itemToDelete._id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || `Error al eliminar item: ${res}`);
                }
                alert("Item eliminado correctamente");
                fetchCatalogo(idProyecto); // Recargar el catálogo
            } catch (error: any) {
                console.error("Error en handelConfirmDelete:", error);
                alert(`Error al eliminar item: ${error.message}`);
            } finally {
                closeDeleteModal();
            }
        }
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setItemToDelete(null);
    };
    
    useEffect(() => {

        const proyectoIdFromParams = idProyecto;
        if (proyectoIdFromParams) {
            
                fetchProyectoData(proyectoIdFromParams);
                fetchCatalogo(proyectoIdFromParams);
            
        } else {
            setErrorProyecto("ID de proyecto no encontrado en la URL.");
            setIsFetchingProyecto(false);
            setIsFetchingCatalogo(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router, fetchCatalogo, fetchProyectoData]); // fetchCatalogo y fetchProyectoData están envueltas en useCallback

    if ( (idProyecto && (isFetchingProyecto || isFetchingCatalogo))) {
        return <div className="flex justify-center items-center h-screen"><p className="text-xl">Cargando datos del catálogo...</p></div>;
    }

    if (errorProyecto) {
        return <div className="flex justify-center items-center h-screen"><p className="text-xl text-red-500">Error cargando el proyecto: {errorProyecto}</p></div>;
    }
    if (errorCatalogo) {
        return <div className="flex justify-center items-center h-screen"><p className="text-xl text-red-500">Error cargando el catálogo: {errorCatalogo}</p></div>;
    }
    
    const nombreProyecto = proyectoData?.nombre || "Proyecto";

    return (
        <div className="catalog-manager-container">
            <h1 className="project-title">{nombreProyecto}</h1>
            <h2 className="catalog-subtitle">Gestión del Catálogo del Proyecto</h2>

            {catalogoItems && catalogoItems.length > 0 ? (
                <div className="container mx-auto py-8">
                    {catalogoItems.map((item) => (
                        <div className="app-card item-card" key={item._id}>
                            <div className="app-card-image-container">
                                <img src={item.foto || '/default-item.png'} alt={item.nombre} className="app-card-image" />
                            </div>
                            <div className="app-card-content">
                                <div>
                                    <h2 className="app-card-title">{item.nombre}</h2>
                                    <p className="app-card-description"><span className="product-type-label">TIPO: {item.tipo}</span></p>
                                </div>
                                <div className="app-card-buttons">
                                    <Link href={`/updateitem/${idProyecto}/${item._id}/${encodeURIComponent(nombreProyecto)}`} className="app-card-button boton-ficha">
                                        <FontAwesomeIcon icon={faEdit} /><br />Editar
                                    </Link>
                                    <button onClick={() => handleDeleteClick(item)} className="app-card-button boton-eliminar">
                                        <FontAwesomeIcon icon={faTrashCan} /><br />Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center py-8">No hay items en el catálogo para este proyecto.</p>
            )}
            <hr />
            {idProyecto && (
                <Link href={`/additem/${idProyecto}`}>
                    <button className="button-add-proyecto">+ Agregar Nuevo Item al Catálogo</button>
                </Link>
            )}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handelConfirmDelete}
                title="Confirmar Eliminación"
                message={
                    <>
                        <p>¿Realmente deseas eliminar este elemento?</p>
                        {itemToDelete && (
                            <div className="mt-2 p-3 bg-gray-100 rounded">
                                <p><strong>ID:</strong> {itemToDelete._id}</p>
                                <p><strong>Nombre:</strong> <h2>{itemToDelete.nombre}</h2></p>
                            </div>
                        )}
                        <p className="mt-2 text-sm text-gray-500">Esta acción no se puede deshacer.</p>
                    </>
                }
            />
        </div>
    );
}
export default CatalogoClient;