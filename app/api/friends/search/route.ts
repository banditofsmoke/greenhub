// app/api/friends/search/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '../../../../lib/prisma' 
import { authOptions } from '../../../../app/api/auth/[...nextauth]/route'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query) {
      return new NextResponse('Search query is required', { status: 400 })
    }

    // Find users matching the search query who aren't already friends
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } }
            ]
          },
          { id: { not: session.user.id } },
          {
            NOT: {
              OR: [
                {
                  friendsReceived: {
                    some: {
                      userId: session.user.id,
                      status: { in: ['accepted', 'pending'] }
                    }
                  }
                },
                {
                  friendsInitiated: {
                    some: {
                      friendId: session.user.id,
                      status: { in: ['accepted', 'pending'] }
                    }
                  }
                }
              ]
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      },
      take: 10
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Friend search error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}