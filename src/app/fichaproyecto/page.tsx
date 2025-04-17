"use client"
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";





export default function FichaProyecto(){

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
        router.push('appviewer')
        console.log(data)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await createProyecto()
    }

    const handleChange = (
        e: ChangeEvent <HTMLInputElement | HTMLTextAreaElement>
    ) => setNewProyecto({ ... newProyecto, [e.target.name]: e.target.value});

    

    return(
        <div>
             <form onSubmit={handleSubmit}>
                <h1>Ficha Proyecto</h1>
                <p>
                ¡Estamos listos para crear tus productos digitales! 🛠️ Para empezar, necesitamos conocer a fondo tu emprendimiento. Completa este formulario con toda la información relevante. ¡Esta será la base para construir herramientas digitales poderosas para tu negocio!


                </p>
                <h2>PASO 1</h2>
           
                <input onChange={handleChange}  name="nombre" type="text" placeholder="Nombre del Proyecto"/>
                <textarea onChange={handleChange} name="descripcion"  placeholder="Descripción breve"></textarea>
                <textarea onChange={handleChange}  name="mision" placeholder="Mision"></textarea>
                <textarea onChange={handleChange}  name="vision"  placeholder="Vision"></textarea>
                <input onChange={handleChange}  name="logo" type="file" placeholder="Logo"/>       
            
            <hr />
            <div className="btnfinalizar">
                <h2>eso es todo, ahora es nuestro turno de hacer el trabajo...</h2>
                <input type="submit" className="rounded bg-black" value="Guardar Proyecto" />
            </div>

            </form>
        </div>
    );
}