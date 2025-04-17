import Link from "next/link";
import { connectDB } from "@/utils/mongoose";
import Proyecto from "@/models/Proyecto";

async function loadProyectos(){
  connectDB()
  const proyectos = await Proyecto.find()
  return proyectos
}

export default async function Proyectos(){
    const proyectos = await loadProyectos()

    return(
    <div className="contenedor-proyectos">
        <h1 className="titulo-proyectos">Mis Proyectos</h1>

        <ul className="lista-proyectos">

        {proyectos.map(proyecto => (
            

            <li className="item-proyecto" key={proyecto._id}>
                <div className="contenido-proyecto">
                    <img src={proyecto.logo} alt={proyecto.nombre} className="imagen-proyecto" />
                    <div className="titulo-contenedor-proyecto">
                        <h2 className="nombre-proyecto">{proyecto.nombre}</h2>
                    </div>
                    <div className="acciones-proyecto">
                        <Link href={`catalogo/?id=${proyecto._id}`}><button className="boton-gestion">Gestionar Catálogo</button></Link>
                        <Link href={`fichaproyecto/?id=${proyecto._id}`}> <button className="boton-ficha">Ver Ficha</button></Link>
                        <Link href={`catalogo/${proyecto._id}`}><button className="boton-app">Ver App</button></Link>
                        <Link href={`catalogo/${proyecto._id}`}><button className="boton-mkt">Ver MKT</button></Link>
                        <Link href={`catalogo/${proyecto._id}`}> <button className="boton-eliminar">Eliminar</button></Link>
                    </div>
                </div>
            </li>
        ))}

        </ul>

        <hr />
        <Link href="fichaproyecto"><button className="button-add-proyecto"> + Agregar Nuevo Proyecto</button></Link>
    </div>
    );
 }
