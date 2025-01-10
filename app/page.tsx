'use client'

import { useState } from 'react'
import { 
  User, 
  Edit, 
  Leaf, 
  Sun, 
  Moon, 
  Coffee, 
  Music, 
  Camera, 
  Book, 
  Sprout, 
  Flame, 
  Cookie 
} from 'lucide-react'
import UserProgress from './components/UserProgress'
import ToleranceBreak from './components/ToleranceBreak'
import HealthyLiving from './components/HealthyLiving'
import type { StonerBadge, UserAchievement, UserGallery, UserPreference } from './types/profile'

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
  { name: 'Chill', icon: Sun },
  { name: 'Sleepy', icon: Moon },
  { name: 'Creative', icon: Music },
  { name: 'Productive', icon: Coffee },
  { name: 'Learning', icon: Book },
  { name: 'Growing', icon: Sprout },
  { name: 'Cooking', icon: Cookie },
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
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: 'CannabisEnthusiast420',
    avatar: '/placeholder.svg',
    bio: 'Just a chill person enjoying life and nature.',
    favoriteStrain: 'Blue Dream',
    theme: themes[0],
    mood: moods[0],
    stonerScore: 420,
    badges: [consumptionBadges[0], consumptionBadges[2]], // User's selected badges
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

  const handleEdit = () => {
    setEditing(!editing)
  }

  const handleSave = () => {
    setEditing(false)
    setProfile(prev => ({
      ...prev,
      badges: selectedBadges
    }))
    // Here you would typically save the profile to your backend
    console.log('Saving profile:', profile)
  }

  const handleBadgeToggle = (badge: StonerBadge) => {
    if (selectedBadges.find(b => b.id === badge.id)) {
      setSelectedBadges(prev => prev.filter(b => b.id !== badge.id))
    } else if (selectedBadges.length < 3) {
      setSelectedBadges(prev => [...prev, badge])
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you'd upload to your storage service
      const imageUrl = URL.createObjectURL(file)
      setProfile(prev => ({
        ...prev,
        gallery: [
          ...prev.gallery,
          {
            id: Date.now().toString(),
            category: 'general',
            image: imageUrl,
            title: 'New Upload',
            description: '',
            isPrivate: false
          }
        ]
      }))
    }
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
          <UserProgress />
          <ToleranceBreak />
          <div className="lg:col-span-2">
            <HealthyLiving />
          </div>
        </div>
      </div>
    </div>
  )
}