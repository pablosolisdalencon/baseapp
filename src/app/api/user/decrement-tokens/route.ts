import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; // Adjusted path
import { connectToDatabase } from '@/utils/mongodb'; // Adjusted path
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ message: 'Unauthorized: User not authenticated.' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const { client, db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find the user and ensure they have tokens to decrement
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    if (user.tokens === undefined || user.tokens <= 0) {
      // This check is more of a safeguard, primary check should be client-side before calling
      return NextResponse.json({ message: 'No tokens to decrement or tokens already at zero.' }, { status: 400 });
    }

    // Decrement tokens
    const updateResult = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId), tokens: { $gt: 0 } }, // Ensure tokens are greater than 0 before decrementing
      { $inc: { tokens: -1 } },
      { returnDocument: 'after' } // Return the updated document
    );

    if (!updateResult.value) {
      // This could happen if tokens were exactly 0 and another request already decremented them,
      // or if the user was not found with tokens > 0.
      return NextResponse.json({ message: 'Failed to decrement tokens or user has no tokens left.' }, { status: 409 }); // Conflict or precondition failed
    }

    return NextResponse.json({
      message: 'Tokens decremented successfully.',
      tokens: updateResult.value.tokens
    }, { status: 200 });

  } catch (error) {
    console.error('Error decrementing tokens:', error);
    let errorMessage = 'Internal Server Error';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ message: 'Internal Server Error', error: errorMessage }, { status: 500 });
  }
}
