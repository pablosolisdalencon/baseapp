import { NextResponse } from "next/server";
import { connectDB } from '../../../utils/mongoose';

export async function GET(){
    connectDB();
    
    return NextResponse.json({"message": "holas"});
}