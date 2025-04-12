import { connectDB } from "@/utils/mongoose";
import Proyecto from "@/models/Proyecto";

async function loadProyectos(){
  connectDB()
  const proyectos = await Proyecto.find()
  return proyectos
}

async function Appviewer(){

    const proyectos = await loadProyectos()
    
    const proyecto = {
     nombre: "AppMakerDemo",  
     descripcion: "Este es un generador de apps para emprendedores." ,
     mision: "facilitar el emprendimiendo al menor costo posible",
     vision: "reeducir los costos con automatizacion a tal punto de romper la barrera tecnologica en el emprendimiento"    
    }
    return(
        <div className="viewer">
            <div>
            <h1>Mis Proyectos</h1>
                <ul>
                    {proyectos.map(proyecto => (
                        <li key={proyecto._id}>{proyecto.nombre}: {proyecto.descripcion}</li>
                    ))}
                </ul>

            </div>

            <h1>{proyecto.nombre}</h1>
            <p>{proyecto.descripcion}</p>
            <h2>Mision</h2>
            <p>{proyecto.mision}</p>
            <h2>Vision</h2>
            <p>{proyecto.vision}</p>

        </div>

    );
}
export default Appviewer