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

    setIsUploading(true)
    const formData = new FormData()
    
    // Append all selected files
    Array.from(e.target.files).forEach(file => {
      formData.append('file', file)
    })

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
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
    }
  }

  return (
    <div className={className}>
      <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50">
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          multiple={multiple}
          accept="image/*"
          disabled={isUploading}
        />
        <Upload className="h-4 w-4" />
        {isUploading ? 'Uploading...' : 'Upload Images'}
      </label>
    </div>
  )
}