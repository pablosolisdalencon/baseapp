import { NextResponse } from "next/server";
import { connectDB } from '@/utils/mongoose';
import Proyecto from '@/models/Proyecto';
import ItemCataogo from '@/models/ItemCatalogo';

export async function GET(request, {params}){
    try{
        connectDB()
        const { id } = await params;
        const proyectoFound = await Proyecto.findById(id);

        if (!proyectoFound)
            return NextResponse.json({
                message: "Proyecto no encontrado",
            },{
                status:404
            });
        console.error(proyectoFound);
        return NextResponse.json(proyectoFound);

    }catch (error){
        return NextResponse.json(error.message,{
            status:400
        });
    }
}

export async function DELETE(request, {params}){
    try{
        const { id } = await params;
        const proyectoEliminado = await Proyecto.findByIdAndDelete(id);
        const itemsEliminados = await ItemCataogo.find({ id_proyecto: id });
        const catalogoEliminado = JSON.parse(JSON.stringify(itemsEliminados));
        // recorrer catalogo para eliminar items
        catalogoEliminado.forEach(async item => {
            const itemEliminado = await Item.findByIdAndDelete(item._id);
            console.log('Elemento eliminado:', item);
        });

        if(!proyectoEliminado)

        return NextResponse.json({
            message: `Proyecto no encontrado para su eliminacion :  ${id} ...`,
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
        const data = await request.json();
        const { id } = await params;
        const proyectoUpdated = await Proyecto.findByIdAndUpdate(id, data,{
            new:true
        })

        return NextResponse.json(proyectoUpdated)

    }catch(error){
        return NextResponse.json(error.message,{
            status: 400,
        })

    }
    
}
