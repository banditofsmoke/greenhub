'use client'

import { useState } from 'react'
import { AlertTriangle, ChevronRight, ChevronLeft } from 'lucide-react'

const LegalSidebar = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside className={`transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-10'} bg-card text-card-foreground rounded-l-lg shadow-md relative`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -left-3 top-1/2 transform -translate-y-1/2 bg-primary text-primary-foreground p-1 rounded-full shadow-md"
      >
        {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
      <div className={`p-4 ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        <h2 className="text-lg font-semibold mb-4">Important Notices</h2>
        <div className="space-y-4">
          <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-md">
            <div className="flex items-center mb-2">
              <AlertTriangle className="text-yellow-700 dark:text-yellow-500 mr-2" size={20} />
              <h3 className="font-semibold">Legal Compliance</h3>
            </div>
            <p className="text-sm">Always follow local laws and regulations regarding cannabis use and possession.</p>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-md">
            <div className="flex items-center mb-2">
              <AlertTriangle className="text-blue-700 dark:text-blue-500 mr-2" size={20} />
              <h3 className="font-semibold">Privacy First</h3>
            </div>
            <p className="text-sm">We prioritize your privacy. Adjust your settings in the user panel.</p>
          </div>
          <div className="bg-green-100 dark:bg-green-800 p-3 rounded-md">
            <div className="flex items-center mb-2">
              <AlertTriangle className="text-green-700 dark:text-green-500 mr-2" size={20} />
              <h3 className="font-semibold">Community Guidelines</h3>
            </div>
            <p className="text-sm">Please review and follow our community guidelines for a positive experience.</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default LegalSidebar

