import NextAuth, { DefaultSession } from 'next-auth'
import bcrypt from 'bcrypt'
import { AuthOptions } from 'next-auth'
import { Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from '@/lib/prisma'

type User = {
  id: string
  email: string
  name?: string | null
  hashedPassword?: string
}

interface ExtendedSession extends Session {
  user: {
    id: string
    email: string
    name?: string | null
  } & DefaultSession["user"]
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required')
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase().trim()
            }
          })

          if (!user || !user?.hashedPassword) {
            throw new Error('No user found with these credentials')
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.hashedPassword
          )

          if (!isCorrectPassword) {
            throw new Error('Invalid password')
          }

          return user
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }): Promise<ExtendedSession> {
      if (session.user) {
        session.user.name = token.id as string
        session.user.email = token.email as string
      }
      return session as ExtendedSession
    }
  },
  debug: process.env.NODE_ENV === 'development',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }