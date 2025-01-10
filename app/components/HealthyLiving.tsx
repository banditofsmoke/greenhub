'use client'

import { useState } from 'react'
import { Heart, Brain, Zap, Coffee } from 'lucide-react'

type HealthTip = {
  icon: React.ElementType
  title: string
  description: string
}

const healthTips: HealthTip[] = [
  {
    icon: Heart,
    title: "Exercise Regularly",
    description: "Aim for at least 30 minutes of moderate exercise daily to improve overall health and reduce stress."
  },
  {
    icon: Brain,
    title: "Practice Mindfulness",
    description: "Incorporate meditation or deep breathing exercises into your routine to enhance mental clarity and reduce anxiety."
  },
  {
    icon: Zap,
    title: "Balanced Diet",
    description: "Eat a variety of fruits, vegetables, whole grains, and lean proteins to support your body's natural functions."
  },
  {
    icon: Coffee,
    title: "Stay Hydrated",
    description: "Drink plenty of water throughout the day to maintain proper bodily functions and improve energy levels."
  }
]

export default function HealthyLiving() {
  const [expandedTip, setExpandedTip] = useState<number | null>(null)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Healthy Living Tips</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Incorporate these practices into your lifestyle for a balanced and healthier you.
      </p>
      <div className="space-y-4">
        {healthTips.map((tip, index) => (
          <div 
            key={index}
            className="bg-blue-100 dark:bg-blue-800 p-4 rounded-lg cursor-pointer"
            onClick={() => setExpandedTip(expandedTip === index ? null : index)}
          >
            <div className="flex items-center">
              <tip.icon className="text-blue-500 mr-2" size={24} />
              <h3 className="font-bold">{tip.title}</h3>
            </div>
            {expandedTip === index && (
              <p className="mt-2 text-gray-700 dark:text-gray-300">{tip.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}