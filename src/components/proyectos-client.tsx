"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faBoxesPacking, faTrashCan, faBullhorn, faMobileScreenButton } from '@fortawesome/free-solid-svg-icons';
import ConfirmModal from "@/components/ConfirmModal";

interface ItemType {
  _id: string;
  nombre: string;
  descripcion: string;
  logo: string;
}

const ProyectosClient: React.FC = () => {
  const [dataList, setDataList] = useState<ItemType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemType | null>(null);

  const handleDeleteClick = (item: ItemType) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handelConfirmDelete = () => {
    if (itemToDelete) {
      eliminar(itemToDelete);
      closeDeleteModal();
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const eliminar = async (item: ItemType) => {
    const res = await fetch(`/api/proyecto/${item._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data) {
      alert("Eliminado correctamente");
      console.log(data);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/proyecto`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const jsonData: any = await res.json();
        setDataList(jsonData.data);
      } catch (err: any) {
        setError(`Error al cargar proyectos: ${err.message}`);
        setDataList(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <p>Cargando proyectos...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    if (dataList && dataList.length > 0) {
      return (
        <div className="container mx-auto py-8">
          {dataList.map((proyecto) => (
            <div className="app-card" key={proyecto._id}>
              <div className="app-card-image-container">
                <img src={proyecto.logo} alt={proyecto.nombre} className="app-image" />
              </div>
              <div className="app-card-content">
                <div>
                  <h2 className="app-card-title">{proyecto.nombre}</h2>
                  <p className="app-card-description">{proyecto.descripcion}</p>
                </div>
                <div className="app-card-buttons">
                  <a href={`catalogo/?id=${proyecto._id}`} className="app-card-button boton-gestion">
                    <FontAwesomeIcon icon={faBoxesPacking} />
                    <br />
                    Catálogo
                  </a>
                  <a href={`appviewer/?id=${proyecto._id}`} className="app-card-button boton-app">
                    <FontAwesomeIcon icon={faMobileScreenButton} />
                    <br />
                    eWaveApp
                  </a>
                  <a href={`mktviewer/?id=${proyecto._id}`} className="app-card-button boton-mkt">
                    <FontAwesomeIcon icon={faBullhorn} />
                    <br />
                    Marketing
                  </a>
                  <a href={`contents-manager/?id=${proyecto._id}`} className="app-card-button boton-mkt">
                    <FontAwesomeIcon icon={faBullhorn} />
                    <br />
                    Contenido
                  </a>
                  <a href={`updateproyecto/?id=${proyecto._id}`} className="app-card-button boton-ficha">
                    <FontAwesomeIcon icon={faEdit} />
                    <br />
                    Editar
                  </a>
                  <a
                    href="#"
                    onClick={() => handleDeleteClick(proyecto)}
                    className="app-card-button boton-eliminar"
                  >
                    <FontAwesomeIcon icon={faTrashCan} />
                    <br />
                    Eliminar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return <p>No hay proyectos disponibles.</p>;
    }
  };

  return (
    <div className="contenedor-proyectos">
      <h1 className="titulo-proyectos">Mis Proyectos</h1>
      {renderContent()}
      <hr />
      <Link href="addproyecto">
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