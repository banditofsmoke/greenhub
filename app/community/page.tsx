'use client'

import { useState, useEffect } from 'react'
import { User, ThumbsUp, MessageSquare, Flag, Globe, Lock, Smile, Zap } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'
import { useSession } from 'next-auth/react'
import UploadButton from '../components/UploadButton'

const reactions = [
  { emoji: '🍁', name: 'Leaf' },
  { emoji: '🔥', name: 'Fire' },
  { emoji: '😎', name: 'Cool' },
  { emoji: '🤯', name: 'Mind Blown' },
]

type Post = {
  id: string
  content: string
  isPrivate: boolean
  images: string[]
  createdAt: string
  user: {
    name: string
    image: string
  }
  reactions: {
    type: string
    user: {
      id: string
      name: string
    }
  }[]
  _count: {
    comments: number
    reactions: number
    reports: number
  }
}

export default function CommunityFeed() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [highThought, setHighThought] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (!response.ok) throw new Error('Failed to fetch posts')
      const data = await response.json()
      setPosts(data)
    } catch (error) {
      console.error('Error fetching posts:', error)
      showToast('Failed to load posts', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUploadComplete = (urls: string[]) => {
    setImages(prev => {
      // Check if we'd exceed the limit
      if (prev.length + urls.length > 3) {
        showToast('Maximum 3 images allowed', 'error')
        return prev
      }
      return [...prev, ...urls]
    })
    showToast('Images uploaded successfully!', 'success')
  }

  const handleUploadError = (error: Error) => {
    showToast(error.message, 'error')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim() && !images.length) return
    if (!session) {
      showToast('Please sign in to create a post', 'error')
      return
    }

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newPost,
          isPrivate,
          images,
        }),
      })

      if (!response.ok) throw new Error('Failed to create post')
      
      const newPostData = await response.json()
      setPosts([newPostData, ...posts])
      setNewPost('')
      setIsPrivate(false)
      setImages([])
      showToast('Post created successfully!', 'success')
    } catch (error) {
      console.error('Error creating post:', error)
      showToast('Failed to create post', 'error')
    }
  }

  const handleReaction = async (postId: string, reactionType: string) => {
    if (!session) {
      showToast('Please sign in to react to posts', 'error')
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/reactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: reactionType }),
      })

      if (!response.ok) throw new Error('Failed to add reaction')
      
      // Optimistically update UI
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            reactions: [...post.reactions, { 
              type: reactionType, 
              user: { 
                id: session?.user?.email || '', 
                name: session?.user?.name || '' 
              } 
            }],
            _count: {
              ...post._count,
              reactions: post._count.reactions + 1,
            },
          }
        }
        return post
      })
      setPosts(updatedPosts)
    } catch (error) {
      console.error('Error adding reaction:', error)
      showToast('Failed to add reaction', 'error')
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const generateHighThought = () => {
    const thoughts = [
      "What if plants are actually farming us?",
      "Is a hotdog a sandwich?",
      "Do fish get thirsty?",
      "Why isn't phonetic spelled the way it sounds?",
      "If you're waiting for the waiter, aren't you the waiter?",
      "What if colors look different to everyone?",
      "Is water wet?",
      "Why do we park in driveways and drive on parkways?",
      "If tomorrow never comes, how do we get to next week?",
      "What if the universe is just a simulation in someone's dream?"
    ]
    setHighThought(thoughts[Math.floor(Math.random() * thoughts.length)])
  }

  const handleReport = async (postId: string) => {
    if (!session) {
      showToast('Please sign in to report posts', 'error')
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) throw new Error('Failed to report post')

      showToast('Post has been reported to moderators', 'success')
      
      // Optimistically update UI
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            _count: {
              ...post._count,
              reports: post._count.reports + 1,
            },
          }
        }
        return post
      })
      setPosts(updatedPosts)
    } catch (error) {
      console.error('Error reporting post:', error)
      showToast('Failed to report post', 'error')
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Community Feed</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder={session ? "Share your thoughts..." : "Please sign in to post"}
          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 mb-2"
          rows={4}
          disabled={!session}
        />
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
              className="mr-2"
              disabled={!session}
            />
            Make this post private
          </label>
          <UploadButton
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
            multiple={images.length < 3}
            className={!session ? 'opacity-50 pointer-events-none' : ''}
          />
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((url, index) => (
              <div key={url} className="relative">
                <img 
                  src={url}
                  alt="Upload preview" 
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="submit"
          className={`px-4 py-2 rounded-md transition-colors ${
            session 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
          disabled={!session || (!newPost.trim() && !images.length)}
        >
          Post
        </button>
      </form>

      <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">High Thought Generator</h2>
        <p className="mb-4">{highThought || "Click the button to generate a high thought!"}</p>
        <button
          onClick={generateHighThought}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          <Zap className="inline-block mr-2" />
          Generate High Thought
        </button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              {post.user.image ? (
                <img 
                  src={post.user.image} 
                  alt={post.user.name || 'User'} 
                  className="w-8 h-8 rounded-full mr-2"
                />
              ) : (
                <User className="w-8 h-8 mr-2" />
              )}
              <span className="font-semibold">{post.user.name}</span>
              {post.isPrivate ? (
                <Lock className="ml-2 text-gray-400" size={16} />
              ) : (
                <Globe className="ml-2 text-gray-400" size={16} />
              )}
            </div>
            
            <p className="mb-4">{post.content}</p>
            
            {post.images?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.images.map((image, index) => (
                  <img 
                    key={index} 
                    src={image} 
                    alt="Post content" 
                    className="w-32 h-32 object-cover rounded"
                  />
                ))}
              </div>
            )}
            
            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center mr-4">
                <ThumbsUp className="mr-1" size={16} />
                <span>{post._count.reactions}</span>
              </div>
              <div className="flex items-center mr-4">
                <MessageSquare className="mr-1" size={16} />
                <span>{post._count.comments}</span>
              </div>
              <button 
                className="flex items-center" 
                onClick={() => handleReport(post.id)}
              >
                <Flag className="mr-1" size={16} />
                <span>Report</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              {reactions.map((reaction) => {
                const reactionCount = post.reactions.filter(r => r.type === reaction.emoji).length
                return (
                  <button
                    key={reaction.name}
                    onClick={() => handleReaction(post.id, reaction.emoji)}
                    className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2"
                  >
                    {reaction.emoji}
                    <span className="ml-1 text-xs">{reactionCount}</span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}