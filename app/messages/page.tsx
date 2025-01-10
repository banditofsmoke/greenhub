'use client'

import { useState, useEffect } from 'react'
import { Send } from 'lucide-react'
import { useApi } from '../hooks/useApi'
import { useToast } from '../contexts/ToastContext'

type Message = {
  id: number
  sender: string
  content: string
  timestamp: Date
}

type Conversation = {
  id: number
  name: string
  messages: Message[]
}

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: 'BlazeRunner',
    messages: [
      { id: 1, sender: 'BlazeRunner', content: 'Hey, how\'s it growing?', timestamp: new Date('2023-06-10T10:00:00') },
      { id: 2, sender: 'You', content: 'Pretty good! Just trimmed my plants.', timestamp: new Date('2023-06-10T10:05:00') },
    ]
  },
  {
    id: 2,
    name: 'ChronicChiller',
    messages: [
      { id: 1, sender: 'ChronicChiller', content: 'Did you see the new strain at the dispensary?', timestamp: new Date('2023-06-09T15:30:00') },
      { id: 2, sender: 'You', content: 'Not yet, is it fire?', timestamp: new Date('2023-06-09T15:35:00') },
    ]
  },
]

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const { data, isLoading, error, execute } = useApi<Conversation[]>()
  const { showToast } = useToast()

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const result = await execute(
        new Promise<Conversation[]>(resolve => 
          setTimeout(() => resolve(initialConversations), 1000)
        )
      )
      setConversations(result)
    } catch (err) {
      showToast('Failed to load conversations', 'error')
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && selectedConversation) {
      try {
        await execute(new Promise(resolve => setTimeout(resolve, 500)))

        const updatedConversations = conversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: conv.messages.length + 1,
                  sender: 'You',
                  content: newMessage.trim(),
                  timestamp: new Date()
                }
              ]
            }
          }
          return conv
        })
        setConversations(updatedConversations)
        setSelectedConversation(updatedConversations.find(c => c.id === selectedConversation.id) || null)
        setNewMessage('')
        showToast('Message sent successfully', 'success')
      } catch (err) {
        showToast('Failed to send message', 'error')
      }
    }
  }

  if (isLoading && conversations.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading conversations...</div>
  }

  if (error && conversations.length === 0) {
    return <div className="text-destructive text-center">{error}</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <div className="bg-card text-card-foreground rounded-lg shadow-lg p-4 h-[600px] flex">
        <div className="w-1/3 border-r border-border pr-4">
          <h2 className="text-2xl font-semibold mb-4">Conversations</h2>
          <ul>
            {conversations.map(conversation => (
              <li
                key={conversation.id}
                className={`cursor-pointer p-2 rounded ${selectedConversation?.id === conversation.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
                onClick={() => setSelectedConversation(conversation)}
              >
                {conversation.name}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-2/3 pl-4 flex flex-col">
          {selectedConversation ? (
            <>
              <h2 className="text-2xl font-semibold mb-4">Chat with {selectedConversation.name}</h2>
              <div className="flex-grow overflow-y-auto mb-4">
                {selectedConversation.messages.map(message => (
                  <div key={message.id} className={`mb-2 ${message.sender === 'You' ? 'text-right' : ''}`}>
                    <span className={`inline-block rounded px-2 py-1 ${message.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                      <strong>{message.sender}:</strong> {message.content}
                    </span>
                    <div className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow mr-2 p-2 bg-input text-foreground rounded-md"
                  disabled={isLoading}
                />
                <button type="submit" className="bg-primary text-primary-foreground p-2 rounded-md" disabled={isLoading}>
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <p>Select a conversation to start chatting</p>
          )}
        </div>
      </div>
    </div>
  )
}

