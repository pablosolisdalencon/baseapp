import { describe } from "node:test";

function Appviewer(){
    
    const proyecto = {
     nombre: "AppMakerDemo",  
     descripcion: "Este es un generador de apps para emprendedores." ,
     mision: "facilitar el emprendimiendo al menor costo posible",
     vision: "reeducir los costos con automatizacion a tal punto de romper la barrera tecnologica en el emprendimiento"    
    }
    return(
        <div className="viewer">
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