'use client'

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

export default function Home() {
  const [onlineUsers, setOnlineUsers] = useState(1);

  // Only randomize online users count
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 10) + 1); // 1-10 users
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1218] dark:bg-[#0f1218] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Stats Widget */}
        <Card className="bg-[#1a1f2b] dark:bg-[#1a1f2b] shadow-xl p-4 mb-6 rounded-lg border-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-2">
              <div className="text-sm text-gray-400 mb-1">Online Now</div>
              <div className="text-2xl font-bold text-[#22c55e]">{onlineUsers}</div>
            </div>
            <div className="text-center p-2">
              <div className="text-sm text-gray-400 mb-1">Total Posts</div>
              <div className="text-2xl font-bold text-[#22c55e]">0</div>
            </div>
            <div className="text-center p-2">
              <div className="text-sm text-gray-400 mb-1">Members</div>
              <div className="text-2xl font-bold text-[#22c55e]">7</div>
            </div>
            <div className="text-center p-2">
              <div className="text-sm text-gray-400 mb-1">Dispensaries</div>
              <div className="text-2xl font-bold text-[#22c55e]">4</div>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1f2b] dark:bg-[#1a1f2b] shadow-xl p-8 rounded-lg border-0">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-[#22c55e] mb-4">Welcome to Green Hub</h1>
            <p className="text-gray-300 mb-4">
              A new professional platform designed exclusively for South African cannabis enthusiasts, 
              dispensaries, and community clubs. Supporting your constitutional right while building a 
              safe, informed, and engaging space for our local cannabis community.
            </p>
            <p className="text-gray-300">
              Note: This platform is strictly for users 18 years and older.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-[#22c55e] mb-3">Community Features</h2>
              <ul className="space-y-2 text-gray-300">
                <li>• Track your cannabis journey</li>
                <li>• Connect with local enthusiasts</li>
                <li>• Earn achievement badges</li>
                <li>• Share experiences safely</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#22c55e] mb-3">Dispensary Directory</h2>
              <ul className="space-y-2 text-gray-300">
                <li>• Find local dispensaries</li>
                <li>• Join cannabis communities</li>
                <li>• Browse available products</li>
                <li>• Port Elizabeth area and expanding</li>
              </ul>
            </div>
          </div>

          <Card className="bg-[#141821] dark:bg-[#141821] p-6 rounded-lg border-0">
            <h2 className="text-xl font-semibold text-[#22c55e] mb-3">Join Our Community</h2>
            <p className="text-gray-300">
              Be part of South Africa's growing cannabis community. We're creating a safer, more informed space 
              for enthusiasts and dispensaries to connect. Join us in building a responsible, 
              privacy-focused platform that respects your constitutional rights while fostering a 
              knowledgeable cannabis culture.
            </p>
          </Card>
        </Card>
      </div>
    </div>
  );
}
