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

    const body = await request.json();
    const { tokensToDecrement } = body;

    if (typeof tokensToDecrement !== 'number' || tokensToDecrement <= 0) {
      return NextResponse.json({ message: 'Invalid tokensToDecrement value. Must be a positive number.' }, { status: 400 });
    }

    const { client, db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    // Find the user to check current token count before attempting atomic update
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    if (user.tokens === undefined || user.tokens < tokensToDecrement) {
      return NextResponse.json({ message: 'Insufficient tokens.' }, { status: 402 }); // Payment Required
    }

    // Atomically decrement tokens if sufficient
    const updateResult = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId), tokens: { $gte: tokensToDecrement } },
      { $inc: { tokens: -tokensToDecrement } },
      { returnDocument: 'after' } // Return the updated document
    );

    if (!updateResult.value) {
      // This could happen if tokens were just below tokensToDecrement due to a concurrent request,
      // or if the user was not found (though checked above, this is a safeguard for the atomic operation).
      // Re-check current tokens to give a more specific error.
      const currentUserState = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (currentUserState && currentUserState.tokens < tokensToDecrement) {
        return NextResponse.json({ message: 'Insufficient tokens due to concurrent update.' }, { status: 402 });
      }
      return NextResponse.json({ message: 'Failed to decrement tokens. User may not have enough tokens or user not found.' }, { status: 409 }); // Conflict or precondition failed
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
