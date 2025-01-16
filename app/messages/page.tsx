// app/messages/page.tsx
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import MessagesComponent from './MessagesComponent'

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/sign-in?callbackUrl=/messages')
  }

  return <MessagesComponent />
}