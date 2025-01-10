'use client'

import { useState, useEffect } from 'react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

const AnalyticsDashboard = () => {
  const [data, setData] = useState([
    { name: 'Mon', visits: 0, posts: 0, interactions: 0 },
    { name: 'Tue', visits: 0, posts: 0, interactions: 0 },
    { name: 'Wed', visits: 0, posts: 0, interactions: 0 },
    { name: 'Thu', visits: 0, posts: 0, interactions: 0 },
    { name: 'Fri', visits: 0, posts: 0, interactions: 0 },
    { name: 'Sat', visits: 0, posts: 0, interactions: 0 },
    { name: 'Sun', visits: 0, posts: 0, interactions: 0 },
  ])

  useEffect(() => {
    // Simulating data updates
    const interval = setInterval(() => {
      setData(prevData =>
        prevData.map(day => ({
          ...day,
          visits: Math.max(0, day.visits + Math.floor(Math.random() * 100 - 20)),
          posts: Math.max(0, day.posts + Math.floor(Math.random() * 50 - 10)),
          interactions: Math.max(0, day.interactions + Math.floor(Math.random() * 200 - 40)),
        }))
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Weekly Activity</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="visits" fill="#8884d8" name="Visits" />
          <Bar dataKey="posts" fill="#82ca9d" name="Posts" />
          <Bar dataKey="interactions" fill="#ffc658" name="Interactions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AnalyticsDashboard

