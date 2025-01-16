import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'
import MessagesComponent from './MessagesComponent'

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/sign-in?callbackUrl=/messages')
  }

  // Add this to verify session data
  console.log('Messages page session:', session)

  return <MessagesComponent />
}