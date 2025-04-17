import { NextResponse } from "next/server";
import { connectDB } from '../../../utils/mongoose';
import ItemCatalogo from "@/models/ItemCatalogo";
import { URL } from 'url';

export async function GET(request){
    try{

        connectDB();

        const searchParams = new URL(request.url).searchParams;
        const idProyecto = searchParams.get('p');

        if (idProyecto){
            const data = await ItemCatalogo.find({ id_proyecto: idProyecto });
            return NextResponse.json({data});
        }else{
            const data = await ItemCatalogo.find();
            return NextResponse.json({data});

        }

        
        
    }catch(error){
        console.error("Error al buscar items por id_proyecto:", error);
        return NextResponse.json({ message: "Error al buscar items por id_proyecto" }, { status: 500 });
    }
    
   
}



export async function POST(request){

    connectDB();
    
    const data = await request.json();
    const newItem = new ItemCatalogo(data)
    const savedItem = await newItem.save() 
    console.log(savedItem);
    
   return NextResponse.json({"message": "holas Item Catalogo POST"});
}