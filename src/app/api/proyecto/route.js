import { NextResponse } from "next/server";
import { connectDB } from '../../../utils/mongoose';
import Proyecto from '@/models/Proyecto';

export async function GET(){
    connectDB();
    const data = await Proyecto.find();
    return NextResponse.json({data});
    
   
}


export async function POST(request){

    connectDB();
    
    const data = await request.json();
    const newProyecto = new Proyecto(data)
    const savedProyecto = await newProyecto.save() 
    console.log(savedProyecto);
    
   return NextResponse.json({"message": "holas proyecto POST"});
}