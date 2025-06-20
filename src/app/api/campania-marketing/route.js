import { NextResponse } from "next/server";
import { connectDB } from '../../../utils/mongoose';
import CampaniaMarketing from '../../../models/CampaniaMarketing'; // Assuming this path is correct
import Price from '@/models/Price'; // Import Price model
import { getServerSession } from 'next-auth/next'; // Import for session
import { authOptions } from '../auth/[...nextauth]/route'; // Import authOptions
import { URL } from 'url';

// Define the action name for price lookup
const actionName = "generar campania";

export async function GET(request){
    try{

        connectDB();

        const searchParams = new URL(request.url).searchParams;
        const idProyecto = await searchParams.get('p');

        if (idProyecto){
            const data = await CampaniaMarketing.find({ id_proyecto: idProyecto });
            console.log("=============API CampaniaMarketing SAY:   DATA    ==================")
            console.log(typeof data)
            return NextResponse.json({data});
        }
      
    }catch(error){
        console.error("Error al buscar CampaniaMarketing por id_proyecto:", error);
        return NextResponse.json({ message: "Error al buscar CampaniaMarketing por id_proyecto" }, { status: 500 });
    }
    
   
}


export async function POST(request){
    await connectDB(); // Ensure DB connection at the beginning

    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user).id) {
      return new Response(JSON.stringify({ message: 'Unauthorized: User not authenticated.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // 2. Fetch the price for the action
    const priceEntry = await Price.findOne({ actionName });
    if (!priceEntry) {
      return new Response(JSON.stringify({ message: `Price not found for action: ${actionName}` }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    const tokensToDecrement = priceEntry.price;
    if (typeof tokensToDecrement !== 'number' || tokensToDecrement <= 0) {
      return new Response(JSON.stringify({ message: `Invalid price configured for action: ${actionName}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // 3. Call token decrement endpoint
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host');
    const absoluteUrl = `${protocol}://${host}/api/user/decrement-tokens`;

    const tokenDecrementResponse = await fetch(absoluteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('Cookie') || '',
      },
      body: JSON.stringify({ tokensToDecrement }),
    });

    if (!tokenDecrementResponse.ok) {
      const errorData = await tokenDecrementResponse.json().catch(() => ({ message: 'Failed to parse error response from token decrement service.' }));
      return new Response(JSON.stringify({ message: errorData.message || 'Failed to decrement tokens.' }), { status: tokenDecrementResponse.status, headers: { 'Content-Type': 'application/json' } });
    }

    // 4. If token deduction is successful, proceed with original logic
    const data = await request.json();
    if(data){
      console.log("=============   POST.api.CampaniaMarketing DATA (after token deduction):    ==================")
      console.log(data)

      const Jdata = data;
      const newCampaniaMarketing = new CampaniaMarketing(Jdata);
      const savedCampaniaMarketing = await newCampaniaMarketing.save();
      return NextResponse.json({ message: "Campaña de marketing generada exitosamente.", data: savedCampaniaMarketing }, { status: 201 });
    } else {
        console.log("=============   DATA NULL after token deduction !!   ==================")
        return new Response(JSON.stringify({ message: "Error: Request body is empty or could not be parsed after token deduction." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
}

