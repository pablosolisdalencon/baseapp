import { NextResponse } from "next/server";
import { connectDB } from '../../../utils/mongoose';
import ItemCatalogo from "@/models/ItemCatalogo";
import Proyecto from "@/models/Proyecto";
import { URL } from 'url';



export async function GET(request) {
    
    try {
      connectDB();


/// ESTE SERIA EL BOSQUEJO DEL FLUJO DE EWAVEPACK

// 1.- llama a makerdata ( o recibe el objeto y lo dispone) -> se renderiza ficha proyecto
// 2.- Llama a willi estudio mercado y guarda el resultado -> se renderiza el estudio
// 3 .- llama a willi estrategia -> se renderiza estrategia
// 4.- llama a willi campania -> se renderiza campania
// 5.- llama a campania y la recorre
   // 5.A llama a willi POST text e image y junta el resultado -> renderiza el post generado.

// 6.- renederiza un mensaje de eWavePAck finalizado! y 2 links: mktviewer y contentsmanager (ambos con el id del proyecto)

  
      // Obtener el valor del parámetro 'p' (id del proyecto) de la URL
      const searchParams = new URL(request.url).searchParams;
      const proyectoId = searchParams.get('p');
  
      if (!proyectoId) {
        return NextResponse.json({ message: "Se requiere el parámetro 'p' (ID del proyecto) en la URL." }, { status: 400 });
      }
  
      // Buscar el proyecto por su ID
      const proyecto = await Proyecto.findById(proyectoId);
  
      if (!proyecto) {
        return NextResponse.json({ message: `No se encontró ningún proyecto con el ID: ${proyectoId}` }, { status: 404 });
      }
  
      // Buscar los items del catálogo correspondientes a este proyecto
      const catalogo = await ItemCatalogo.find({ id_proyecto: proyectoId });
  
      // Construir el objeto JSON de respuesta
      const response = {
        proyecto: proyecto,
        catalogo: catalogo,
      };
      
   let responseArray = new Array()
   responseArray.push(response);
   let data = responseArray;

   console.log(`$$$$$$$$$$$$$$$$$$$ MAKER DATA`)
   console.log(data)
      return NextResponse.json({data});
  
    } catch (error) {
      console.error("Error al generar la API 'maker':", error);
      return NextResponse.json({ message: "Error al generar la API 'maker'" }, { status: 500 });
    }
  }