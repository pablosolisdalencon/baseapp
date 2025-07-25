"use client"
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";





function Appmaker(){

    const [newProyecto, setNewProyecto ] = useState({
        nombre: "",
        descripcion: "",
        mision: "",
        vision: "",
        logo: ""
    });

    const router = useRouter()

    const createProyecto = async () => {
        const res = await fetch('/api/proyecto', {
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
                <h1>App Maker</h1>
                <p>
                ¡Estamos listos para crear tus productos digitales! 🛠️ Para empezar, necesitamos conocer a fondo tu emprendimiento. Completa este formulario con toda la información relevante. ¡Esta será la base para construir herramientas digitales poderosas para tu negocio!


                </p>
                <h2>PASO 1</h2>
           
                <input onChange={handleChange}  name="nombre" type="text" placeholder="Nombre del Proyecto"/>
                <textarea onChange={handleChange} name="descripcion"  placeholder="Descripción breve"></textarea>
                <textarea onChange={handleChange}  name="mision" placeholder="Mision"></textarea>
                <textarea onChange={handleChange}  name="vision"  placeholder="Vision"></textarea>
                <input onChange={handleChange}  name="logo" type="file" placeholder="Logo"/>

                <h2>PASO 2</h2>
                <h3>Que vendes?</h3>
                
                
                
                <hr />
                <div className="pscols2">
                    Mi negocio se basa en la prestacion de diversos servicios o uno muy particular y unico.
                    <input name="botonServicios" id="botonServicios" onClick={showFormServ} type="button" className="bg-sky-500 rounded" value="vendo Servicios" />
                </div>
                <div className="pscols2">
                    Mi negocio es fabricar o comprar productos para luego venderlos masivamente en el mercado.
                    <input type="button" onClick={showFormProd} className="rounded bg-green-800" value="vendo Productos" />
                    </div>
<hr />
            <div className="pscols2 oculto" id="frmserv" >
                <h2>Servicios</h2>
                <h3>Tienes tu catalogo?</h3>
                <h4>Cargalo aqui debajo:</h4>
                <input type="file" className="bg-sky-600 rounded" />
                <h3>O</h3>
        
                <input type="button" className="bg-sky-600 rounded" value="Agregar mis Servicios manualmente" />
                    
                <hr />    

                <input type="text" placeholder="Nombre Servicio "/>
                <input type="text" placeholder="Descripcion Servicio..."/>
                <input type="text" placeholder="$ Precio"/>
                Foto <input type="file" />

                <input type="button" className="bg-sky-300 rounded" value="AGREGAR otro servicio (+)" />

            </div>
            
            <div className="pscols2 oculto" id="frmprod">
                <h2>Productos</h2>
                <h3>Tienes tu catalogo?</h3>
                <h4>Cargalo aqui debajo:</h4>
                <input type="file" className="rounded bg-green-800" />
                <h3>O</h3>
        
                <input type="button" className="rounded bg-green-700" value="Agregar mis Productos manualmente" />
                    
                <hr />    

                <input type="text" placeholder="Nombre Producto "/>
                <input type="text" placeholder="Descripcion Producto..."/>
                <input type="text" placeholder="$ Precio"/>
                Foto <input type="file" />

                <input type="button" className="rounded bg-green-600" value="AGREGAR otro Producto (+)" />
            </div>
            
            <hr />
            <div className="btnfinalizar">
                <h2>eso es todo, ahora es nuestro turno de hacer el trabajo...</h2>
                <input type="submit" className="rounded bg-black" value="Crear Aplicacion" />
            </div>

            </form>
        </div>
    );
}
export default Appmaker