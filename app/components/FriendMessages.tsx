// For FriendMessages.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { Send, ChevronRight, ChevronLeft } from '../components/providers';

type Message = {
  id: number
  sender: string
  content: string
  timestamp: Date
}

type Friend = {
  id: number
  name: string
  messages: Message[]
}

const initialFriends: Friend[] = [
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

export default function FriendMessages() {
  const [friends, setFriends] = useState<Friend[]>(initialFriends)
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedFriend])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && selectedFriend) {
      setIsLoading(true)
      setError(null)
      try {
        // Simulating an API call
        await new Promise(resolve => setTimeout(resolve, 500))

        const updatedFriends = friends.map(friend => {
          if (friend.id === selectedFriend.id) {
            return {
              ...friend,
              messages: [
                ...friend.messages,
                {
                  id: friend.messages.length + 1,
                  sender: 'You',
                  content: newMessage.trim(),
                  timestamp: new Date()
                }
              ]
            }
          }
          return friend
        })
        setFriends(updatedFriends)
        setSelectedFriend(updatedFriends.find(f => f.id === selectedFriend.id) || null)
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
              className={`cursor-pointer p-2 rounded ${selectedFriend?.id === friend.id ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
              onClick={() => setSelectedFriend(friend)}
            >
              {friend.name}
              {friend.messages.length > 0 && (
                <span className="ml-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                  {friend.messages.length}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/3 pl-4 flex flex-col">
        {selectedFriend ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">Chat with {selectedFriend.name}</h2>
            <div className="flex-grow overflow-y-auto mb-4">
              {selectedFriend.messages.map(message => (
                <div key={message.id} className={`mb-2 ${message.sender === 'You' ? 'text-right' : ''}`}>
                  <span className={`inline-block rounded px-2 py-1 ${message.sender === 'You' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                    <strong>{message.sender}:</strong> {message.content}
                  </span>
                  <div className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleString()}
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

