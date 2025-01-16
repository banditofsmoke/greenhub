'use client'

import { useState } from 'react'
import { Upload } from 'lucide-react'

interface UploadButtonProps {
  onUploadComplete: (urls: string[]) => void
  onUploadError?: (error: Error) => void
  multiple?: boolean
  className?: string
}

export default function UploadButton({
  onUploadComplete,
  onUploadError,
  multiple = false,
  className = '',
}: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    // Add size validation
    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    const MAX_FILES = 4 // Limit number of files
    const files = Array.from(e.target.files)
    
    // Check number of files
    if (files.length > MAX_FILES) {
      onUploadError?.(new Error(`Maximum ${MAX_FILES} files allowed`))
      return
    }

    // Validate file sizes and types
    const oversizedFiles = files.filter(file => file.size > MAX_SIZE)
    if (oversizedFiles.length > 0) {
      onUploadError?.(new Error('Files must be less than 10MB'))
      return
    }

    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type))
    if (invalidFiles.length > 0) {
      onUploadError?.(new Error('Only JPEG, PNG, WEBP, and GIF files are allowed'))
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    
    // Append all selected files
    files.forEach(file => {
      formData.append('file', file)
    })

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Upload failed')
      }

      const data = await response.json()
      // Handle both single and multiple file uploads
      const urls = Array.isArray(data) 
        ? data.map(item => item.secure_url)
        : [data.secure_url]
        
      onUploadComplete(urls)
    } catch (error) {
      console.error('Upload error:', error)
      onUploadError?.(error as Error)
    } finally {
      setIsUploading(false)
      // Reset the input
      e.target.value = ''
    }
  }

  return (
    <div className={className}>
      <label 
        className={`
          cursor-pointer flex items-center gap-2 px-4 py-2 
          bg-primary text-primary-foreground rounded-md 
          hover:bg-primary/90 transition-colors
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          multiple={multiple}
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={isUploading}
        />
        <Upload className="h-4 w-4" />
        {isUploading ? 'Uploading...' : 'Upload Images'}
      </label>
    </div>
  )
}