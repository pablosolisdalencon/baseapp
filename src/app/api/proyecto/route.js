import { NextResponse } from "next/server";
import { connectDB } from '../../../utils/mongoose';
import Proyecto from '@/models/Proyecto';
import { URL } from 'url';

export async function GET(request){
    try{

        connectDB();

        const searchParams = new URL(request.url).searchParams;
        const theuser = await searchParams.get('user');
        const user = decodeURIComponent(theuser);
        console.error(user);

        if (user){
            const data = await Proyecto.find({ user: user });
            return NextResponse.json({data});
        }
        console.error(data);

        
        
    }catch(error){
        console.error("Error al buscar proyectos por user:", error);
        return NextResponse.json({ message: "Error al buscar proyectos por user" }, { status: 500 });
    }
    
   
}


export async function POST(request){

    connectDB();
    
    const data = await request.json();
    const newProyecto = new Proyecto(data)
    const savedProyecto = await newProyecto.save() 
    console.log(savedProyecto);
    
   return NextResponse.json({"message": "holas proyecto POST"});
}