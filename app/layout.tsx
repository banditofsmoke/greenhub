import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from './components/Navigation'
import LegalSidebar from './components/LegalSidebar'
import { ThemeProvider } from './components/ThemeProvider'
import { ToastProvider } from './contexts/ToastContext'
import FloatingActionButton from './components/FloatingActionButton'
import AuthProvider from './providers/AuthProvider'
import 'leaflet/dist/leaflet.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Green Hub',
  description: 'A professional and privacy-focused community for cannabis enthusiasts and businesses',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""/>
      </head>
      <body className={`${inter.className} text-foreground bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <ToastProvider>
              <div className="flex flex-col min-h-screen">
                <Navigation />
                <div className="flex-grow flex">
                  <main className="flex-grow p-4 md:p-6 fade-in">{children}</main>
                  <LegalSidebar />
                </div>
                <FloatingActionButton />
              </div>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}