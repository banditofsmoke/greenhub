'use client'

import { Suspense } from 'react'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useToast } from '../../contexts/ToastContext'

// Separate the main component logic
function AuthErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()
  
  useEffect(() => {
    const error = searchParams.get('error')
    
    let errorMessage = 'An error occurred during authentication'
    if (error === 'CredentialsSignin') {
      errorMessage = 'Invalid email or password'
    }
    
    showToast(errorMessage, 'error')
    router.push('/sign-in') // Redirect back to sign in
  }, [searchParams, router, showToast])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
        <p>Redirecting you back to sign in...</p>
      </div>
    </div>
  )
}

// Main page component wrapped with Suspense
export default function AuthError() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    }>
      <AuthErrorContent />
    </Suspense>
  )
}