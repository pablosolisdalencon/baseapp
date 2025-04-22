function Setting(){
    return(
      
    <div className="settings-container">
        {/* Tarjeta 1: Edición de Datos de la Cuenta */}
        <div className="settings-card">
            <h2 className="card-title">Editar Cuenta de Usuario</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" id="nombre" className="form-input" placeholder="Tu Nombre"/>
                </div>
                <div className="form-group">
                    <label htmlFor="apellido" className="form-label">Apellido</label>
                    <input type="text" id="apellido" className="form-input" placeholder="Tu Apellido"/>
                </div>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" id="email" className="form-input" placeholder="Tu Email"/>
                </div>
                {/* Puedes agregar más campos como contraseña, etc. */}
                <div className="form-actions">
                    <button type="submit" className="button-save">Guardar</button>
                    <button type="button" className="button-cancel">Cancelar</button>
                </div>
            </form>
        </div>

        {/* Tarjeta 2: Selección de Proyecto */}
        <div className="settings-card">
            <h2 className="card-title">Seleccionar Proyecto Activo</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="proyecto" className="form-label">Proyecto</label>
                    <select id="proyecto" className="form-select">
                        <option value="">Seleccionar un proyecto</option>
                        <option value="proyecto1">Proyecto Alfa</option>
                        <option value="proyecto2">Proyecto Beta</option>
                        <option value="proyecto3">Proyecto Gamma</option>
                        {/* Agrega más opciones de proyectos dinámicamente */}
                    </select>
                </div>
                <div className="form-actions justify-end">
                    <button type="submit" className="button-save">Guardar Proyecto</button>
                </div>
            </form>
        </div>

        {/* Tarjeta 3: Configuración de Redes Sociales */}
        <div className="settings-card">
            <h2 className="card-title">Configuración de Redes Sociales</h2>
            <form>
                <div className="social-link-group">
                    <label htmlFor="instagram" className="social-label">Instagram Link</label>
                    <input type="url" id="instagram" className="social-input" placeholder="Link de Instagram"/>
                </div>
                <div className="social-link-group">
                    <label htmlFor="facebook" className="social-label">Facebook Link</label>
                    <input type="url" id="facebook" className="social-input" placeholder="Link de Facebook"/>
                </div>
                <div className="social-link-group">
                    <label htmlFor="google" className="social-label">Google Link</label>
                    <input type="url" id="google" className="social-input" placeholder="Link de Google"/>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Otras Redes Sociales</h3>
                <div className="other-social-group">
                    <label htmlFor="otra-red-social" className="other-social-label-name">Red Social</label>
                    <input type="text" id="otra-red-social" className="other-social-input-name" placeholder="Nombre de la Red Social"/>
                    <label htmlFor="otro-link" className="other-social-label-link">Link</label>
                    <input type="url" id="otro-link" className="other-social-input-link" placeholder="Link de la Red Social"/>
                </div>
                <div className="form-actions">
                    <button type="submit" className="button-save">Guardar Redes Sociales</button>
                    <button type="button" className="button-cancel">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
    )
}