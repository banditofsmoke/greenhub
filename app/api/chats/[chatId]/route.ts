// app/api/chats/[chatId]/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '../../../../lib/prisma' 
import { authOptions } from '../../../../app/api/auth/[...nextauth]/route'

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ status: 401, message: 'Unauthorized' })
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id: params.chatId,
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
                image: true,
                lastSeen: true
              }
            }
          }
        },
        messages: {
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
          },
          take: 50
        }
      }
    })

    if (!chat) {
      return NextResponse.json({ status: 404, message: 'Chat not found' })
    }

    // Update last read timestamp for current user
    await prisma.chatParticipant.update({
      where: {
        userId_chatId: {
          userId: session.user.id,
          chatId: params.chatId
        }
      },
      data: {
        lastRead: new Date()
      }
    })

    return NextResponse.json(chat)
  } catch (error) {
    console.error('Get chat error:', error)
    return NextResponse.json({ status: 500, message: 'Internal Error' })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ status: 401, message: 'Unauthorized' })
    }

    const { name } = await req.json()

    const chat = await prisma.chat.update({
      where: {
        id: params.chatId,
        participants: {
          some: {
            userId: session.user.id
          }
        }
      },
      data: {
        name
      }
    })

    return NextResponse.json(chat)
  } catch (error) {
    console.error('Update chat error:', error)
    return NextResponse.json({ status: 500, message: 'Internal Error' })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ status: 401, message: 'Unauthorized' })
    }

    // First remove the user's participation
    await prisma.chatParticipant.deleteMany({
      where: {
        AND: [
          { userId: session.user.id },
          { chatId: params.chatId }
        ]
      }
    })

    // Check remaining participants
    const remainingParticipants = await prisma.chatParticipant.count({
      where: {
        chatId: params.chatId
      }
    })

    // If no participants left, delete the chat and its messages
    if (remainingParticipants === 0) {
      // Delete all messages first due to foreign key constraints
      await prisma.message.deleteMany({
        where: {
          chatId: params.chatId
        }
      })

      // Then delete the chat
      await prisma.chat.delete({
        where: {
          id: params.chatId
        }
      })
    }

    return NextResponse.json({ status: 200, message: 'Success' })
    
  } catch (error) {
    console.error('Delete chat error:', error)
    return NextResponse.json({ status: 500, message: 'Internal Error' })
  }
}