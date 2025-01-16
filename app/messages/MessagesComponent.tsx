'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, ChevronLeft } from 'lucide-react'
import { useSocket } from '../hooks/useSocket'
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth'
import { useApi } from '../hooks/useApi'
import { useToast } from '../contexts/ToastContext'
import { useSearchParams } from 'next/navigation'

type Message = {
  id: string
  content: string
  senderId: string
  sender: {
    id: string
    name: string
    image?: string
  }
  chatId: string
  createdAt: Date
  read: boolean
}

type Chat = {
  id: string
  type: string
  name?: string
  participants: {
    user: {
      id: string
      name: string
      image?: string
    }
    lastRead: Date
  }[]
  messages: Message[]
  updatedAt: Date
}

interface ExtendedSession extends Session {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function MessagesComponent() {
  const { data: session } = useSession() as { data: ExtendedSession | null }
  const socket = useSocket()
  const { showToast } = useToast()
  const searchParams = useSearchParams()
  const { execute } = useApi<Chat>()
  
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef<NodeJS.Timeout>()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (socket) {
      console.log('Socket connected:', socket)
      socket.emit('test', { message: 'Hello Socket!' })
      socket.on('test-response', (data) => {
        console.log('Received test response:', data)
      })
    }
  }, [socket])

  useEffect(() => {
    if (session?.user) {
      fetchChats()
      
      const friendId = searchParams?.get('friendId')
      if (friendId) {
        initiateChatWithFriend(friendId)
      }
    }
  }, [session, searchParams])

  useEffect(() => {
    if (socket && selectedChat?.id) {
      socket.emit('join-chat', selectedChat.id)
      
      socket.on('message', handleNewMessage)
      socket.on('typing', handleUserTyping)
      socket.on('message_read', handleMessageRead)
      
      return () => {
        socket.emit('leave-chat', selectedChat.id)
        socket.off('message', handleNewMessage)
        socket.off('typing', handleUserTyping)
        socket.off('message_read', handleMessageRead)
      }
    }
  }, [socket, selectedChat])

  useEffect(() => {
    if (messagesEndRef.current && selectedChat?.messages?.length) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedChat?.messages])

  const fetchChats = async () => {
    try {
      const response = await execute(async () => {
        const res = await fetch('/api/messages')
        return res.json()
      })
      setChats(response || [])
      setIsLoading(false)
    } catch (error) {
      showToast('Failed to load chats', 'error')
      setIsLoading(false)
    }
  }

  const handleNewMessage = (message: Message) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === message.chatId) {
        return {
          ...chat,
          messages: [...chat.messages, message],
          updatedAt: new Date()
        }
      }
      return chat
    }))
    
    if (selectedChat?.id === message.chatId) {
      setSelectedChat(prev => prev ? {
        ...prev,
        messages: [...prev.messages, message]
      } : null)
    }
  }

  const handleUserTyping = (data: { chatId: string; userId: string }) => {
    if (data.chatId === selectedChat?.id && data.userId !== session?.user?.id) {
      setIsTyping(true)
      setTimeout(() => setIsTyping(false), 3000)
    }
  }

  const handleMessageRead = (data: { chatId: string; userId: string; lastRead: Date }) => {
    setChats(prev => prev.map(chat => {
      if (chat.id === data.chatId) {
        return {
          ...chat,
          participants: chat.participants.map(p => 
            p.user.id === data.userId 
              ? { ...p, lastRead: new Date(data.lastRead) }
              : p
          )
        }
      }
      return chat
    }))
  }

  const initiateChatWithFriend = async (friendId: string) => {
    try {
      const response = await execute(async (): Promise<Chat> => {
        const res = await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipientId: friendId })
        })
  
        if (!res.ok) {
          throw new Error('Failed to initiate chat')
        }
  
        const data = await res.json()
        return data.chat as Chat
      })
  
      if (response) {
        setSelectedChat(response)
        setChats(prev => [response, ...prev])
      }
    } catch (error) {
      showToast('Failed to start chat', 'error')
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat?.id || !socket || !session?.user?.id) return

    try {
      socket.emit('message', {
        chatId: selectedChat.id,
        content: newMessage.trim()
      })
      setNewMessage('')
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        socket.emit('stop-typing', {
          chatId: selectedChat.id,
          userId: session.user.id
        })
      }
    } catch (error) {
      showToast('Failed to send message', 'error')
    }
  }

  const handleTyping = () => {
    if (!socket || !selectedChat?.id || !session?.user?.id) return

    socket.emit('typing', {
      chatId: selectedChat.id,
      userId: session.user.id
    })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', {
        chatId: selectedChat.id,
        userId: session.user.id
      })
    }, 2000)
  }

  if (!session) {
    return <div className="p-4">Please sign in to view messages</div>
  }

  if (isLoading && !chats.length) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="bg-card text-card-foreground rounded-lg shadow-lg p-4 h-[600px] flex">
        {/* Chats Sidebar */}
        <div className="w-1/3 border-r border-border pr-4">
          <h2 className="text-2xl font-semibold mb-4">Conversations</h2>
          <ul className="space-y-2">
            {chats.map(chat => {
              const otherParticipant = chat.participants.find(
                p => p.user.id !== session?.user?.id
              )?.user
              
              return (
                <li
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`
                    cursor-pointer p-3 rounded-lg transition-colors
                    ${selectedChat?.id === chat.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-secondary'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{otherParticipant?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {chat.messages.length > 0 && (
                    <p className="text-sm truncate text-muted-foreground">
                      {chat.messages[chat.messages.length - 1].content}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 pl-4 flex flex-col">
          {selectedChat ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">
                  {selectedChat.participants.find(
                    p => p.user.id !== session?.user?.id
                  )?.user.name}
                </h2>
              </div>

              {/* Messages */}
              <div className="flex-grow overflow-y-auto mb-4 space-y-4">
                {selectedChat.messages.map(message => {
                  const isOwnMessage = message.senderId === session?.user?.id
                  
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`
                          max-w-[70%] rounded-lg px-4 py-2
                          ${isOwnMessage 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary'
                          }
                        `}
                      >
                        <p>{message.content}</p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </span>
                          {isOwnMessage && message.read && (
                            <span className="text-xs text-blue-500">Read</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {isTyping && (
                <div className="text-sm text-muted-foreground mb-2">
                  Typing...
                </div>
              )}

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value)
                    handleTyping()
                  }}
                  placeholder="Type a message..."
                  className="flex-grow p-2 rounded-md border border-border bg-background"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-primary text-primary-foreground p-2 rounded-md disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}