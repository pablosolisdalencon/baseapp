// src/app/api/user-tokens/route.js
import { NextResponse } from 'next/server';
import { connectDB, getMongooseInstance } from '../../utils/mongoose'; // Importa la conexión y la instancia de mongoose
import UserToken from '../../models/UserToken';
import TokenOperation from '../../models/TokenOperation';

// Middleware de autenticación de ejemplo (simulado para Next.js API Routes)
// En un sistema real, obtendrías el email del usuario de un token JWT o sesión.
const getAuthenticatedUserEmail = (request) => {
    const { searchParams } = new URL(request.url);
    const emailFromQuery = searchParams.get('email');
    // En un POST/PUT, podrías obtenerlo del body o de cabeceras de autenticación.
    // Para simplificar, asumimos que viene en el query o lo hardcodeamos.
    return emailFromQuery || 'testuser@example.com';
};

// GET /api/user-tokens - Retorna los tokens del usuario
export async function GET(request) {
    await connectDB();
    const email = getAuthenticatedUserEmail(request);

    try {
        let userTokens = await UserToken.findOne({ email });
        if (!userTokens) {
            userTokens = new UserToken({ email });
            await userTokens.save();
        }
        return NextResponse.json({ tokens: userTokens.tokens });
    } catch (error) {
        console.error('Error fetching user tokens:', error);
        return NextResponse.json({ message: 'Server error fetching user tokens.' }, { status: 500 });
    }
}

// PUT /api/user-tokens - Descuenta tokens del usuario (método "use")
export async function PUT(request) {
    await connectDB();
    const mongoose = getMongooseInstance(); // Obtener la instancia de mongoose para transacciones

    const { email, price } = await request.json();
    const authenticatedEmail = getAuthenticatedUserEmail(request); // Asegurar que el email coincida con el usuario autenticado

    if (email !== authenticatedEmail) {
        return NextResponse.json({ message: 'Unauthorized: User email mismatch.' }, { status: 403 });
    }
    if (typeof price !== 'number' || price <= 0) {
        return NextResponse.json({ message: 'Invalid price provided.' }, { status: 400 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const userTokens = await UserToken.findOne({ email }).session(session);

        if (!userTokens || userTokens.tokens < price) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'Insufficient tokens.' }, { status: 400 });
        }

        userTokens.tokens -= price;
        userTokens.lastUpdated = Date.now();
        await userTokens.save({ session });

        await session.commitTransaction();
        session.endSession();
        return NextResponse.json({ success: true, newBalance: userTokens.tokens });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error deducting tokens:', error);
        return NextResponse.json({ message: 'Server error deducting tokens.' }, { status: 500 });
    }
}