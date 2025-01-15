'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '../../contexts/ToastContext'

export default function TestCommunityFeatures() {
  const { data: session, status } = useSession()
  const { showToast } = useToast()
  const [testResults, setTestResults] = useState<string[]>([])

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testCreatePost = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Test post ' + new Date().toISOString(),
          isPrivate: false,
          images: [],
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to create post')
      }
      
      const data = await response.json()
      addResult('✅ Post created successfully: ' + data.id)
      showToast('Post created!', 'success')
    } catch (error: any) {
      addResult(`❌ Post creation error: ${error.message}`)
      showToast('Post creation failed', 'error')
    }
  }

  const testFetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to fetch posts')
      }
      const data = await response.json()
      addResult(`✅ Fetched ${data.length} posts`)
      showToast('Posts fetched successfully', 'success')
    } catch (error: any) {
      addResult(`❌ Fetch error: ${error.message}`)
      showToast('Failed to fetch posts', 'error')
    }
  }

  const testImageUpload = async () => {
    try {
      // Create a test file
      const blob = new Blob(['test image content'], { type: 'image/png' })
      const file = new File([blob], 'test-image.png', { type: 'image/png' })
      
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to upload image')
      }
      
      const data = await response.json()
      addResult(`✅ Image uploaded: ${data.url}`)
      showToast('Image uploaded successfully', 'success')
    } catch (error: any) {
      addResult(`❌ Upload error: ${error.message}`)
      showToast('Upload failed', 'error')
    }
  }

  const testReaction = async () => {
    try {
      // First create a post
      const postResponse = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: 'Test post for reaction',
          isPrivate: false,
        }),
      })

      if (!postResponse.ok) {
        const error = await postResponse.json()
        throw new Error(error.message || 'Failed to create post')
      }
      
      const post = await postResponse.json()
      
      // Then add a reaction
      const reactionResponse = await fetch(`/api/posts/${post.id}/reactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: '🔥' }),
      })

      if (!reactionResponse.ok) {
        const error = await reactionResponse.json()
        throw new Error(error.message || 'Failed to add reaction')
      }
      
      const reaction = await reactionResponse.json()
      addResult('✅ Reaction added successfully')
      showToast('Reaction added!', 'success')
    } catch (error: any) {
      addResult(`❌ Reaction error: ${error.message}`)
      showToast('Reaction failed', 'error')
    }
  }

  if (status === 'loading') {
    return <div className="p-4">Loading...</div>
  }

  if (!session) {
    return <div className="p-4">Please sign in to test features</div>
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Community Features Test</h1>
      
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={testCreatePost}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Create Post
        </button>
        
        <button
          onClick={testFetchPosts}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Test Fetch Posts
        </button>
        
        <button
          onClick={testImageUpload}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Test Image Upload
        </button>
        
        <button
          onClick={testReaction}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Test Reaction
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <div className="bg-gray-800 text-white p-4 rounded max-h-96 overflow-y-auto">
          {testResults.map((result, index) => (
            <div key={index} className="mb-2 font-mono">
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}