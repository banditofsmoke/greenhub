// app/api/posts/[postId]/reactions/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '../../../../../lib/prisma'
import { authOptions } from '../../../auth/[...nextauth]/route'

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type } = await req.json()
    const { postId } = params

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Try to create the reaction
    try {
      const reaction = await prisma.postReaction.create({
        data: {
          type,
          postId,
          userId: user.id,
        },
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      })
      return NextResponse.json(reaction)
    } catch (err: any) {
      // If the reaction already exists, try to delete it (toggle behavior)
      if (err.code === 'P2002') {
        const existingReaction = await prisma.postReaction.delete({
          where: {
            postId_userId_type: {
              postId,
              userId: user.id,
              type,
            },
          },
          include: {
            user: {
              select: {
                name: true,
                id: true,
              },
            },
          },
        })
        return NextResponse.json({ deleted: true, reaction: existingReaction })
      }
      throw err // Re-throw if it's not a duplicate error
    }
  } catch (error: any) {
    console.error('Reaction error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const { postId } = params

    const reactions = await prisma.postReaction.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(reactions)
  } catch (error: any) {
    console.error('Get reactions error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 })
  }
}