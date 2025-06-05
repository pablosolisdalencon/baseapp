import { NextResponse } from "next/server";
import { connectDB } from '../../../utils/mongoose';
import EstrategiaMarketing from '@/models/EstrategiaMarketing';
import { URL } from 'url';

export async function GET(request){
    try{

        connectDB();

        const searchParams = new URL(request.url).searchParams;
        const idProyecto = await searchParams.get('p');

        if (idProyecto){
            const data = await EstrategiaMarketing.find({ id_proyecto: idProyecto });
            console.log("=============API ESTTAYEGIA MARKETING SAY:   DATA    ==================")
            console.log(typeof data)
            return NextResponse.json({data});
        }
      
    }catch(error){
        console.error("Error al buscar EstrategiaMarketing por id_proyecto:", error);
        return NextResponse.json({ message: "Error al buscar EstrategiaMarketing por id_proyecto" }, { status: 500 });
    }
    
   
}


export async function POST(request){
    console.log("=============   POST.api.estrategia request ==================")
    console.log(request)


    connectDB();
    const data = await request.json();
    if(data){
      console.log("=============   POST.api.estrategia DATA:    ==================")
      console.log(data)

      //const Jdata = JSON.parse(data)
      const Jdata = data
        const newEstrategiaMarketing = new EstrategiaMarketing(Jdata)
        const savedEstrategiaMarketing = await newEstrategiaMarketing.save()    
        return NextResponse.json({"message": `holas EstrategiaMarketing POST: ${savedEstrategiaMarketing}`});
    }   else    {
        console.log("=============   DATA NULL !!   ==================")
        console.log(data)
        return NextResponse.json({ message: "Error al rescatar la data de EstrategiaMarketing en el Request" }, { status: 500 });
    }

    
}

