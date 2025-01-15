// app/api/profile/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../app/api/auth/[...nextauth]/route"
import prisma from '../../../lib/prisma'

export const dynamic = 'force-dynamic'

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
    return NextResponse.json({ 
      error: 'Failed to fetch profile',
      details: process.env.NODE_ENV === 'development' ? error : undefined 
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    console.log('Received update data:', data)

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { preferences: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user and preferences in a transaction
    const updatedProfile = await prisma.$transaction(async (tx) => {
      // Update user basic info
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          name: data.name,
          bio: data.bio,
        },
      })

      // Update or create preferences
      const updatedPreferences = await tx.preference.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          ...data.preferences,
        },
        update: data.preferences,
      })

      // Update badges if provided
      if (data.badges) {
        await tx.badge.deleteMany({
          where: { userId: user.id }
        })

        if (data.badges.length > 0) {
          await tx.badge.createMany({
            data: data.badges.map((badgeId: string) => ({
              userId: user.id,
              name: consumptionBadges.find(b => b.id === badgeId)?.name || '',
              icon: consumptionBadges.find(b => b.id === badgeId)?.icon || '',
              description: consumptionBadges.find(b => b.id === badgeId)?.description || '',
              category: consumptionBadges.find(b => b.id === badgeId)?.category || '',
            }))
          })
        }
      }

      // Return updated user with all relations
      return tx.user.findUnique({
        where: { id: user.id },
        include: {
          badges: true,
          achievements: true,
          gallery: true,
          preferences: true
        }
      })
    })

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ 
      error: 'Failed to update profile',
      details: process.env.NODE_ENV === 'development' ? error : undefined 
    }, { status: 500 })
  }
}