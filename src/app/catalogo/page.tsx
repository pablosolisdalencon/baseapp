export default function Catalogo(){
    return(

    <div className="catalog-manager-container">
        <h1 className="project-title">[Nombre del Proyecto]</h1>
        <h2 className="catalog-subtitle">Catálogo del Proyecto</h2>

        <ul className="catalog-list">
            <li className="catalog-item">
                <div className="catalog-item-content">
                    <img src="https://via.placeholder.com/80x60/ABCDEF/FFFFFF?Text=Prod1" alt="Producto 1" className="product-image"/>
                    <div className="product-info">
                        <h3 className="product-name">Nombre del Producto 1</h3>
                        <span className="product-type-label">Prod</span>
                    </div>
                    <div className="catalog-actions">
                        <button className="button-edit">Editar</button>
                        <button className="button-delete">Eliminar</button>
                    </div>
                </div>
            </li>

            <li className="catalog-item">
                <div className="catalog-item-content">
                    <img src="https://via.placeholder.com/80x60/FEDCBA/000000?Text=Serv2" alt="Servicio 2" className="product-image"/>
                    <div className="product-info">
                        <h3 className="product-name">Nombre del Servicio 2</h3>
                        <span className="product-type-label">Serv</span>
                    </div>
                    <div className="catalog-actions">
                        <button className="button-edit">Editar</button>
                        <button className="button-delete">Eliminar</button>
                    </div>
                </div>
            </li>

            <li className="catalog-item">
                <div className="catalog-item-content">
                    <img src="https://via.placeholder.com/80x60/AAAAAA/FFFFFF?Text=Prod3" alt="Producto 3" className="product-image"/>
                    <div className="product-info">
                        <h3 className="product-name">Nombre del Producto 3</h3>
                        <span className="product-type-label">Prod</span>
                    </div>
                    <div className="catalog-actions">
                        <button className="button-edit">Editar</button>
                        <button className="button-delete">Eliminar</button>
                    </div>
                </div>
            </li>
            {/* Puedes agregar más elementos de catálogo aquí */}
        </ul>

        <div className="catalog-controls">
            <button className="button-add-item">AddItem</button>
            <button className="button-finish">Terminar</button>
        </div>
    </div>
    )
}