import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, bio, preferences } = await req.json()
    
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name,
        bio,
        updatedAt: new Date(),
      },
    })

    if (preferences) {
      await prisma.preference.upsert({
        where: { userId: user.id },
        create: {
          ...preferences,
          userId: user.id,
        },
        update: preferences,
      })
    }

    // Fetch updated user data with preferences
    const updatedUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        preferences: true,
        badges: true,
        achievements: true,
        gallery: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}