'use client'

import { useState, useEffect } from 'react'
import { User, ThumbsUp, MessageSquare, Flag, Globe, Lock, Smile, Zap, Coffee, ImageIcon, AlertTriangle } from 'lucide-react'
import { useToast } from '../contexts/ToastContext'

const reactions = [
  { emoji: '🍁', name: 'Leaf' },
  { emoji: '🔥', name: 'Fire' },
  { emoji: '😎', name: 'Cool' },
  { emoji: '🤯', name: 'Mind Blown' },
]

type Post = {
  id: number
  author: string
  content: string
  likes: number
  comments: number
  isPrivate: boolean
  reactions: Record<string, number>
  images: string[]
  reports: number
}

export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [highThought, setHighThought] = useState('')
  const [images, setImages] = useState<File[]>([])
  const { showToast } = useToast()

  useEffect(() => {
    // Fetch initial posts
    const fetchPosts = async () => {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPosts([
        {
          id: 1,
          author: 'CannabisEnthusiast',
          content: 'Just tried a new strain and it\'s amazing! Has anyone else tried "Green Dream"?',
          likes: 15,
          comments: 3,
          isPrivate: false,
          reactions: { '🍁': 5, '🔥': 3 },
          images: [],
          reports: 0,
        },
        {
          id: 2,
          author: 'StonerPhilosopher',
          content: 'High Thought: What if the universe is just one big hotbox?',
          likes: 42,
          comments: 7,
          isPrivate: false,
          reactions: { '🤯': 10, '😎': 8 },
          images: [],
          reports: 0,
        },
      ])
    }
    fetchPosts()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPost.trim()) {
      const post: Post = {
        id: posts.length + 1,
        author: 'CurrentUser', // In a real app, this would be the logged-in user
        content: newPost,
        likes: 0,
        comments: 0,
        isPrivate,
        reactions: {},
        images: images.map(image => URL.createObjectURL(image)),
        reports: 0,
      }
      setPosts([post, ...posts])
      setNewPost('')
      setIsPrivate(false)
      setImages([])
    }
  }

  const handleReaction = (postId: number, reaction: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const updatedReactions = { ...post.reactions }
        updatedReactions[reaction] = (updatedReactions[reaction] || 0) + 1
        return { ...post, reactions: updatedReactions }
      }
      return post
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 3) {
      showToast('You can only upload up to 3 images per post', 'error')
      return
    }
    setImages(prevImages => [...prevImages, ...files])
  }

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index))
  }

  const generateHighThought = () => {
    const thoughts = [
      "What if plants are actually farming us?",
      "Is a hotdog a sandwich?",
      "Do fish get thirsty?",
      "Why isn't phonetic spelled the way it sounds?",
      "If you're waiting for the waiter, aren't you the waiter?",
    ]
    setHighThought(thoughts[Math.floor(Math.random() * thoughts.length)])
  }

  const handleReport = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newReports = post.reports + 1
        if (newReports >= 5) {
          showToast('This post has been flagged for review by an admin', 'info')
          return { ...post, reports: newReports, content: 'This post has been temporarily removed due to multiple reports.' }
        }
        return { ...post, reports: newReports }
      }
      return post
    }))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Community Feed</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 mb-2"
          rows={4}
        />
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={() => setIsPrivate(!isPrivate)}
              className="mr-2"
            />
            Make this post private
          </label>
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
              <ImageIcon className="inline-block mr-2" size={16} />
              Add Images ({images.length}/3)
            </label>
          </div>
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(image)} alt="Uploaded" className="w-20 h-20 object-cover rounded" />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <AlertTriangle size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
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
              <User className="mr-2" size={24} />
              <span className="font-semibold">{post.author}</span>
              {post.isPrivate ? (
                <Lock className="ml-2 text-gray-400" size={16} />
              ) : (
                <Globe className="ml-2 text-gray-400" size={16} />
              )}
            </div>
            <p className="mb-4">{post.content}</p>
            {post.images.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.images.map((image, index) => (
                  <img key={index} src={image} alt="Post" className="w-32 h-32 object-cover rounded" />
                ))}
              </div>
            )}
            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
              <button className="flex items-center mr-4">
                <ThumbsUp className="mr-1" size={16} />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center mr-4">
                <MessageSquare className="mr-1" size={16} />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center" onClick={() => handleReport(post.id)}>
                <Flag className="mr-1" size={16} />
                <span>Report</span>
              </button>
            </div>
            <div className="flex items-center space-x-2">
              {reactions.map((reaction) => (
                <button
                  key={reaction.name}
                  onClick={() => handleReaction(post.id, reaction.emoji)}
                  className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full p-2"
                >
                  {reaction.emoji}
                  <span className="ml-1 text-xs">{post.reactions[reaction.emoji] || 0}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

