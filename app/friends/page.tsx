// app/friends/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { User, UserPlus, UserMinus, MessageSquare, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { useSocket } from '../hooks/useSocket';
import { useSession } from 'next-auth/react'
import { useApi } from '../hooks/useApi'
import { useToast } from '../../hooks/use-toast';

type Friend = {
  id: string
  user: {
    id: string
    name: string
    lastSeen: Date
  }
  friend: {
    id: string
    name: string
    lastSeen: Date
  }
  status: string
}

export default function FriendsPage() {
  const { data: session } = useSession()
  const socket = useSocket()
  const { toast } = useToast()
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<Friend[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const { execute } = useApi<Friend[]>()

  useEffect(() => {
    if (session?.user) {
      fetchFriends()
      
      if (socket) {
        socket.on('friend_request', handleNewFriendRequest)
        socket.on('friend_status', handleFriendStatusChange)
        
        return () => {
          socket.off('friend_request', handleNewFriendRequest)
          socket.off('friend_status', handleFriendStatusChange)
        }
      }
    }
  }, [session, socket])

  const handleNewFriendRequest = (data: Friend) => {
    setFriendRequests(prev => [...prev, data])
    toast({
      title: 'New Friend Request',
      description: `${data.user.name} sent you a friend request`
    })
  }

  const handleFriendStatusChange = (data: { userId: string; status: string }) => {
    setFriends(prev => prev.map(friend => {
      if (friend.friend.id === data.userId || friend.user.id === data.userId) {
        return { ...friend, status: data.status }
      }
      return friend
    }))
  }

  const fetchFriends = async () => {
    try {
      const response = await execute(fetch('/api/friends').then(res => res.json()))
      const allFriends = response || []
      setFriends(allFriends.filter(f => f.status === 'accepted'))
      setFriendRequests(allFriends.filter(f => f.status === 'pending'))
      setIsLoading(false)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load friends',
        variant: 'destructive'
      })
      setIsLoading(false)
    }
  }

  const handleFriendAction = async (friendId: string, action: string) => {
    try {
      await execute(fetch('/api/friends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ friendId, action })
      }).then(res => res.json()))

      if (action === 'unfriend' || action === 'reject') {
        setFriends(prev => prev.filter(f => 
          f.friend.id !== friendId && f.user.id !== friendId
        ))
        setFriendRequests(prev => prev.filter(f => 
          f.friend.id !== friendId && f.user.id !== friendId
        ))
      } else if (action === 'accept') {
        setFriendRequests(prev => prev.filter(f => 
          f.friend.id !== friendId && f.user.id !== friendId
        ))
        fetchFriends() // Refresh the friends list
      }

      toast({
        title: 'Success',
        description: `Friend ${action} successful`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} friend`,
        variant: 'destructive'
      })
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    try {
      const response = await execute(fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`).then(res => res.json()))
      // Handle search results
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to search users',
        variant: 'destructive'
      })
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Friends</h1>
      
      {/* Search Users */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="flex-grow p-2 rounded-md border border-border"
          />
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
          >
            Search
          </button>
        </form>
      </div>
      
      {/* Friend Requests */}
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
                  <span>{request.user.id === session?.user?.id ? request.friend.name : request.user.name}</span>
                </div>
                <div>
                  <button 
                    onClick={() => handleFriendAction(request.friend.id, 'accept')} 
                    className="bg-primary text-primary-foreground px-3 py-1 rounded mr-2"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleFriendAction(request.friend.id, 'reject')} 
                    className="bg-destructive text-destructive-foreground px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Friends List */}
      <div className="mb-8 bg-card text-card-foreground rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Friends</h2>
        {friends.length === 0 ? (
          <p>No friends yet. Use the search above to find friends!</p>
        ) : (
          <ul className="space-y-4">
            {friends.map(friend => {
              const friendData = friend.user.id === session?.user?.id ? friend.friend : friend.user
              const isOnline = new Date(friendData.lastSeen).getTime() > Date.now() - 5 * 60 * 1000 // 5 minutes threshold
              
              return (
                <li key={friend.id} className="flex items-center justify-between bg-secondary p-4 rounded-lg">
                  <div className="flex items-center">
                    <User className="mr-2" />
                    <span>{friendData.name}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${isOnline ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'}`}>
                      {isOnline ? 'online' : 'offline'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/messages?friendId=${friendData.id}`}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <MessageSquare size={20} />
                    </Link>
                    <button 
                      onClick={() => handleFriendAction(friendData.id, 'unfriend')} 
                      className="text-destructive hover:text-destructive/90"
                    >
                      <UserMinus size={20} />
                    </button>
                    <button 
                      onClick={() => handleFriendAction(friendData.id, 'block')} 
                      className="text-muted-foreground hover:text-foreground"
                    >
                      Block
                    </button>
                    <button 
                      onClick={() => handleFriendAction(friendData.id, 'report')} 
                      className="text-yellow-500 hover:text-yellow-600"
                    >
                      <AlertTriangle size={20} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}