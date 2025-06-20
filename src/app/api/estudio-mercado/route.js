import { NextResponse } from "next/server";
import { connectDB } from '../../../utils/mongoose';
import EstudioMercado from '@/models/EstudioMercado';
import Price from '@/models/Price'; // Import Price model
import { getServerSession } from 'next-auth/next'; // Import for session
import { authOptions } from '../auth/[...nextauth]/route'; // Import authOptions
import { URL } from 'url';

// Define the action name for price lookup
const actionName = "generar estudio";

export async function GET(request){
    try{

        connectDB();

        const searchParams = new URL(request.url).searchParams;
        const idProyecto = await searchParams.get('p');

        if (idProyecto){
            const data = await EstudioMercado.find({ id_proyecto: idProyecto });
            console.log("=============API ESTUDIO MERCADO SAY:   DATA    ==================")
            console.log(idProyecto)
            console.log(data)

            return NextResponse.json({data});
        }
      
    }catch(error){
        console.error("Error al buscar EstudioMercado por id_proyecto:", error);
        return NextResponse.json({ message: "Error al buscar EstudioMercado por id_proyecto" }, { status: 500 });
    }
    
   
}


export async function POST(request){
    await connectDB(); // Ensure DB connection at the beginning

    // 1. Authenticate user and get user ID
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user).id) { // Adjusted to check session.user.id based on typical setup
      return new Response(JSON.stringify({ message: 'Unauthorized: User not authenticated.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    // const userId = (session.user).id; // userId is implicitly handled by the session cookie for /api/user/decrement-tokens

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
    // Construct absolute URL for fetch
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = request.headers.get('host'); // Get host from the incoming request
    const absoluteUrl = `${protocol}://${host}/api/user/decrement-tokens`;

    const tokenDecrementResponse = await fetch(absoluteUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward necessary cookies from the original request for session authentication
        // This is crucial if the target API route relies on session cookies
        'Cookie': request.headers.get('Cookie') || '',
      },
      body: JSON.stringify({ tokensToDecrement }), // decrement-tokens expects tokensToDecrement in body
    });

    if (!tokenDecrementResponse.ok) {
      const errorData = await tokenDecrementResponse.json().catch(() => ({ message: 'Failed to parse error response from token decrement service.' }));
      return new Response(JSON.stringify({ message: errorData.message || 'Failed to decrement tokens.' }), { status: tokenDecrementResponse.status, headers: { 'Content-Type': 'application/json' } });
    }

    // 4. If token deduction is successful, proceed with original logic
    const data = await request.json();
    if(data){
      console.log("=============   POST.api.EstudioMercado DATA (after token deduction):    ==================")
      console.log(data)

      const Jdata = data; // Assuming data is already the correct JSON object
      const newEstudioMercado = new EstudioMercado(Jdata);
      const savedEstudioMercado = await newEstudioMercado.save();
      // Return the created EstudioMercado along with a success message
      return NextResponse.json({ message: "Estudio de mercado generado exitosamente.", data: savedEstudioMercado }, { status: 201 });
    } else {
        console.log("=============   DATA NULL after token deduction !!   ==================")
        // This case might indicate an issue with request.json() being consumed or empty body when not expected
        return new Response(JSON.stringify({ message: "Error: Request body is empty or could not be parsed after token deduction." }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
}
         /* const PureEstudio = JsonPure(data)
        const Estudio = JSON.stringify(PureEstudio);
        console.log(data)
      */