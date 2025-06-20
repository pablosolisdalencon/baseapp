import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/mongoose'; // Adjusted path assuming src is aliased as @
import Price from '@/models/Price'; // Adjusted path assuming src is aliased as @

export async function GET() {
  try {
    await connectDB();
    const prices = await Price.find({});
    return NextResponse.json(prices);
  } catch (error) {
    console.error('Error fetching prices:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { actionName, price } = body;

    if (!actionName || typeof price !== 'number') {
      return NextResponse.json({ message: 'actionName and new price are required, and price must be a number' }, { status: 400 });
    }

    const updatedPrice = await Price.findOneAndUpdate(
      { actionName },
      { price },
      { new: true } // Returns the updated document
    );

    if (!updatedPrice) {
      return NextResponse.json({ message: 'Price with this actionName not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPrice);
  } catch (error) {
    console.error('Error updating price:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    // actionName can be in query params or body for flexibility
    const { searchParams } = new URL(request.url);
    let actionName = searchParams.get('actionName');

    if (!actionName) {
      const body = await request.json().catch(() => ({})); // Allow empty body or non-JSON body
      actionName = body.actionName;
    }

    if (!actionName) {
      return NextResponse.json({ message: 'actionName is required in query parameters or request body' }, { status: 400 });
    }

    const deletedPrice = await Price.findOneAndDelete({ actionName });

    if (!deletedPrice) {
      return NextResponse.json({ message: 'Price with this actionName not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Price deleted successfully', deletedPrice });
  } catch (error) {
    console.error('Error deleting price:', error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { actionName, price } = body;

    if (!actionName || typeof price !== 'number') {
      return NextResponse.json({ message: 'actionName and price are required, and price must be a number' }, { status: 400 });
    }

    const existingPrice = await Price.findOne({ actionName });
    if (existingPrice) {
      return NextResponse.json({ message: 'Price with this actionName already exists' }, { status: 409 });
    }

    const newPrice = new Price({ actionName, price });
    const savedPrice = await newPrice.save();

    return NextResponse.json(savedPrice, { status: 201 });
  } catch (error) {
    console.error('Error creating price:', error);
    if (error instanceof Error) {
      // Check for duplicate key error (code 11000)
      if ((error as any).code === 11000) {
        return NextResponse.json({ message: 'Price with this actionName already exists (duplicate key)' }, { status: 409 });
      }
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'An unknown error occurred' }, { status: 500 });
  }
}
