// app/api/messages/search/route.ts
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

    const messages = await prisma.message.findMany({
      where: {
        AND: [
          {
            content: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            chat: {
              participants: {
                some: {
                  userId: session.user.id
                }
              }
            }
          }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        chat: {
          select: {
            id: true,
            name: true,
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Message search error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}