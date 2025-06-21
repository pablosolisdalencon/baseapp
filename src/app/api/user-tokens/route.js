// src/app/api/user-tokens/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../utils/mongoose';
import UserToken from '../../../models/UserTokens';
import { URL } from 'url';

//import TokenOperation from '../../models/TokenOperation';


// Middleware de autenticación de ejemplo (simulado para Next.js API Routes)
// En un sistema real, obtendrías el email del usuario de un token JWT o sesión.
const getAuthenticatedUserEmail = (data) => {
   
    console.log("getAuthenticatedUserEmail")
    const emailFromQuery = data.email
    console.log(emailFromQuery)
    // En un POST/PUT, podrías obtenerlo del body o de cabeceras de autenticación.
    // Para simplificar, asumimos que viene en el query o lo hardcodeamos.
    return emailFromQuery || 'testuser@example.com';
};

// GET /api/user-tokens - Retorna los tokens del usuario
export async function GET(request) {
    const searchParams = new URL(request.url).searchParams;
    const email = searchParams.get('e');

    console.log("user TOKENS GET API say email:")
    await connectDB();
    console.log(email)

    try {
        
        let userTokens = await UserToken.findOne({ email:email });
        console.log("user TOKENS GET API say tokens:")
        console.log(userTokens.tokens)
        return NextResponse.json({ tokens: userTokens.tokens });
    } catch (error) {
        console.error('Error fetching user tokens:', error);
        return NextResponse.json({ message: 'Server error fetching user tokens.' }, { status: 500 });
    }
}

// PUT /api/user-tokens - Descuenta tokens del usuario (método "use")
export async function PUT(request){
    console.log("user TOKENS PUT API say email:")

    try{
        const data = await request.json()
        const itemUpdated = await UserToken.findOneAndUpdate({email:data.email}, data,{
            new:true
        })

        return NextResponse.json(itemUpdated)

    }catch(error){
        return NextResponse.json(error.message,{
            status: 400,
        })

    }
    
}


// PRIMERA CARGA DE TOKENS
export async function POST(request){
    connectDB();
    
    const data = await request.json();
    console.log("=============   API UserTokens POST say data:!!   ==================")
        console.log(data)
    if(data){
      //const Jdata = JSON.parse(data)
      const Jdata = data
        const newData = new UserToken(Jdata)
        const savedData = await newData.save()    
        return NextResponse.json({"message": `holas UserTokens POST: ${savedData}`});
    }   else    {
        console.log("=============   DATA NULL !!   ==================")
        console.log(data)
        return NextResponse.json({ message: "Error al rescatar la data de UserTokens en el Request" }, { status: 500 });
    }

    
}