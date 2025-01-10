import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.user.findUnique({
      where: {
        email: session.user.email
      },
      include: {
        badges: true,
        achievements: true,
        gallery: true,
        preferences: true
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const updatedProfile = await prisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        name: data.name,
        bio: data.bio,
        preferences: {
          upsert: {
            create: data.preferences,
            update: data.preferences
          }
        },
        badges: {
          set: data.badges
        }
        // Add other fields as needed
      },
      include: {
        badges: true,
        achievements: true,
        gallery: true,
        preferences: true
      }
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}