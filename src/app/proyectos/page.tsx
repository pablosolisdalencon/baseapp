export default function Proyectos(){
    return(
    <div className="contenedor-proyectos">
        <h1 className="titulo-proyectos">Mis Proyectos</h1>

        <ul className="lista-proyectos">
            <li className="item-proyecto">
                <div className="contenido-proyecto">
                    <img src="https://via.placeholder.com/60x40/4285F4/FFFFFF?Text=P1" alt="Proyecto 1" className="imagen-proyecto" />
                    <div className="titulo-contenedor-proyecto">
                        <h2 className="nombre-proyecto">Proyecto Alfa</h2>
                    </div>
                    <div className="acciones-proyecto">
                        <button className="boton-gestion">Gestionar Catálogo</button>
                        <button className="boton-ficha">Ver Ficha</button>
                        <button className="boton-app">Ver App</button>
                        <button className="boton-mkt">Ver MKT</button>
                        <button className="boton-eliminar">Eliminar</button>
                    </div>
                </div>
            </li>

            <li className="item-proyecto">
                <div className="contenido-proyecto">
                    <img src="https://via.placeholder.com/60x40/DB4437/FFFFFF?Text=P2" alt="Proyecto 2" className="imagen-proyecto" />
                    <div className="titulo-contenedor-proyecto">
                        <h2 className="nombre-proyecto">Proyecto Beta</h2>
                    </div>
                    <div className="acciones-proyecto">
                        <button className="boton-gestion">Gestionar Catálogo</button>
                        <button className="boton-ficha">Ver Ficha</button>
                        <button className="boton-app">Ver App</button>
                        <button className="boton-mkt">Ver MKT</button>
                        <button className="boton-eliminar">Eliminar</button>
                    </div>
                </div>
            </li>

            <li className="item-proyecto">
                <div className="contenido-proyecto">
                    <img src="https://via.placeholder.com/60x40/F4B400/FFFFFF?Text=P3" alt="Proyecto 3" className="imagen-proyecto" />
                    <div className="titulo-contenedor-proyecto">
                        <h2 className="nombre-proyecto">Proyecto Gamma</h2>
                    </div>
                    <div className="acciones-proyecto">
                        <button className="boton-gestion">Gestionar Catálogo</button>
                        <button className="boton-ficha">Ver Ficha</button>
                        <button className="boton-app">Ver App</button>
                        <button className="boton-mkt">Ver MKT</button>
                        <button className="boton-eliminar">Eliminar</button>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    );
 }
