// src/app/api/user-tokens/add/route.js
import { NextResponse } from 'next/server';
import { connectDB, getMongooseInstance } from '../../../utils/mongoose';
import UserToken from '../../../models/UserToken';

const getAuthenticatedUserEmail = (request) => {
    // Para POST/PUT, obtén el email del body o de cabeceras de autenticación.
    // O puedes usar el email del body si es de confianza.
    return 'testuser@example.com'; // Placeholder
};

export async function PUT(request) {
    await connectDB();
    const mongoose = getMongooseInstance();

    const { email, price } = await request.json();
    const authenticatedEmail = getAuthenticatedUserEmail(request);

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

        if (!userTokens) {
            await session.abortTransaction();
            session.endSession();
            return NextResponse.json({ message: 'User not found.' }, { status: 404 });
        }

        userTokens.tokens += price;
        userTokens.lastUpdated = Date.now();
        await userTokens.save({ session });

        await session.commitTransaction();
        session.endSession();
        return NextResponse.json({ success: true, newBalance: userTokens.tokens });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error adding tokens:', error);
        return NextResponse.json({ message: 'Server error adding tokens.' }, { status: 500 });
    }
}