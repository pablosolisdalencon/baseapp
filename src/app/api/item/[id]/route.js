import { NextResponse } from "next/server";
import { connectDB } from '@/utils/mongoose';
import ItemCatalogo from "@/models/ItemCatalogo";

export async function GET(request, {params}){
    try{
        connectDB()     
        const { id } = await params;
        const itemFound = await ItemCatalogo.findById(id);

        if (!itemFound)
            return NextResponse.json({
                message: "Item no encontrado",
            },{
                status:404
            });

        return NextResponse.json(itemFound);

    }catch (error){
        return NextResponse.json(error.message,{
            status:400
        });
    }
}

export async function DELETE(request, {params}){
    const { id } = await params;
    try{
        const itemEliminado = await ItemCatalogo.findByIdAndDelete(id)
        if(!itemEliminado)

        return NextResponse.json({
            message: `Item no encontrado para su eliminacion :  ${id} ...`,
        },{
            status: 404
        })

        return NextResponse.json(itemEliminado)

    }catch(error){
        return NextResponse.json(error.message,{
            status: 400
        })
    }
    
}

export async function PUT(request,{params}){
    const { id } = await params;
    try{
        const data = await request.json()
        const itemUpdated = await ItemCatalogo.findByIdAndUpdate(id, data,{
            new:true
        })

        return NextResponse.json(itemUpdated)

    }catch(error){
        return NextResponse.json(error.message,{
            status: 400,
        })

    }
    
}
