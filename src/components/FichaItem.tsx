export default function FichaItem(){
    return(

    <div className="ficha-item-container">
        <h1 className="ficha-title">Ficha Item de Catálogo</h1>
        <h2 className="project-subtitle">Proyecto [Nombre del Proyecto]</h2>

        <form className="ficha-form">
            <div className="form-group">
                <label htmlFor="nombre" className="form-label">Nombre del Item</label>
                <input type="text" id="nombre" className="form-input" placeholder="Ingrese el nombre del producto o servicio"/>
            </div>

            <div className="form-group">
                <label htmlFor="descripcion" className="form-label">Descripción</label>
                <textarea id="descripcion" className="form-textarea" placeholder="Ingrese una descripción detallada"></textarea>
            </div>

            <div className="form-group">
                <label htmlFor="precio" className="form-label">Precio</label>
                <input type="number" id="precio" className="form-input" placeholder="Ingrese el precio" step="0.01"/>
            </div>

            <div className="form-group">
                <label htmlFor="foto" className="form-label">Foto</label>
                <input type="file" id="foto" className="form-input"/>
            </div>

            <div className="form-group">
                <label className="form-label">Tipo de Item</label>
                <div className="radio-group">
                    <div className="radio-label">
                        <input type="radio" className="radio-input" name="tipo" value="producto" id="producto"/>
                        <label htmlFor="producto" className="ml-2">Producto</label>
                    </div>
                    <div className="radio-label">
                        <input type="radio" className="radio-input" name="tipo" value="servicio" id="servicio"/>
                        <label htmlFor="servicio" className="ml-2">Servicio</label>
                    </div>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="button-agregar-item">Guardar</button>
            </div>
        </form>
    </div>
    )
}