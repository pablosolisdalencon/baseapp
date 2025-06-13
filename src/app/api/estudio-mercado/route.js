import { NextResponse } from "next/server";
import { connectDB } from '../../../utils/mongoose';
import EstudioMercado from '@/models/EstudioMercado';
import { URL } from 'url';

export async function GET(request){
    try{

        connectDB();

        const searchParams = new URL(request.url).searchParams;
        const idProyecto = await searchParams.get('p');

        if (idProyecto){
            const data = await EstudioMercado.find({ id_proyecto: idProyecto });
            console.log("=============API ESTUDIO MERCADO SAY:   DATA    ==================")
            console.log(idProyecto)
            console.log(data)

            return NextResponse.json({data});
        }
      
    }catch(error){
        console.error("Error al buscar EstudioMercado por id_proyecto:", error);
        return NextResponse.json({ message: "Error al buscar EstudioMercado por id_proyecto" }, { status: 500 });
    }
    
   
}


export async function POST(request){
    connectDB();
    const data = await request.json();
    if(data){
      console.log("=============   POST.api.EstudioMercado DATA:    ==================")
      console.log(data)

      //const Jdata = JSON.parse(data)
      const Jdata = data
        const newEstudioMercado = new EstudioMercado(Jdata)
        const savedEstudioMercado = await newEstudioMercado.save()    
        return NextResponse.json({"message": `holas EstudioMercado POST: ${savedEstudioMercado}`});
    }   else    {
        console.log("=============   DATA NULL !!   ==================")
        console.log(data)
        return NextResponse.json({ message: "Error al rescatar la data de EstudioMercado en el Request" }, { status: 500 });
    }

    
}
         /* const PureEstudio = JsonPure(data)
        const Estudio = JSON.stringify(PureEstudio);
        console.log(data)
      */  