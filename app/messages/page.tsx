import { Suspense } from 'react'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import { authOptions } from '../api/auth/[...nextauth]/route'
import MessagesComponent from './MessagesComponent'

export default async function MessagesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/sign-in?callbackUrl=/messages')
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <MessagesComponent />
    </Suspense>
  )
}