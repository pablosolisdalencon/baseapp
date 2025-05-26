import Willi from "@/components/Willi";
import { Suspense } from "react";
import StepByStepWilli from '@/components/StepByStepWilli'

export default function MktViewer(){

    return (
            <Suspense><StepByStepWilli/></Suspense>
    )
}
    //const idProyecto = "67f99da9f7b90ff068b870b2"
// <Suspense><EstudioMercadoComponent/></Suspense>
/*
    return(
    <div className="mkt-viewer-container">     
        <Suspense><Willi/></Suspense>
        
        <h2 className="mkt-subtitle">Marketing Digital</h2>

        <div className="main-cards-container">
            <div className="elegant-card">
                <div className="card-header">
                    <h3 className="card-title">Presentamos Nuestra Nueva Imagen de Marca</h3>
                </div>
                <img src="https://via.placeholder.com/800x400/E0F7FA/00838F?Text=Nueva+Imagen" alt="Imagen de Marca" className="w-full"/>
                <div className="card-body">
                    <p>Descubre nuestra renovada identidad visual, diseñada para reflejar nuestros valores y visión de futuro. Estamos emocionados de compartir este nuevo capítulo contigo.</p>
                    <p className="mt-2 text-sm text-gray-500">#NuevaMarca #Innovación #Visión</p>
                </div>
            </div>

            <div className="horizontal-card">
                <img src="https://via.placeholder.com/400x300/C8E6C9/1B5E20?Text=Artículo" alt="Imagen del Artículo" className="horizontal-card-image"/>
                <div className="horizontal-card-content">
                    <h3 className="post-title">5 Consejos Clave para Impulsar tu Estrategia de Contenido</h3>
                    <p className="post-description">El marketing de contenidos es fundamental en el panorama digital actual. Aquí te presentamos cinco estrategias probadas para conectar con tu audiencia y lograr tus objetivos de negocio.</p>
                    <p className="mt-2 text-sm text-gray-500">#MarketingDeContenidos #EstrategiaDigital #Consejos</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
                <h3 className="card-title mb-4">Nuestros Productos Destacados</h3>
                <div className="product-grid">


                    <div className="product-post">
                        <div className="product-image-container">
                            <img src="https://via.placeholder.com/300x200/FFCDD2/B71C1C?Text=Prod+A" alt="Producto A" className="product-image"/>
                            <span className="product-price">$19.99</span>
                        </div>
                        <div className="post-content">
                            <h4 className="post-title">Producto A</h4>
                            <p className="post-description">Descripción breve del Producto A, con características destacadas.</p>
                        </div>
                    </div>

                    <div className="product-post">
                        <div className="product-image-container">
                            <img src="https://via.placeholder.com/300x200/BBDEFB/1A237E?Text=Prod+B" alt="Producto B" className="product-image"/>
                            <span className="product-price">$29.50</span>
                        </div>
                        <div className="post-content">
                            <h4 className="post-title">Producto B</h4>
                            <p className="post-description">Descubre el increíble valor y funcionalidades del Producto B.</p>
                        </div>
                    </div>


                    <div className="product-post">
                        <div className="product-image-container">
                            <img src="https://via.placeholder.com/300x200/D1C4E9/4A148C?Text=Prod+C" alt="Producto C" className="product-image"/>
                            <span className="product-price">$49.00</span>
                        </div>
                        <div className="post-content">
                            <h4 className="post-title">Producto C</h4>
                            <p className="post-description">La solución perfecta para tus necesidades, el Producto C te encantará.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

*/