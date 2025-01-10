'use client'

import { useState, useEffect } from 'react'
import { User, UserPlus, UserMinus, MessageSquare, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

type Friend = {
  id: number
  name: string
  status: 'online' | 'offline'
}

type FriendRequest = {
  id: number
  name: string
}

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Simulating API calls
        await new Promise(resolve => setTimeout(resolve, 1000))
        setFriends([
          { id: 1, name: 'BlazeRunner', status: 'online' },
          { id: 2, name: 'ChronicChiller', status: 'offline' },
          { id: 3, name: 'HerbEnthusiast', status: 'online' },
        ])
        setFriendRequests([
          { id: 4, name: 'GreenThumb420' },
          { id: 5, name: 'CannaConnoisseur' },
        ])
      } catch (err) {
        setError('Failed to load friends and requests. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleAcceptFriend = async (id: number) => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500))
      const newFriend = friendRequests.find(request => request.id === id)
      if (newFriend) {
        setFriends([...friends, { ...newFriend, status: 'online' }])
        setFriendRequests(friendRequests.filter(request => request.id !== id))
      }
    } catch (err) {
      setError('Failed to accept friend request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRejectFriend = async (id: number) => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setFriendRequests(friendRequests.filter(request => request.id !== id))
    } catch (err) {
      setError('Failed to reject friend request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnfriend = async (id: number) => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setFriends(friends.filter(friend => friend.id !== id))
    } catch (err) {
      setError('Failed to unfriend. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBlock = async (id: number) => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setFriends(friends.filter(friend => friend.id !== id))
    } catch (err) {
      setError('Failed to block user. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReport = async (id: number) => {
    setIsLoading(true)
    setError(null)
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 500))
      alert(`User reported. We'll review this case.`)
    } catch (err) {
      setError('Failed to report user. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && friends.length === 0 && friendRequests.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error && friends.length === 0 && friendRequests.length === 0) {
    return <div className="text-destructive text-center">{error}</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>
      
      <div className="mb-8 bg-card text-card-foreground rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Friend Requests</h2>
        {friendRequests.length === 0 ? (
          <p>No pending friend requests.</p>
        ) : (
          <ul className="space-y-4">
            {friendRequests.map(request => (
              <li key={request.id} className="flex items-center justify-between bg-secondary p-4 rounded-lg">
                <div className="flex items-center">
                  <User className="mr-2" />
                  <span>{request.name}</span>
                </div>
                <div>
                  <button 
                    onClick={() => handleAcceptFriend(request.id)} 
                    className="bg-primary text-primary-foreground px-3 py-1 rounded mr-2"
                    disabled={isLoading}
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleRejectFriend(request.id)} 
                    className="bg-destructive text-destructive-foreground px-3 py-1 rounded hover:bg-destructive/90"
                    disabled={isLoading}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="mb-8 bg-card text-card-foreground rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Friends</h2>
        <ul className="space-y-4">
          {friends.map(friend => (
            <li key={friend.id} className="flex items-center justify-between bg-secondary p-4 rounded-lg">
              <div className="flex items-center">
                <User className="mr-2" />
                <span>{friend.name}</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${friend.status === 'online' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                  {friend.status}
                </span>
              </div>
              <div>
                <Link href={`/messages?friend=${friend.id}`} className="text-blue-500 hover:text-blue-700 mr-2">
                  <MessageSquare size={20} />
                </Link>
                <button 
                  onClick={() => handleUnfriend(friend.id)} 
                  className="text-destructive hover:text-destructive/90 mr-2"
                  disabled={isLoading}
                >
                  <UserMinus size={20} />
                </button>
                <button 
                  onClick={() => handleBlock(friend.id)} 
                  className="text-muted-foreground hover:text-foreground mr-2"
                  disabled={isLoading}
                >
                  Block
                </button>
                <button 
                  onClick={() => handleReport(friend.id)} 
                  className="text-yellow-500 hover:text-yellow-600"
                  disabled={isLoading}
                >
                  <AlertTriangle size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {error && <p className="text-destructive mt-2">{error}</p>}
    </div>
  )
}

