'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useToast } from '../contexts/ToastContext'
import UserProgress from '../components/UserProgress'
import ToleranceBreak from '../components/ToleranceBreak'
import HealthyLiving from '../components/HealthyLiving'
import type { StonerBadge, UserAchievement, UserGallery, UserPreference } from '../types/profile'

const consumptionBadges: StonerBadge[] = [
  { id: '1', name: 'Bong Master', icon: '🌊', description: 'Prefers water filtration', category: 'consumption' },
  { id: '2', name: 'Joint Artist', icon: '🎨', description: 'Rolling expertise', category: 'consumption' },
  { id: '3', name: 'Dab King', icon: '💎', description: 'Concentrate connoisseur', category: 'consumption' },
  { id: '4', name: 'Edibles Chef', icon: '👨‍🍳', description: 'Culinary cannabis expert', category: 'culinary' },
]

const themes = [
  { name: 'Default', class: 'bg-white dark:bg-gray-900' },
  { name: 'Haze Purple', class: 'bg-purple-100 dark:bg-purple-900' },
  { name: 'Mellow Yellow', class: 'bg-yellow-100 dark:bg-yellow-900' },
  { name: 'Green Dream', class: 'bg-green-100 dark:bg-green-900' },
]

const moods = [
  { name: 'Chill', icon: '☀️' },
  { name: 'Sleepy', icon: '🌙' },
  { name: 'Creative', icon: '🎵' },
  { name: 'Productive', icon: '☕' },
  { name: 'Learning', icon: '📚' },
  { name: 'Growing', icon: '🌱' },
  { name: 'Cooking', icon: '🍪' },
]

const achievements: UserAchievement[] = [
  {
    id: '1',
    name: 'Growth Master',
    description: 'Successfully completed first grow',
    dateEarned: new Date('2024-01-01'),
    icon: '🌱'
  },
  {
    id: '2',
    name: 'Recipe Creator',
    description: 'Shared 10 original recipes',
    dateEarned: new Date('2024-01-05'),
    icon: '🍪'
  }
]

export default function Profile() {
  const { data: session } = useSession()
  const { showToast } = useToast()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    name: 'CannabisEnthusiast420',
    avatar: '/placeholder.svg',
    bio: 'Just a chill person enjoying life and nature.',
    favoriteStrain: 'Blue Dream',
    theme: themes[0],
    mood: moods[0],
    stonerScore: 420,
    badges: [consumptionBadges[0], consumptionBadges[2]],
    achievements: achievements,
    preferences: {
      favoriteStrains: ['Blue Dream', 'Northern Lights', 'Girl Scout Cookies'],
      preferredMethods: ['bong', 'joint'],
      growExperience: 'intermediate' as const,
      cookingInterest: true,
      privacyLevel: 'public' as const
    } as UserPreference,
    gallery: [] as UserGallery[]
  })
  const [selectedBadges, setSelectedBadges] = useState<StonerBadge[]>(profile.badges)
  const [tempMood, setTempMood] = useState<typeof moods[0] | null>(null)

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) throw new Error('Failed to fetch profile')
      
      const data = await response.json()
      if (data) {
        setProfile(prev => ({
          ...prev,
          ...data,
          preferences: data.preferences || prev.preferences
        }))
        setSelectedBadges(data.badges || [])
      }
    } catch (error) {
      showToast('Failed to load profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setEditing(!editing)
    if (!editing) {
      // Reset changes if canceling
      fetchProfile()
    }
  }

  const handleSave = async () => {
    try {
      const dataToSend = {
        name: profile.name,
        bio: profile.bio,
        preferences: profile.preferences,
        badges: selectedBadges.map(badge => badge.id)
      }

      console.log('Saving profile data:', dataToSend)

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      })

      if (!response.ok) throw new Error('Failed to update profile')

      const updatedData = await response.json()
      setProfile(prev => ({
        ...prev,
        ...updatedData,
        preferences: updatedData.preferences || prev.preferences
      }))
      setEditing(false)
      showToast('Profile updated successfully', 'success')
    } catch (error) {
      showToast('Failed to update profile', 'error')
      console.error('Save error:', error)
    }
  }

  const handleBadgeToggle = (badge: StonerBadge) => {
    if (selectedBadges.find(b => b.id === badge.id)) {
      setSelectedBadges(prev => prev.filter(b => b.id !== badge.id))
    } else if (selectedBadges.length < 3) {
      setSelectedBadges(prev => [...prev, badge])
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className={`min-h-screen p-8 ${profile.theme.class}`}>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <button onClick={handleEdit} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600">
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Badges Section */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Your Badges</h3>
            <div className="flex flex-wrap gap-2">
              {editing ? (
                consumptionBadges.map(badge => (
                  <button
                    key={badge.id}
                    onClick={() => handleBadgeToggle(badge)}
                    className={`p-2 rounded-lg flex items-center ${
                      selectedBadges.find(b => b.id === badge.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <span className="mr-2">{badge.icon}</span>
                    {badge.name}
                  </button>
                ))
              ) : (
                profile.badges.map(badge => (
                  <div key={badge.id} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center">
                    <span className="mr-2">{badge.icon}</span>
                    {badge.name}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2 border rounded dark:bg-gray-700"
                    />
                  ) : (
                    <p>{profile.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bio</label>
                  {editing ? (
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full p-2 border rounded dark:bg-gray-700"
                      rows={3}
                    />
                  ) : (
                    <p>{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <h3 className="font-semibold mb-2">Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Favorite Strains</label>
                  {editing ? (
                    <input
                      type="text"
                      value={profile.preferences.favoriteStrains.join(', ')}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          favoriteStrains: e.target.value.split(',').map(s => s.trim())
                        }
                      }))}
                      className="w-full p-2 border rounded dark:bg-gray-700"
                    />
                  ) : (
                    <p>{profile.preferences.favoriteStrains.join(', ')}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Growing Experience</label>
                  {editing ? (
                    <select
                      value={profile.preferences.growExperience}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        preferences: {
                          ...prev.preferences,
                          growExperience: e.target.value as UserPreference['growExperience']
                        }
                      }))}
                      className="w-full p-2 border rounded dark:bg-gray-700"
                    >
                      <option value="none">None</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>
                  ) : (
                    <p className="capitalize">{profile.preferences.growExperience}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          {editing && (
            <button
              onClick={handleSave}
              className="mt-6 bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* Additional Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ToleranceBreak />
          <UserProgress />
          <div className="lg:col-span-2">
            <HealthyLiving />
          </div>
        </div>
      </div>
    </div>
  )
}