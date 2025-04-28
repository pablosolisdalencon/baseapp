"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface ItemType {
  _id: string;
  nombre: string;
  descripcion: string;
  logo: string;
}

export default function Proyectos() {
  const { data: session, status } = useSession();
  const [dataList, setDataList] = useState<ItemType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userReady, setUserReady] = useState(false);

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
        <ul className="lista-proyectos">
          {dataList.map(proyecto => (
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