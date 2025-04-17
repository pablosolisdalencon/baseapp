"use client"
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";





function Addproyecto(){

    const [newProyecto, setNewProyecto ] = useState({
        nombre: "",
        descripcion: "",
        mision: "",
        vision: "",
        logo: ""
    });

    const router = useRouter()

    const createProyecto = async () => {
        const res = await fetch('api/proyecto', {
            method: "POST",
            body: JSON.stringify(newProyecto),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        router.push('proyectos')
        console.log(data)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await createProyecto()
    }

    const handleChange = (
        e: ChangeEvent <HTMLInputElement | HTMLTextAreaElement>
    ) => setNewProyecto({ ... newProyecto, [e.target.name]: e.target.value});

    
    const showFormServ = () => {
    /*
        var fs = document.getElementById("frmserv");
        var fp = document.getElementById("frmprod");
        if(!fs || !fp)
            return;
        else
        fs.style.display="block";
        fp.style.display="none";
    */
        router.push('catalogo')    
        
    }
    const showFormProd = () => {
        /*
        var fs = document.getElementById("frmserv");
        var fp = document.getElementById("frmprod");
        if(!fs || !fp)
            return;
        else
        fs.style.display="none";
        fp.style.display="block";
        */
        router.push('catalogo')
    }





    return(
        <div>
             <form onSubmit={handleSubmit}>
                <h1>Crear Nuevo Proyecto</h1>
                <p>
                ¡Estamos listos para crear tus productos digitales! 🛠️ Para empezar, necesitamos conocer a fondo tu emprendimiento. Completa este formulario con toda la información relevante. ¡Esta será la base para construir herramientas digitales poderosas para tu negocio!
                </p>

                <input className="form-input" onChange={handleChange}  name="nombre" type="text" placeholder="Nombre del Proyecto"/>
                <textarea className="form-input" onChange={handleChange} name="descripcion"  placeholder="Descripción breve"></textarea>
                <textarea className="form-input" onChange={handleChange}  name="mision" placeholder="Mision"></textarea>
                <textarea className="form-input" onChange={handleChange}  name="vision"  placeholder="Vision"></textarea>
                <input className="form-input" onChange={handleChange}  name="logo" type="file" placeholder="Logo"/>
                <input className="form-input" onChange={handleChange}  name="fondo" type="file" placeholder="Fondo"/>


            <hr />
            <div className="btnfinalizar">
                <h2>eso es todo, ahora es nuestro turno de hacer el trabajo...</h2>
                <input type="submit" className="rounded bg-black text-amber-100" value="Guardar y Crear Nuevo Proyecto" />
            </div>

            </form>
        </div>
    );
}
export default Addproyecto