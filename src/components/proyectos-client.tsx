"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit,  faBoxesPacking, faTrashCan, faBullhorn, faMobileScreenButton } from '@fortawesome/free-solid-svg-icons';



interface ItemType {
  _id: string;
  nombre: string;
  descripcion: string;
  logo: string;
}

export default function ProyectosClient() {
  const { data: session, status } = useSession();
  const [dataList, setDataList] = useState<ItemType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userReady, setUserReady] = useState(false);

  const router = useRouter();


  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      setUserReady(false);
      return;
    }

    const user = session?.user?.email;
    setUserReady(!!user);

    if (user) {
      const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const res = await fetch(`/api/proyecto?user=${user}`);
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
    } else {
      setIsLoading(false);
      setDataList(null);
    }
  }, [session?.user?.email, status]);
  // ELIMINAR 

  const eliminar = async (id:string) => {
    const res = await fetch('api/proyecto/'+id, {
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
  
  const goEliminar = async (id:string) => {
    await eliminar(id);
  }


  // Método para generar el JSX del retorno basado en el estado
  const renderContent = () => {
    if (isLoading) {
      return <p>Cargando proyectos...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    if (userReady && dataList && dataList.length > 0) {
      return (
        <div className="container mx-auto py-8">
          {dataList.map(proyecto => (

              
              
        <div className="app-card"  key={proyecto._id}>
            <div className="app-card-image-container">
                <img src={proyecto.logo} alt={proyecto.nombre} className="app-card-image" />
            </div>
            <div className="app-card-content">
                <div>
                    <h2 className="app-card-title">{proyecto.nombre}</h2>
                    <p className="app-card-description">{proyecto.descripcion}</p>
                </div>
                <div className="app-card-buttons">
                    <a href={`catalogo/?id=${proyecto._id}`} className="app-card-button boton-gestion"><FontAwesomeIcon icon={faBoxesPacking} /> Catálogo</a>
                    <a href={`appviewer/?id=${proyecto._id}`} className="app-card-button boton-app"><FontAwesomeIcon icon={faMobileScreenButton} /> Ver App</a>
                    <a href={`mktviewer/?id=${proyecto._id}`} className="app-card-button boton-mkt">Ver MKT</a>
                    <a href={`updateproyecto/?id=${proyecto._id}`} className="app-card-button boton-ficha"><FontAwesomeIcon icon={faEdit} className="mr-2" /> Editar</a>
                    <a href="#" onClick={()=>goEliminar(proyecto._id)} className="app-card-button boton-eliminar"><FontAwesomeIcon icon={faTrashCan} className="mr-2"/> Eliminar</a>
                </div>
            </div>
        </div>

          ))}
        </div>
      );
    } else {
      return <p>{userReady ? 'Sin datos' : 'Esperando información del usuario...'}</p>;
    }
  };

  return (
    <div className="contenedor-proyectos">
      <h1 className="titulo-proyectos">Mis Proyectos</h1>
      {renderContent()}
      <hr />
      <Link href="addproyecto"><button className="button-add-proyecto"> + Agregar Nuevo Proyecto</button></Link>
    </div>
  );
}