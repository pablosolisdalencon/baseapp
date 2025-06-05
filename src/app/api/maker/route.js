import { NextResponse } from "next/server";
import { connectDB } from '../../../utils/mongoose';
import ItemCatalogo from "@/models/ItemCatalogo";
import Proyecto from "@/models/Proyecto";
import { URL } from 'url';



export async function GET(request) {
    try {
      connectDB();
  
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
   console.log(`$$$$$$$$$$$$$$$$$$$ MAKER RESPONSE`)
   console.log(typeof responseArray)
   let data = responseArray;
      return NextResponse.json({data});
  
    } catch (error) {
      console.error("Error al generar la API 'maker':", error);
      return NextResponse.json({ message: "Error al generar la API 'maker'" }, { status: 500 });
    }
  }