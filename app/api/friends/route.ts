// app/api/friends/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '../../../lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get all friend relationships for the user
    const friends = await prisma.friend.findMany({
      where: {
        OR: [
          { userId: user.id },
          { friendId: user.id }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            lastSeen: true
          }
        },
        friend: {
          select: {
            id: true,
            name: true,
            lastSeen: true
          }
        }
      }
    })

    return NextResponse.json(friends)
  } catch (error) {
    console.error('Get friends error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { friendId, action } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    switch (action) {
      case 'add':
        const existingFriend = await prisma.friend.findFirst({
          where: {
            OR: [
              { userId: user.id, friendId },
              { userId: friendId, friendId: user.id }
            ]
          }
        })

        if (existingFriend) {
          return NextResponse.json({ error: 'Friend request already exists' }, { status: 400 })
        }

        const newFriend = await prisma.friend.create({
          data: {
            userId: user.id,
            friendId,
            status: 'pending'
          },
          include: {
            user: true,
            friend: true
          }
        })

        // Emit socket event for friend request
        if (req.socket.server.io) {
          req.socket.server.io.to(friendId).emit('friend_request', newFriend)
        }

        return NextResponse.json(newFriend)

      case 'accept':
        const updatedFriend = await prisma.friend.update({
          where: {
            userId_friendId: {
              userId: friendId,
              friendId: user.id
            }
          },
          data: {
            status: 'accepted'
          },
          include: {
            user: true,
            friend: true
          }
        })

        // Emit socket event for accepted request
        if (req.socket.server.io) {
          req.socket.server.io.to(friendId).emit('friend_status', {
            userId: user.id,
            status: 'accepted'
          })
        }

        return NextResponse.json(updatedFriend)

      case 'reject':
      case 'unfriend':
        await prisma.friend.delete({
          where: {
            userId_friendId: {
              userId: friendId,
              friendId: user.id
            }
          }
        })

        return NextResponse.json({ success: true })

      case 'block':
        const blockedFriend = await prisma.friend.update({
          where: {
            userId_friendId: {
              userId: user.id,
              friendId
            }
          },
          data: {
            status: 'blocked'
          }
        })

        return NextResponse.json(blockedFriend)

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Friend action error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}