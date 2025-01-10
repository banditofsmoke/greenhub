'use client'

import { useState, useEffect } from 'react'
import { Star, MessageSquare, Leaf, Award, ShoppingBag } from 'lucide-react'

type UserStats = {
  posts: number
  comments: number
  strains: number
  level: number
  xp: number
  shopVisits: number
}

export default function UserProgress() {
  const [stats, setStats] = useState<UserStats>({
    posts: 0,
    comments: 0,
    strains: 0,
    level: 1,
    xp: 0,
    shopVisits: 0,
  })

  useEffect(() => {
    // In a real app, you'd fetch this data from your API
    const fetchStats = async () => {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStats({
        posts: 0,
        comments: 0,
        strains: 0,
        level: 1,
        xp: 0,
        shopVisits: 0,
      })
    }
    fetchStats()
  }, [])

  const nextLevelXP = 100 // Set a fixed XP requirement for the next level

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <MessageSquare className="text-green-500 mr-2" />
          <span>Posts: {stats.posts}</span>
        </div>
        <div className="flex items-center">
          <MessageSquare className="text-blue-500 mr-2" />
          <span>Comments: {stats.comments}</span>
        </div>
        <div className="flex items-center">
          <Leaf className="text-purple-500 mr-2" />
          <span>Strains Reviewed: {stats.strains}</span>
        </div>
        <div className="flex items-center">
          <ShoppingBag className="text-yellow-500 mr-2" />
          <span>Shop Visits: {stats.shopVisits}</span>
        </div>
        <div className="flex items-center">
          <Star className="text-yellow-500 mr-2" />
          <span>Level: {stats.level}</span>
        </div>
      </div>
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>XP: {stats.xp}</span>
          <span>{nextLevelXP} XP needed for next level</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
          <div 
            className="bg-green-600 h-2.5 rounded-full"
            style={{ width: `${Math.min((stats.xp / nextLevelXP) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Keep posting, commenting, reviewing strains, and visiting shops to level up!
      </div>
    </div>
  )
}