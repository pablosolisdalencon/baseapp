import Products from "@/components/Products";
export default function Home() {
  const proyecto = {
    nombre: "Kick Starter Media Kit",  
    descripcion: "¿Sueñas con lanzar tu app y hacerla crecer? El Kick Starter Media Kit es tu solución integral. ✨  Obtén un potente generador de apps intuitivo y una colección curada de recursos de marketing esenciales, todo en un solo lugar. Ideal para emprendedores que buscan una manera fácil y efectiva de dar sus primeros pasos en el mundo digital. ¡Tu viaje emprendedor nunca ha sido tan accesible!" ,
    mision: "Nuestra Misión: Empoderar a la próxima generación de emprendedores, eliminando las barreras económicas para convertir sus sueños en realidad. 💡  Creemos en un mundo donde la innovación no se vea limitada por el presupuesto. Estamos comprometidos a ofrecer soluciones accesibles que permitan a cada emprendedor alcanzar su máximo potencial. Estamos aquí para democratizar el emprendimiento, ofreciendo las herramientas necesarias al costo más accesible. 🛠️  Nuestra misión es allanar el camino para que las ideas brillantes florezcan, sin que el factor económico sea un obstáculo. Queremos ver cómo tu pasión transforma el mundo.",
    vision: "Nuestra Visión: Derribar la barrera tecnológica en el emprendimiento a través de la automatización inteligente, creando un entorno donde el costo ya no sea un impedimento para la innovación y el crecimiento. 💥  Estamos construyendo un futuro donde la tecnología empodera a cada emprendedor, permitiendo que sus ideas transformen el mundo sin las limitaciones económicas del pasado.",
    logo: "logo.png"    
   
  }
   return(

    <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
             <img src={proyecto.logo} alt={proyecto.nombre} className="w-full h-48 object-cover"/>
               
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-gray-50 rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-indigo-600 mb-4">{proyecto.nombre}</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {proyecto.descripcion}
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-green-600 mb-4">Nuestra Misión</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {proyecto.mision}
                    </p>
                </div>

                <div className="bg-gray-50 rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-yellow-600 mb-4">Nuestra Visión</h3>
                    <p className="text-gray-700 leading-relaxed">
                    {proyecto.vision}
                    </p>
                </div>
            </div>
        </div>

        <div className="viewer">
           <Products/>
        </div>

    </section>




       
       

   );
}
