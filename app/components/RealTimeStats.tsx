'use client'

import { useState, useEffect } from 'react'
import { Users, Building, Group, ShoppingBag } from 'lucide-react'

const RealTimeStats = () => {
  const [stats, setStats] = useState({
    users: 0,
    clubs: 0,
    groups: 0,
    shops: 0,
  })

  useEffect(() => {
    // Simulating real-time updates
    const interval = setInterval(() => {
      setStats(prevStats => ({
        users: prevStats.users + Math.floor(Math.random() * 5),
        clubs: prevStats.clubs + Math.floor(Math.random() * 2),
        groups: prevStats.groups + Math.floor(Math.random() * 3),
        shops: prevStats.shops + Math.floor(Math.random() * 1),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-card p-4 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold">{stats.users.toLocaleString()}</p>
        </div>
        <Users className="text-primary w-8 h-8" />
      </div>
      <div className="bg-card p-4 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Listed Clubs</p>
          <p className="text-2xl font-bold">{stats.clubs.toLocaleString()}</p>
        </div>
        <Building className="text-primary w-8 h-8" />
      </div>
      <div className="bg-card p-4 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Active Groups</p>
          <p className="text-2xl font-bold">{stats.groups.toLocaleString()}</p>
        </div>
        <Group className="text-primary w-8 h-8" />
      </div>
      <div className="bg-card p-4 rounded-lg shadow-md flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Verified Shops</p>
          <p className="text-2xl font-bold">{stats.shops.toLocaleString()}</p>
        </div>
        <ShoppingBag className="text-primary w-8 h-8" />
      </div>
    </div>
  )
}

export default RealTimeStats

