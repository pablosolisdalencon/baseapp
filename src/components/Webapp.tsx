"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
interface DataType {
    proyecto: ItemTypeProyecto;
    catalogo: ItemType[];
    
}
interface ItemTypeProyecto {
    _id: string;
    nombre: string;
    descripcion: string;
    texto: string;
    frase: string;
    logo: string;
    mision: string;
    vision: string;
}

interface ItemType {
    _id: string;
    nombre: string;
    descripcion: string;
    id_proyecto: string;
    foto: string;
    precio: string;
    tipo: string;
}


export default function Webapp() {
     const [data,setData] = useState<DataType | null>(null);
        const [isLoadingP, setIsLoadingP] = useState(true);
        const [errorP, setErrorP] = useState<string | null>(null);
    
    useEffect( () => {
            //traer ficha completa Web App desde api data
            const getFichaProyecto = async () => {
                setIsLoadingP(true);
                setErrorP(null);

                try {
                    const response = await fetch('api/data');
                    if(!response.ok){
                        throw new Error(`<br>HTTP error! in Proyecto status: ${response.status}`);
                    }

                    const jsonData: DataType = await response.json();
                    setData(jsonData);
                
                }catch (e: any){
                    setErrorP('<br>Error al cargar Data:'+e.message);
                    setData(null);
                } finally {
                    setIsLoadingP(false);
                }
            };
            getFichaProyecto();

        },[]);

  const proyecto = {
    nombre: "Kick Starter Media Kit",  
    descripcion: "¿Sueñas con lanzar tu app y hacerla crecer? El Kick Starter Media Kit es tu solución integral. ✨  Obtén un potente generador de apps intuitivo y una colección curada de recursos de marketing esenciales, todo en un solo lugar. Ideal para emprendedores que buscan una manera fácil y efectiva de dar sus primeros pasos en el mundo digital. ¡Tu viaje emprendedor nunca ha sido tan accesible!" ,
    mision: "Nuestra Misión: Empoderar a la próxima generación de emprendedores, eliminando las barreras económicas para convertir sus sueños en realidad. 💡  Creemos en un mundo donde la innovación no se vea limitada por el presupuesto. Estamos comprometidos a ofrecer soluciones accesibles que permitan a cada emprendedor alcanzar su máximo potencial. Estamos aquí para democratizar el emprendimiento, ofreciendo las herramientas necesarias al costo más accesible. 🛠️  Nuestra misión es allanar el camino para que las ideas brillantes florezcan, sin que el factor económico sea un obstáculo. Queremos ver cómo tu pasión transforma el mundo.",
    vision: "Nuestra Visión: Derribar la barrera tecnológica en el emprendimiento a través de la automatización inteligente, creando un entorno donde el costo ya no sea un impedimento para la innovación y el crecimiento. 💥  Estamos construyendo un futuro donde la tecnología empodera a cada emprendedor, permitiendo que sus ideas transformen el mundo sin las limitaciones económicas del pasado.",
    logo: "logo.png"    
   
  }


    if(isLoadingP){
    return <p>Cargando WebApp Data...</p>;
    }
    if(errorP){
        return <p>Error cargando  WebApp Data: {errorP}</p>;
    }

    const AppProyecto=data?.proyecto;
    const AppCatalogo=data?.catalogo;
    const nombreProyecto=AppProyecto?.nombre;
    const textoProyecto=AppProyecto?.texto;
    const fraseProyecto=AppProyecto?.frase;
    const descripcionProyecto=AppProyecto?.descripcion;
    const misionProyecto=AppProyecto?.mision;
    const visionProyecto=AppProyecto?.vision;
    const logoProyecto=AppProyecto?.logo;

   return(
<div className="landing-page">
    {/* Sección de Bienvenida */}
    <section className="welcome-section">
        <div className="welcome-overlay"></div>
        <div className="welcome-content">
            <h1 className="welcome-title">{textoProyecto}</h1>
            <p className="welcome-subtitle">{fraseProyecto}</p>
            <div className="welcome-form">
                <a href="https://wa.me/56920905973?text=Quiero%20hablar%20del%20eWave%20Pack"><button className="welcome-button">¡Hablemos!</button></a>
            </div>
        </div>
    </section>

    {/* Sección del Logo */}
    <section className="logo-section">
        <div className="logo-container">
            <img src={logoProyecto} alt={nombreProyecto} className="company-logo" />
        </div>
    </section>

    {/* Sección Descripción de la Empresa */}
    <section id="nosotros" className="about-us-section">
        <div className="about-us-container">
            <h2 className="about-us-title">Sobre Nosotros</h2>
            <div className="about-us-grid">
                <div className="about-us-item">
                    <h3 className="about-us-subtitle">Lo que nos define</h3>
                    <p className="about-us-text">{descripcionProyecto}</p>
                </div>
                <div className="about-us-item">
                    <h3 className="about-us-subtitle">Misión</h3>
                    <p className="about-us-text">{misionProyecto}</p>
                </div>
                <div className="about-us-item">
                    <h3 className="about-us-subtitle">Visión</h3>
                    <p className="about-us-text">{visionProyecto}</p>
                </div>
            </div>
        </div>
    </section>
    {/* Sección Catálogo de Productos/Servicios */}
    <section id="catalogo" className="catalog-section">
        <div className="catalog-container">
            <h2 className="catalog-title">Nuestro Catálogo</h2>
            <div className="catalog-grid">
 {/* AQUI DEBIERAMOS RECORRER EL CATALOGO E IMPRIMIR UNA TARJETA SIMPLE con el nombre del item */}
    {AppCatalogo && AppCatalogo.length > 0 ? (
              AppCatalogo.map((item) => (
                <div className="product-card" key={item._id}>
                    <img src={item.foto} alt={item.nombre} className="product-image" />
                    <div className="product-info">
                        <h3 className="product-name">{item.nombre}</h3>
                        <p className="product-description">{item.descripcion}</p>
                        
                        <a href="#" className="product-button">{item.precio}</a>
                    </div>
                </div>
                   
              ))
            ) : (
              <p>No hay items en el catálogo.</p>
            )}
            </div>
        </div>
    </section>
  
   

    {/* Sección Footer con Mini Form de Contacto */}
    <footer id="contacto" className="contact-footer">
        <div className="contact-container">
            <h2 className="contact-title">¿Listo para Empezar?</h2>
            <p className="contact-subtitle">Déjanos un mensaje y nos pondremos en contacto contigo.</p>
            <div className="contact-form">
                
                <a href="https://wa.me/56920905973?text=Quiero%20hablar%20del%20eWave%20Pack"><button className="contact-button">Hablemos!</button></a>
            </div>
            <p className="copyright-text">© 2025 {nombreProyecto}. Todos los derechos reservados.</p>
        </div>
    </footer>
</div>



       
       

   );
}
///<!--span className="product-price">{item.precio}</span-->
//<input type="text" className="contact-input" id="contacto_cliente" placeholder="tu correo" />
