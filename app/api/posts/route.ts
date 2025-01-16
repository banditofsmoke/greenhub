// app/api/posts/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'
import { Prisma } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content, isPrivate, images } = await req.json()
    
    // Add validation for images
    const validatedImages = Array.isArray(images) ? images.filter(img => 
      typeof img === 'string' && img.startsWith('https://res.cloudinary.com/')
    ) : [];
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Add logging to debug image handling
    console.log('Creating post with images:', validatedImages);

    const post = await prisma.post.create({
      data: {
        content,
        isPrivate,
        images: validatedImages, // Use validated images
        userId: user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(post)
  } catch (e) {
    const error = e as Error
    console.error('Post creation error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 })
  }
}

// Keep the rest of your GET function exactly as is

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { isPrivate: false },
          session?.user?.email ? {
            user: {
              email: session.user.email
            }
          } : {}
        ]
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            reactions: true,
            comments: true,
            reports: true,
          },
        },
      },
      take: 50,
    })

    return NextResponse.json(posts)
  } catch (e) {
    const error = e as Error
    console.error('Feed fetch error:', error)
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 })
  }
}