export type StonerBadge = {
    id: string
    name: string
    icon: string
    description: string
    category: 'consumption' | 'experience' | 'culinary' | 'growing'
  }
  
  export type UserAchievement = {
    id: string
    name: string
    description: string
    dateEarned: Date
    icon: string
  }
  
  export type UserGallery = {
    id: string
    category: 'grows' | 'pieces' | 'food' | 'rolls' | 'general'
    image: string
    title: string
    description: string
    isPrivate: boolean
  }
  
  export type UserPreference = {
    favoriteStrains: string[]
    preferredMethods: string[]
    growExperience: 'none' | 'beginner' | 'intermediate' | 'expert'
    cookingInterest: boolean
    privacyLevel: 'public' | 'friends' | 'private'
  }