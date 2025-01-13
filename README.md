# Green Hub - Cannabis Community Platform

A professional, privacy-focused community platform for cannabis enthusiasts and businesses. Built with Next.js 14, TypeScript, and MongoDB.

## 🌟 Features

- 🏪 Business Directory with Map Integration
- 👥 User Profiles & Communities
- 💬 Real-time Messaging System
- 📊 Progress Tracking & Achievements
- 🌱 Tolerance Break Management
- 🎨 Dark/Light Theme Support
- 📱 Responsive Design
- 🔒 Privacy-First Architecture

## 🚀 Tech Stack

- **Framework**: Next.js 14.2.16
- **Language**: TypeScript
- **Database**: MongoDB Atlas
- **Authentication**: NextAuth.js
- **UI Components**: Shadcn/UI
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Maps**: React Leaflet
- **Form Handling**: React Hook Form

## 📋 Prerequisites

- Node.js 18+ 
- npm/yarn
- MongoDB Atlas Account
- Vercel Account (for deployment)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/banditofsmoke/greenhub.git
cd greenhub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
cp .env.example .env.local

# Required environment variables
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/green-hub
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Start the development server:
```bash
npm run dev
```

## 🗄️ Project Structure

```
greenhub/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   └── register/
│   │   └── profile/
│   ├── components/
│   │   ├── auth/
│   │   ├── ui/
│   │   ├── UserProgress.tsx
│   │   ├── ToleranceBreak.tsx
│   │   └── HealthyLiving.tsx
│   ├── types/
│   │   └── profile.ts
│   └── providers/
│       └── AuthProvider.tsx
├── prisma/
│   └── schema.prisma
└── public/
```

## 💾 Database Schema

```prisma
model User {
  id             String    @id @default(auto()) @map("_id") @db.ObjectId
  name           String?
  email          String    @unique
  emailVerified  DateTime?
  hashedPassword String
  image          String?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  accounts       Account[]
  messages       Message[]
  badges         Badge[]
  achievements   Achievement[]
  gallery        Gallery[]
  preferences    Preference?
}

// See prisma/schema.prisma for full schema
```

## 🔐 Authentication

Using NextAuth.js with email/password authentication:

```typescript
// app/api/auth/[...nextauth]/route.ts
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Authentication logic
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
```

## 🚀 Deployment

1. Push your code to GitHub
2. Create a new project on Vercel
3. Import your repository
4. Add environment variables:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
   - `DATABASE_URL` (MongoDB connection string)
5. Deploy!

## 🔧 Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Generate Prisma client
npx prisma generate

# Push schema changes to database
npx prisma db push
```

## 🎨 UI Components

Using Shadcn/UI components with custom styling:

```typescript
// Example component with dark mode support
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
  <h2 className="text-2xl font-bold mb-4">Component Title</h2>
  <div className="text-gray-600 dark:text-gray-400">
    Content goes here
  </div>
</div>
```

## 🧪 Feature Components

### Tolerance Break System
```typescript
type BreakOption = {
  days: number
  description: string
  xpReward: number
}

const breakOptions = [
  { days: 3, description: "Reset your sensitivity", xpReward: 100 },
  { days: 7, description: "Clear your mind and body", xpReward: 250 },
  { days: 30, description: "Full detox and mental reset", xpReward: 1000 },
]
```

### User Progress Tracking
```typescript
type UserStats = {
  posts: number
  comments: number
  strains: number
  level: number
  xp: number
  shopVisits: number
}
```

## 📱 Responsive Design

Uses Tailwind CSS breakpoints for responsive design:
- Mobile First: Default styles
- Tablet: md (768px)
- Desktop: lg (1024px)
- Wide: xl (1280px)

## 🔜 Future Improvements

- Email verification system
- Real-time notifications
- Advanced search functionality
- Community moderation tools
- Content recommendation system

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Shadcn for the beautiful UI components
- Vercel for hosting and deployment
- MongoDB Atlas for database services

## 📞 Support

For support, please raise an issue in the GitHub repository or contact the maintainers.

---

Remember to always check for the latest updates and security best practices when deploying to production.