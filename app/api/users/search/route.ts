// app/api/users/search/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '../../../../lib/prisma'
import { authOptions } from '../../auth/[...nextauth]/route'

export const dynamic = 'force-dynamic'

// app/api/users/search/route.ts
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')
    console.log('Search query:', query)

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
        NOT: {
          email: session?.user?.email, // Don't show current user
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      take: 10,
    })
    
    console.log('Found users:', users.length)
    return Response.json(users)
  } catch (error) {
    console.error('Search error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}