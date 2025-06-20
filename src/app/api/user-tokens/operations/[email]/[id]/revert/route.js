// src/app/api/user-tokens/operations/[id]/revert/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../utils/mongoose';
import TokenOperation from '../../../../models/TokenOperation';

const getAuthenticatedUserEmail = (request) => {
    const { searchParams } = new URL(request.url);
    const emailFromQuery = searchParams.get('email');
    return emailFromQuery || 'testuser@example.com'; // Placeholder
};

export async function PUT(request, { params }) {
    await connectDB();
    const { id } = params; // Captura el ID de la URL
    const authenticatedEmail = getAuthenticatedUserEmail(request);

    try {
        const operation = await TokenOperation.findById(id);

        if (!operation) {
            return NextResponse.json({ message: 'Operation not found.' }, { status: 404 });
        }
        if (operation.email !== authenticatedEmail) {
            return NextResponse.json({ message: 'Unauthorized: Operation does not belong to user.' }, { status: 403 });
        }
        if (operation.status === 'reverted') {
            return NextResponse.json({ message: 'Operation already reverted.' }, { status: 400 });
        }

        operation.status = 'reverted';
        operation.operationType = 'revert'; // Actualiza el tipo de operación
        await operation.save();

        return NextResponse.json({ success: true, revertedPrice: operation.price });
    } catch (error) {
        console.error('Error reverting token operation:', error);
        return NextResponse.json({ message: 'Server error reverting operation.' }, { status: 500 });
    }
}