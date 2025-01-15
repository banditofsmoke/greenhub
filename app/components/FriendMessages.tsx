// For FriendMessages.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, ChevronRight, ChevronLeft } from '../components/providers';

type Message = {
  id: string
  content: string
  senderId: string
  sender: User
  chatId: string
  chat: Chat
  createdAt: Date
}

type Chat = {
  id: string
  participants: User[]
  participantIds: string[]
  messages: Message[]
  createdAt: Date
}

type User = {
  id: string
  name: string
}

const initialFriends: User[] = [
  {
    id: '1',
    name: 'BlazeRunner',
  },
  {
    id: '2',
    name: 'ChronicChiller',
  },
]

const initialChats: Chat[] = [
  {
    id: '1',
    participants: [initialFriends[0], initialFriends[1]],
    participantIds: ['1', '2'],
    messages: [
      { id: '1', senderId: '1', sender: initialFriends[0], content: 'Hey, how\'s it growing?', chatId: '1', chat: {} as Chat, createdAt: new Date('2023-06-10T10:00:00') },
      { id: '2', senderId: '2', sender: initialFriends[1], content: 'Pretty good! Just trimmed my plants.', chatId: '1', chat: {} as Chat, createdAt: new Date('2023-06-10T10:05:00') },
    ],
    createdAt: new Date('2023-06-10T10:00:00')
  },
  {
    id: '2',
    participants: [initialFriends[1]],
    participantIds: ['2'],
    messages: [
      { id: '1', senderId: '2', sender: initialFriends[1], content: 'Did you see the new strain at the dispensary?', chatId: '2', chat: {} as Chat, createdAt: new Date('2023-06-09T15:30:00') },
      { id: '2', senderId: '1', sender: initialFriends[0], content: 'Not yet, is it fire?', chatId: '2', chat: {} as Chat, createdAt: new Date('2023-06-09T15:35:00') },
    ],
    createdAt: new Date('2023-06-09T15:30:00')
  },
]

export default function FriendMessages() {
  const [friends, setFriends] = useState<User[]>(initialFriends)
  const [chats, setChats] = useState<Chat[]>(initialChats)
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedChat])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && selectedChat) {
      setIsLoading(true)
      setError(null)
      try {
        // Simulating an API call
        await new Promise(resolve => setTimeout(resolve, 500))

        const updatedChats = chats.map(chat => {
          if (chat.id === selectedChat.id) {
            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: (chat.messages.length + 1).toString(),
                  senderId: '1', // Assuming 'You' is the user with id '1'
                  sender: friends.find(f => f.id === '1')!,
                  content: newMessage.trim(),
                  chatId: chat.id,
                  chat: chat,
                  createdAt: new Date()
                }
              ]
            }
          }
          return chat
        })
        setChats(updatedChats)
        setSelectedChat(updatedChats.find(c => c.id === selectedChat.id) || null)
        setNewMessage('')
      } catch (err) {
        setError('Failed to send message. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-lg p-4 h-[600px] flex">
      <div className="w-1/3 border-r border-border pr-4">
        <h2 className="text-2xl font-semibold mb-4">Friends</h2>
        <ul>
          {friends.map(friend => (
            <li
              key={friend.id}
              className={`cursor-pointer p-2 rounded ${selectedChat?.participants.some(p => p.id === friend.id) ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
              onClick={() => setSelectedChat(chats.find(chat => chat.participants.some(p => p.id === friend.id)) || null)}
            >
              {friend.name}
              {chats.find(chat => chat.participants.some(p => p.id === friend.id))?.messages.length > 0 && (
                <span className="ml-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                  {chats.find(chat => chat.participants.some(p => p.id === friend.id))?.messages.length}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/3 pl-4 flex flex-col">
        {selectedChat ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Chat with {selectedChat.participants.map(p => p.name).join(', ')}</h2>
            <div className="flex-grow overflow-y-auto mb-4">
              {selectedChat.messages.map(message => (
                <div key={message.id} className={`mb-2 ${message.senderId === '1' ? 'text-right' : ''}`}>
                  <span className={`inline-block rounded px-2 py-1 ${message.senderId === '1' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    <strong>{message.sender.name}:</strong> {message.content}
                  </span>
                  <div className="text-xs text-muted-foreground mt-1">
                    {message.createdAt.toLocaleString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
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
            {error && <p className="text-destructive mt-2">{error}</p>}
          </>
        ) : (
          <p>Select a friend to start chatting</p>
        )}
      </div>
    </div>
  )
}
