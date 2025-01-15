// hooks/useSocket.ts
import { useEffect, useRef } from 'react'
import io, { Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'

export const useSocket = () => {
  const { data: session } = useSession()
  const socket = useRef<Socket>()
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  useEffect(() => {
    if (!socket.current && session?.user) {
      socket.current = io(SITE_URL, {
        path: '/api/socket',
        auth: {
          token: session.user.id
        }
      })

      socket.current.on('connect', () => {
        console.log('Socket connected')
      })

      socket.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
      })

      socket.current.on('disconnect', () => {
        console.log('Socket disconnected')
      })
    }

    return () => {
      if (socket.current) {
        socket.current.disconnect()
      }
    }
  }, [session])

  return socket.current
}