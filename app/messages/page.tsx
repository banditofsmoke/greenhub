// app/messages/page.tsx
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/sign-in?callbackUrl=/messages')
  }

  return <MessagesComponent />
}