// app/api/messages/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const chatId = searchParams.get('chatId')

    if (!chatId) {
      const chats = await prisma.chat.findMany({
        where: {
          participants: {
            some: {
              userId: session.user.id
            }
          }
        },
        include: {
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
          },
          messages: {
            take: 1,
            orderBy: {
              createdAt: 'desc'
            }
          }
        }
      })
      return NextResponse.json(chats)
    }

    const messages = await prisma.message.findMany({
      where: {
        chatId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error('GET /api/messages error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { content, chatId, recipientId } = await req.json()

    let finalChatId = chatId

    if (!chatId && recipientId) {
      // Create a new chat if it doesn't exist
      const existingChat = await prisma.chat.findFirst({
        where: {
          type: 'direct',
          participants: {
            every: {
              userId: {
                in: [session.user.id, recipientId]
              }
            }
          }
        }
      })

      if (existingChat) {
        finalChatId = existingChat.id
      } else {
        const newChat = await prisma.chat.create({
          data: {
            type: 'direct',
            participants: {
              create: [
                { userId: session.user.id },
                { userId: recipientId }
              ]
            }
          }
        })
        finalChatId = newChat.id
      }
    }

    const message = await prisma.message.create({
      data: {
        content,
        chatId: finalChatId,
        senderId: session.user.id
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    })

    return NextResponse.json(message)
  } catch (error) {
    console.error('POST /api/messages error:', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}