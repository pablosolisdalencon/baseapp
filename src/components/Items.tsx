export default function Items() {
    return(
        <li className="catalog-item">
            <div className="catalog-item-content">
                <img src="https://via.placeholder.com/80x60/ABCDEF/FFFFFF?Text=Prod1" alt="Producto 1" className="product-image"/>
                <div className="product-info">
                    <h3 className="product-name">NOMBRE PRODUCTO/SERVICIO</h3>
                    <span className="product-type-label">Prod</span>
                </div>
                <div className="catalog-actions">
                    <button className="button-edit">Editar</button>
                    <button className="button-delete">Eliminar</button>
                </div>
            </div>
        </li>
    )

}