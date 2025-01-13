/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    domains: [], // We'll add domains as needed
  },
  env:
  {
    env: {  
      NEXT_PUBLIC_SEB: process.env.NEXT_PUBLIC_SEB, 
      NEXTAUTH_URL: process.env.NEXTAUTH_URL, 
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      DATABASE_URL: process.env.DATABASE_URL,

    }
    
  },
  // Temporarily disable experimental features to test
  // experimental: {
  //   webpackBuildWorker: true,
  //   parallelServerBuildTraces: true,
  //   parallelServerCompiles: true,
  // },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; img-src 'self' data: blob:; style-src 'self' 'unsafe-inline'"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ],
      },
    ]
  }
}

export default nextConfig