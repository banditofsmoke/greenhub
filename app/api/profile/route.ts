// app/api/profile/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]/route'

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new Response('Unauthorized', { status: 401 })
    }

    const data = await req.json()
    
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name,
        bio: data.bio,
        updatedAt: new Date(),
      },
    })

    // If there are preferences, update or create them
    if (data.preferences) {
      await prisma.preference.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          ...data.preferences,
        },
        update: data.preferences,
      })
    }

    return Response.json(user)
  } catch (error) {
    console.error('Profile update error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}