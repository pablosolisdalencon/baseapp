import { NextResponse } from "next/server";
import { connectDB } from '@/utils/mongoose';
import Proyecto from '@/models/Proyecto';
import Netlify from "next-auth/providers/netlify";

export async function GET(request, {params}){
    try{
        connectDB()
        const proyectoFound = await Proyecto.findById(params.id);

        if (!proyectoFound)
            return NextResponse.json({
                message: "Proyecto no encontrado",
            },{
                status:404
            });

        return NextResponse.json(proyectoFound);

    }catch (error){
        return NextResponse.json(error.message,{
            status:400
        });
    }
}

export async function DELETE(request, {params}){
    try{
        const proyectoEliminado = await Proyecto.findByIdAndDelete(params.id)
        if(!proyectoEliminado)

        return NextResponse.json({
            message: `Proyecto no encontrado para su eliminacion :  ${params.id} ...`,
        },{
            status: 404
        })

        return NextResponse.json(proyectoEliminado)

    }catch(error){
        return NextResponse.json(error.message,{
            status: 400
        })
    }
    
}

export async function PUT(request,{params}){
    try{
        const data = await request.json()
        const proyectoUpdated = await Proyecto.findByIdAndUpdate(params.id, data,{
            new:true
        })

        return NextResponse.json(proyectoUpdated)

    }catch(error){
        return NextResponse.json(error.message,{
            status: 400,
        })

    }
    
}
