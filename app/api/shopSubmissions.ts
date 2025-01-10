import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const submission = await request.json()
    const result = await prisma.shopSubmission.create({
      data: {
        ...submission,
        userId: session.user.id,
        status: 'pending'
      }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Shop submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}