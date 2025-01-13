'use client'

import { useState, useEffect } from 'react'

type BreakOption = {
  days: number
  description: string
  xpReward: number
}

const breakOptions: BreakOption[] = [
  { days: 3, description: "Reset your sensitivity", xpReward: 100 },
  { days: 7, description: "Clear your mind and body", xpReward: 250 },
  { days: 30, description: "Full detox and mental reset", xpReward: 1000 },
]

const motivationalMessages = [
  "Remember, this break is helping your body and mind reset!",
  "Your lungs are thanking you for this break.",
  "Imagine how great that first hit will be after this tolerance break!",
  "You're doing this for a reason - stay strong!",
  "Your willpower is growing stronger every day.",
]

export default function ToleranceBreak() {
  const [selectedBreak, setSelectedBreak] = useState<BreakOption | null>(null)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [lastCheckIn, setLastCheckIn] = useState<Date | null>(null)
  const [streakDays, setStreakDays] = useState(0)

  useEffect(() => {
    const savedBreak = localStorage.getItem('toleranceBreak')
    if (savedBreak) {
      const { option, start, lastCheck, streak } = JSON.parse(savedBreak)
      setSelectedBreak(option)
      setStartDate(new Date(start))
      setLastCheckIn(lastCheck ? new Date(lastCheck) : null)
      setStreakDays(streak)
    }
  }, [])

  useEffect(() => {
    if (selectedBreak && startDate) {
      localStorage.setItem('toleranceBreak', JSON.stringify({
        option: selectedBreak,
        start: startDate,
        lastCheck: lastCheckIn,
        streak: streakDays,
      }))
    }
  }, [selectedBreak, startDate, lastCheckIn, streakDays])

  const handleStartBreak = (option: BreakOption) => {
    setSelectedBreak(option)
    setStartDate(new Date())
    setStreakDays(0)
    setLastCheckIn(null)
  }

  const handleCheckIn = () => {
    const now = new Date()
    if (!lastCheckIn || now.getDate() !== lastCheckIn.getDate()) {
      setLastCheckIn(now)
      setStreakDays(prev => prev + 1)
    }
  }

  const canCheckIn = () => {
    if (!lastCheckIn) return true
    const now = new Date()
    return now.getDate() !== lastCheckIn.getDate()
  }

  const calculateEndDate = () => {
    if (startDate && selectedBreak) {
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + selectedBreak.days)
      return endDate
    }
    return null
  }

  const isBreakCompleted = () => {
    const endDate = calculateEndDate()
    return endDate && new Date() >= endDate
  }

  const getRandomMotivation = () => {
    return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  }

  const handleEndBreak = () => {
    setSelectedBreak(null)
    setStartDate(null)
    setLastCheckIn(null)
    setStreakDays(0)
    localStorage.removeItem('toleranceBreak')
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Tolerance Break</h2>
      <p className="mb-4 text-gray-600 dark:text-gray-400">
        Taking a break can help reset your tolerance and improve your overall well-being.
      </p>
      {!selectedBreak ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {breakOptions.map((option) => (
            <button
              key={option.days}
              onClick={() => handleStartBreak(option)}
              className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 p-4 rounded-lg hover:bg-green-200 dark:hover:bg-green-700 transition-colors"
            >
              <h3 className="font-bold text-lg mb-2">{option.days} Days</h3>
              <p>{option.description}</p>
              <p className="mt-2 text-sm">XP Reward: {option.xpReward}</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-100 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">
            {selectedBreak.days}-Day Break in Progress
          </h3>
          <p className="mb-2">Started on: {startDate?.toLocaleDateString()}</p>
          <p className="mb-2">Ends on: {calculateEndDate()?.toLocaleDateString()}</p>
          <p className="mb-2">Current streak: {streakDays} days</p>
          <div className="mb-4">
            <p className="font-semibold">Daily Check-in:</p>
            <button
              onClick={handleCheckIn}
              disabled={!canCheckIn()}
              className={`mt-2 px-4 py-2 rounded ${
                canCheckIn()
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
              }`}
            >
              {canCheckIn() ? 'Check In' : 'Already Checked In Today'}
            </button>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Motivation:</p>
            <p className="italic">{getRandomMotivation()}</p>
          </div>
          {isBreakCompleted() && (
            <div className="mb-4 bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg">
              <h4 className="font-bold text-yellow-800 dark:text-yellow-100">Break Completed!</h4>
              <p>Congratulations! You've earned {selectedBreak.xpReward} XP.</p>
              <button
                onClick={handleEndBreak}
                className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                End Break and Claim Reward
              </button>
            </div>
          )}
          <button
            onClick={handleEndBreak}
            className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            End Break Early
          </button>
        </div>
      )}
    </div>
  )
}