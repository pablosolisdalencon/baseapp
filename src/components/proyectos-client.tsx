"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faBoxesPacking, faTrashCan, faBullhorn, faMobileScreenButton } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "@/components/ConfirmModal";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";

import { Spinner } from '@heroui/react'; 

interface ItemType {
  _id: string;
  nombre: string;
  descripcion: string;
  logo: string;
}

const ProyectosClient: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter(); // Inicializar router
  const [dataList, setDataList] = useState<ItemType[] | null>(null);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemType | null>(null);

  const handleDeleteClick = (item: ItemType) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handelConfirmDelete = async () => { // Convertir a async para esperar la eliminación
    if (itemToDelete) {
      await eliminar(itemToDelete); // Esperar a que se complete la eliminación
      closeDeleteModal();
      // Refrescar datos después de eliminar
      if (session?.user?.email) {
        fetchProyectos(session.user.email);
      }
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemToDelete(null); // Limpiar itemToDelete
  };

  const eliminar = async (item: ItemType) => {
    try {
      const res = await fetch(`/api/proyecto/${item._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Error al eliminar: ${res}`);
      }
      const data = await res.json();
      alert("Eliminado correctamente"); // Considerar usar notificaciones menos intrusivas
      console.log(data);
      // La actualización de la lista se hará en handelConfirmDelete
    } catch (error: any) {
      console.error("Error en eliminar:", error);
      alert(`Error al eliminar: ${error.message}`);
    }
  };

  const fetchProyectos = async (email: string) => {
    setIsFetchingData(true);
    setError(null);
    try {
      const res = await fetch(`/api/proyecto?user=${email}`);
      if (!res.ok) {
        throw new Error(`HTTP error! : ${res}`);
      }
      const jsonData: any = await res.json();
      setDataList(jsonData.data);
    } catch (err: any) {
      setError(`Error al cargar proyectos: ${err.message}`);
      setDataList(null);
    } finally {
      setIsFetchingData(false);
    }
  };

  useEffect(() => {

    if (session?.user?.email) {
      fetchProyectos(session.user.email);
    } else if (!session?.user?.email) {
        setError("No se pudo obtener el email del usuario.");
        setIsFetchingData(false);
    }
  }, [session, router]); // Añadir router a las dependencias

  // Estado de carga global de la sesión
  if (!session) {
    return <div className="flex justify-center items-center h-screen">
      <Spinner classNames={{label: "text-foreground mt-4"}} label="wave" variant="wave" />
      <p className="text-xl">Cargando sesión...</p></div>;
  }

  // Estado de carga de los datos del proyecto
  if (isFetchingData) {
    return <div className="flex justify-center items-center h-screen">
           <Spinner classNames={{label: "text-foreground mt-4"}} label="wave" variant="wave" />
            <p className="text-xl">Cargando proyectos...</p>
          </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-xl text-red-500">Error: {error}</p></div>;
  }

  if (!dataList || dataList.length === 0) {
    return (
      <div className="contenedor-proyectos text-center">
        <h1 className="titulo-proyectos">Mis Proyectos</h1>
        <p>No hay proyectos disponibles.</p>
        <hr className="my-4"/>
        <Link href="addproyecto">
          <button className="button-add-proyecto mt-4">+ Agregar Nuevo Proyecto</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="contenedor-proyectos">
      <h1 className="titulo-proyectos">Mis Proyectos</h1>
      <div className="container mx-auto py-8">
        {dataList.map((proyecto) => (
          <div className="app-card" key={proyecto._id}>
            <div className="app-card-image-container">
              <img src={proyecto.logo || '/default-logo.png'} alt={proyecto.nombre} className="app-card-image" /> {/* Añadir logo por defecto */}
            </div>
            <div className="app-card-content">
              <div>
                <h2 className="app-card-title">{proyecto.nombre}</h2>
                <p className="app-card-description">{proyecto.descripcion}</p>
              </div>
              <div className="app-card-buttons">
                <Link href={`/catalogo/${proyecto._id}`} className="app-card-button boton-gestion">
                  <FontAwesomeIcon icon={faBoxesPacking} className="icon" />
                  <br />
                  Catálogo
                </Link>
                <Link href={`/appviewer/?id=${proyecto._id}`} className="app-card-button boton-app">
                  <FontAwesomeIcon icon={faMobileScreenButton} className="icon"  />
                  <br />
                  eWaveApp
                </Link>
                <Link href={`/mktviewer/${proyecto._id}`} className="app-card-button boton-mkt">
                  <FontAwesomeIcon icon={faBullhorn} className="icon" />
                  <br />
                  Marketing
                </Link>
                <Link href={`/contents-manager/${proyecto._id}`} className="app-card-button boton-mkt">
                  <FontAwesomeIcon icon={faBullhorn}className="icon" />
                  <br />
                  Contenido
                </Link>
                <Link href={`/updateproyecto/?id=${proyecto._id}`} className="app-card-button boton-ficha">
                  <FontAwesomeIcon icon={faEdit} className="icon" />
                  <br />
                  Editar
                </Link>
                <button // Cambiado de <a> a <button> para acciones
                  onClick={() => handleDeleteClick(proyecto)}
                  className="app-card-button boton-eliminar"
                >
                  <FontAwesomeIcon icon={faTrashCan} className="icon"  />
                  <br />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr />
      <Link href="/addproyecto">
        <button className="button-add-proyecto">+ Agregar Nuevo Proyecto</button>
      </Link>

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
                <p>
                  <strong>ID:</strong>
                  {itemToDelete._id}
                </p>
                <p>
                  <strong>Nombre:</strong>
                  <h2>{itemToDelete.nombre}</h2>
                </p>
              </div>
            )}
            <p className="mt-2 text-sm text-gray-500">Esta acción no se puede deshacer.</p>
          </>
        }
      />
    </div>
  );
};

export default ProyectosClient;