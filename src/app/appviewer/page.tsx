import { connectDB } from "@/utils/mongoose";
import Proyecto from "@/models/Proyecto";

async function loadProyectos(){
  connectDB()
  const proyectos = await Proyecto.find()
  return proyectos
}

async function Appviewer(){

    const proyectos = await loadProyectos()

    return(
<div className="landing-page">
    {/* Sección de Bienvenida */}
    <section className="welcome-section">
        <div className="welcome-overlay"></div>
        <div className="welcome-content">
            <h1 className="welcome-title">El Texto Atractivo que Captará la Atención</h1>
            <p className="welcome-subtitle">Una breve descripción impactante de lo que ofreces.</p>
            <div className="welcome-form">
                <input type="email" className="welcome-input" placeholder="Tu Correo Electrónico" />
                <button className="welcome-button">¡Suscríbete!</button>
            </div>
        </div>
    </section>

    {/* Sección del Logo */}
    <section className="logo-section">
        <div className="logo-container">
            <img src="https://via.placeholder.com/200x80/EEEEEE/AAAAAA?Text=Logo" alt="Logo de la Empresa" className="company-logo" />
        </div>
    </section>

    {/* Sección Descripción de la Empresa */}
    <section id="nosotros" className="about-us-section">
        <div className="about-us-container">
            <h2 className="about-us-title">Sobre Nosotros</h2>
            <div className="about-us-grid">
                <div className="about-us-item">
                    <h3 className="about-us-subtitle">Nuestra Historia</h3>
                    <p className="about-us-text">Breve historia de la empresa, sus inicios y valores fundamentales.</p>
                </div>
                <div className="about-us-item">
                    <h3 className="about-us-subtitle">Misión</h3>
                    <p className="about-us-text">Declaración concisa de la misión de la empresa y su propósito principal.</p>
                </div>
                <div className="about-us-item">
                    <h3 className="about-us-subtitle">Visión</h3>
                    <p className="about-us-text">Aspiraciones a largo plazo y la visión del futuro de la empresa.</p>
                </div>
            </div>
        </div>
    </section>

    {/* Sección Catálogo de Productos/Servicios */}
    <section id="catalogo" className="catalog-section">
        <div className="catalog-container">
            <h2 className="catalog-title">Nuestro Catálogo</h2>
            <div className="catalog-grid">
                {/* Tarjeta de Producto/Servicio 1 */}
                <div className="product-card">
                    <img src="https://via.placeholder.com/300x200/90CAF9/FFFFFF?Text=Producto+1" alt="Producto 1" className="product-image" />
                    <div className="product-info">
                        <h3 className="product-name">Nombre del Producto/Servicio 1</h3>
                        <p className="product-description">Descripción breve y atractiva del producto/servicio.</p>
                        <span className="product-price">$XX.XX</span>
                        <a href="#" className="product-button">Ver Detalles</a>
                    </div>
                </div>
                {/* Tarjeta de Producto/Servicio 2 */}
                <div className="product-card">
                    <img src="https://via.placeholder.com/300x200/A5D6A7/FFFFFF?Text=Servicio+2" alt="Servicio 2" className="product-image" />
                    <div className="product-info">
                        <h3 className="product-name">Nombre del Producto/Servicio 2</h3>
                        <p className="product-description">Descripción breve y atractiva del producto/servicio.</p>
                        <span className="product-price">Desde $YY.YY</span>
                        <a href="#" className="product-button">Leer Más</a>
                    </div>
                </div>
                {/* Agrega más tarjetas de productos/servicios aquí */}
            </div>
        </div>
    </section>

    {/* Sección Footer con Mini Form de Contacto */}
    <footer id="contacto" className="contact-footer">
        <div className="contact-container">
            <h2 className="contact-title">¿Listo para Empezar?</h2>
            <p className="contact-subtitle">Déjanos un mensaje y nos pondremos en contacto contigo.</p>
            <div className="contact-form">
                <input type="text" className="contact-input" placeholder="Tu Nombre" />
                <button className="contact-button">Enviar</button>
            </div>
            <p className="copyright-text">© 2025 Nombre de la Empresa. Todos los derechos reservados.</p>
        </div>
    </footer>
</div>

    );
}
export default Appviewer