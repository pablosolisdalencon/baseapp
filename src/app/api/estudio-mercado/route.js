import { NextResponse } from "next/server";
import { connectDB } from '../../../utils/mongoose';
import { closeDB } from '../../../utils/mongoose';
import EstudioMercado from '@/models/EstudioMercado';
import { URL } from 'url';

export async function GET(request){
    try{

        connectDB();

        const searchParams = new URL(request.url).searchParams;
        const idProyecto = await searchParams.get('p');

        if (idProyecto){
            const data = await EstudioMercado.find({ id_proyecto: idProyecto });
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
    const newEstudioMercado = new EstudioMercado(data)
    const savedEstudioMercado = await newEstudioMercado.save()    
   return NextResponse.json({"message": `holas EstudioMercado POST: ${savedEstudioMercado}`});
}