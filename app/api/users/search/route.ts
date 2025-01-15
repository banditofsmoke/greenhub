// app/api/users/search/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import prisma from '../../../../lib/prisma'
import { authOptions } from '../../auth/[...nextauth]/route'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json({ error: 'Search query required' }, { status: 400 })
    }

    const results = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
        NOT: {
          email: session.user.email, // Exclude current user
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

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}