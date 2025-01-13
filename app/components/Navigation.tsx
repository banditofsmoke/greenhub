// Navigation.tsx
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import {
  Menu,
  X,
  Sun,
  Moon,
  User,
  Users,
  MessageSquare,
  Home,
  Search,
  Hash,
  Scale,
  Info,
  LogOut,
  LogIn,
  UserPlus,
} from '../components/providers'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const router = useRouter()

  const publicNavItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Directory', href: '/directory', icon: Search },
    { name: 'About', href: '/about', icon: Info },
  ]

  const protectedNavItems = [
    { name: 'Community Feed', href: '/community', icon: Hash },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Friends', href: '/friends', icon: Users },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Local Laws', href: '/local-laws', icon: Scale },
  ]

  const authNavItems = session ? [
    ...publicNavItems,
    ...protectedNavItems,
  ] : publicNavItems

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
  }

  const renderAuthButtons = () => {
    if (session) {
      return (
        <button
          onClick={handleSignOut}
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </button>
      )
    }

    return (
      <>
        <Link
          href="/sign-in"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="flex items-center px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Sign Up
        </Link>
      </>
    )
  }

  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-bold text-xl text-primary">Green Hub</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {authNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
                  }`}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              ))}
              {renderAuthButtons()}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {authNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-secondary-foreground'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="mr-2 h-5 w-5" />
                {item.name}
              </Link>
            ))}
            {session ? (
              <button
                onClick={() => {
                  handleSignOut()
                  setIsOpen(false)
                }}
                className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium bg-primary text-primary-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  Sign Up
                </Link>
              </>
            )}
            <button
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark')
                setIsOpen(false)
              }}
              className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            >
              {theme === 'dark' ? <Sun className="mr-2 h-5 w-5" /> : <Moon className="mr-2 h-5 w-5" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation