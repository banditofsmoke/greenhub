import bcrypt from 'bcrypt';
import prisma from '../../../../lib/prisma' ; // Ensure this is properly set up as shown below
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const body = await request.json();
    const { email, name, password } = body;

    // Validate the required fields
    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        hashedPassword,
      },
    });

    // Return the created user (excluding sensitive info like hashedPassword)
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    });
  } catch (error: any) {
    console.error('Error in register API route:', error);

    // Return a generic error message in production
    return NextResponse.json(
      {
        error: 'An error occurred',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
