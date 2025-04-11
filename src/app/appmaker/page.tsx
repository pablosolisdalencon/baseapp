function Appmaker(){
    return(
        <div>
             <form action="">
                <h1>App Maker</h1>
                <p>Completa el formulario con toda la informacion relevante de tu emprendimiento, utilizaremos esta informacion como base para crear tus productos Digitales</p>
                <h2>Info General</h2>
           
                <input type="text" placeholder="Nombre del Proyecto"/>
                <input type="text" placeholder="Descripción breve"/>
                <input type="text" placeholder="Mision"/>
                <input type="text" placeholder="Vision"/>

                <h2>Que vendes?</h2>
                
                
                
                <hr />
                <div className="pscols2">
                    Mi negocio se basa en la prestacion de diversos servicios o uno muy particular y unico.
                    <input type="button" className="bg-sky-500 rounded" value="vendo Servicios" />
                </div>
                <div className="pscols2">
                    Mi negocio es fabricar o comprar productos para luego venderlos masivamente en el mercado.
                    <input type="button" className="rounded bg-green-800" value="vendo Productos" />
                    </div>
<hr />
            <div className="pscols2">
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
                <div className="pscols2">
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
                    <input type="button" className="rounded bg-black" value="Crear Aplicacion" />
                </div>

            </form>
        </div>
    );
}
export default Appmaker