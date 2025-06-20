// src/app/api/pricing/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../utils/mongoose'; // Importa la conexión
import Pricing from '../../../models/Prices'; // Importa el modelo (Prices.js)

export async function GET(request) {
    await connectDB(); // Establece la conexión a la DB

    const { searchParams } = new URL(request.url);
    const actionName = searchParams.get('a');
    // const userEmail = searchParams.get('email'); // Si necesitas autenticación aquí

    if (!actionName) {
        return NextResponse.json({ message: 'actionName query parameter is required.' }, { status: 400 });
    }

    try {
        const pricing = await Pricing.findOne({ actionName });
        if (!pricing) {
            return NextResponse.json({ message: `Pricing not found for action: ${actionName}` }, { status: 404 });
        }
        return NextResponse.json({ price: pricing.price });
    } catch (error) {
        console.error('Error fetching pricing:', error);
        return NextResponse.json({ message: 'Server error fetching pricing.' }, { status: 500 });
    }
}


export async function POST(request){

    connectDB();
    
    const data = await request.json();
    const newItem = new Pricing(data)
    try{
        const savedItem = await newItem.save();
        console.log(savedItem);
        if(savedItem){
            return NextResponse.json({message: " POST OK"});
        }else{
            return NextResponse.json({ message: 'DB Error POSTING pricing.' }, { status: 400 });
        }
    }catch(e){
        return NextResponse.json({ message: `Server error POSTING pricing: ${e}` }, { status: 500 });
    }
    
}