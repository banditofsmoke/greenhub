// app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { authOptions } from '../auth/[...nextauth]/route'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), 'public/uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Ignore if directory already exists
    }

    // Create unique filename
    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    const path = join(uploadsDir, uniqueFilename)
    
    await writeFile(path, buffer)
    
    return NextResponse.json({ 
      url: `/uploads/${uniqueFilename}`,
      success: true 
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}