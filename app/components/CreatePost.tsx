'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import UploadButton from './UploadButton'
import { useToast } from '../contexts/ToastContext'

export default function CreatePost() {
  const router = useRouter()
  const { showToast } = useToast()
  const [content, setContent] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          isPrivate,
          images,
        }),
      })

      if (!response.ok) throw new Error('Failed to create post')

      setContent('')
      setImages([])
      setIsPrivate(false)
      showToast('Post created successfully!', 'success')
      router.refresh()
    } catch (error) {
      showToast('Failed to create post', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-card rounded-lg shadow">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 rounded-md bg-background border"
        rows={3}
      />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <UploadButton
            onUploadComplete={(urls) => setImages(prev => [...prev, ...urls])}
            onUploadError={() => showToast('Upload failed', 'error')}
            multiple
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
            Private post
          </label>
        </div>
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>

      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((url, index) => (
            <div key={index} className="relative">
              <img src={url} alt="Upload preview" className="h-20 w-20 object-cover rounded" />
              <button
                type="button"
                onClick={() => setImages(images.filter((_, i) => i !== index))}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </form>
  )
}