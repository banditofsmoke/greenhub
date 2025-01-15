// app/api/socket/route.ts
import { Server } from 'socket.io'
import { NextApiRequest } from 'next'
import { NextApiResponseServerIO } from '@types/socket'

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      console.log(`Socket ${socket.id} connected`)

      socket.on('join', (userId: string) => {
        socket.join(userId)
        console.log(`User ${userId} joined their room`)
      })

      socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`)
      })
    })
  }
  res.end()
}