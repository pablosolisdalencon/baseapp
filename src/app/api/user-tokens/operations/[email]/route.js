// src/app/api/user-tokens/operations/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../utils/mongoose';
import TokenOperation from '../../../models/TokenOperation';

const getAuthenticatedUserEmail = (request) => {
    const { searchParams } = new URL(request.url);
    const emailFromQuery = searchParams.get('email');
    return emailFromQuery || 'testuser@example.com'; // Placeholder
};

// POST /api/user-tokens/operations - Guarda un registro de operación
export async function POST(request) {
    await connectDB();
    const { email, price, action } = await request.json();
    const authenticatedEmail = getAuthenticatedUserEmail(request); // Para Next.js POST

    if (email !== authenticatedEmail) {
        return NextResponse.json({ message: 'Unauthorized: User email mismatch.' }, { status: 403 });
    }
    if (!email || typeof price !== 'number' || price <= 0 || !action) {
        return NextResponse.json({ message: 'Missing or invalid data for operation.' }, { status: 400 });
    }

    try {
        const operation = new TokenOperation({
            email,
            action,
            price,
            operationType: 'use',
            status: 'completed'
        });
        await operation.save();
        return NextResponse.json({ operationId: operation._id }, { status: 201 });
    } catch (error) {
        console.error('Error recording token operation:', error);
        return NextResponse.json({ message: 'Server error recording operation.' }, { status: 500 });
    }
}

// GET /api/user-tokens/operations - Retorna el historial de operaciones
export async function GET(request) {
    await connectDB();
    const email = getAuthenticatedUserEmail(request);

    try {
        const operations = await TokenOperation.find({ email }).sort({ timestamp: -1 });
        return NextResponse.json(operations);
    } catch (error) {
        console.error('Error fetching operations history:', error);
        return NextResponse.json({ message: 'Server error fetching operations history.' }, { status: 500 });
    }
}