'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Clock, Tag, Phone, Mail, CheckCircle, Globe, Info, CheckIcon as CheckIn } from 'lucide-react'
import dynamic from 'next/dynamic'
import { MapContainer as Map, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { motion } from 'framer-motion'

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), {
  ssr: false,
})

type Business = {
  id: number
  name: string
  type: string
  location: string
  hours: string
  tags: string[]
  phone: string
  email: string
  verified: boolean
  description: string
  latitude: number
  longitude: number
}

const businesses: Business[] = [
  {
    id: 1,
    name: 'Greenertopia',
    type: 'Cannabis Store',
    location: 'Port Elizabeth',
    hours: '9AM - 9PM',
    tags: ['Cannabis Products', 'Accessories', 'Clothing'],
    phone: '+27 XX XXX XXXX',
    email: 'info@greenertopia.com',
    verified: true,
    description: 'Your ultimate cannabis haven in the heart of Port Elizabeth! We offer a wide range of cannabis products, accessories, and cool merchandise.',
    latitude: -33.9249,
    longitude: 18.4241,
  },
  {
    id: 2,
    name: 'The Pottery',
    type: 'Cannabis Social Club',
    location: '27 10th Avenue, Walmer, Port Elizabeth',
    hours: 'Members Only',
    tags: ['Social Club', 'Education', 'Events'],
    phone: '+27 XX XXX XXXX',
    email: 'membership@thepottery.co.za',
    verified: true,
    description: 'A 420-friendly cannabis social club providing a safe and welcoming environment for cannabis enthusiasts.',
    latitude: -33.95,
    longitude: 18.45,
  },
  {
    id: 3,
    name: 'Little Jamaica',
    type: 'Headshop',
    location: 'Port Elizabeth',
    hours: '10AM - 6PM',
    tags: ['Accessories', 'Rasta Clothing', 'Smoking Paraphernalia'],
    phone: '+27 83 334 4279',
    email: 'liljamaica33@gmail.com',
    verified: true,
    description: 'Offering a wide range of bongs, pipes, Rasta clothing and accessories, and smoking paraphernalia.',
    latitude: -33.9,
    longitude: 18.5,
  },
  {
    id: 4,
    name: 'Dazed & Blazed',
    type: 'Cannabis Store',
    location: 'Newton Park, Port Elizabeth',
    hours: '9AM - 7PM',
    tags: ['Premium Flowers', 'Concentrates', 'Edibles', 'Topicals', 'Accessories'],
    phone: '+27 63 275 8005',
    email: 'info@dazedandblazed.co.za',
    verified: true,
    description: 'A premium cannabis shop offering a personalized and educational experience with a wide range of products and accessories.',
    latitude: -33.97,
    longitude: 18.4,
  },
]

const handleShopVisit = (businessId: number) => {
  // In a real app, you'd call an API to record the visit and update user XP
  console.log(`Visited shop with ID: ${businessId}`)
  alert('You\'ve checked in and earned 10 XP!')
}

export default function Directory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [activeBusinessId, setActiveBusinessId] = useState<number | null>(null)

  const portElizabethCoords: [number, number] = [-33.9608, 25.6022]

  const filteredBusinesses = businesses.filter(business =>
    (business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
    (selectedTag === '' || business.tags.includes(selectedTag))
  )

  const allTags = Array.from(new Set(businesses.flatMap(business => business.tags)))

  useEffect(() => {
    // const handleScroll = () => {
    //   const scrollPosition = window.scrollY + window.innerHeight
    //   filteredBusinesses.forEach(business => {
    //     const element = document.getElementById(`business-${business.id}`)
    //     if (element && scrollPosition > element.offsetTop + 100) {
    //       setActiveBusinessId(business.id)
    //     }
    //   })
    // }

    // window.addEventListener('scroll', handleScroll)
    // return () => window.removeEventListener('scroll', handleScroll)
  }, [filteredBusinesses])

  return (
    <div className="max-w-6xl mx-auto">
      <motion.h1 
        className="text-4xl font-bold mb-6 text-green-600"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Cannabis Business Directory
      </motion.h1>
      <motion.div 
        className="mb-6 flex flex-col md:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search businesses..."
            className="w-full p-2 pl-10 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 transition-all duration-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <select
          className="p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-green-500 transition-all duration-300"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="">All Categories</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </motion.div>
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* <Map center={portElizabethCoords} zoom={12} style={{ height: '400px', width: '100%', borderRadius: '0.5rem', overflow: 'hidden' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredBusinesses.map((business) => (
            <Marker key={business.id} position={[business.latitude, business.longitude]}>
              <Popup>{business.name}</Popup>
            </Marker>
          ))}
        </Map> */}
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((business, index) => (
          <motion.div 
            key={business.id}
            id={`business-${business.id}`}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-300 ${activeBusinessId === business.id ? 'ring-2 ring-green-500' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-green-600">{business.name}</h2>
              {business.verified && (
                <CheckCircle className="text-green-500" size={20} />
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{business.type}</p>
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="mr-2 text-green-500" size={16} />
                <span>{business.location}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 text-green-500" size={16} />
                <span>{business.hours}</span>
              </div>
              <div className="flex items-center">
                <Tag className="mr-2 text-green-500" size={16} />
                <div className="flex flex-wrap gap-1">
                  {business.tags.map(tag => (
                    <span key={tag} className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 text-green-500" size={16} />
                <span>{business.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 text-green-500" size={16} />
                <span>{business.email}</span>
              </div>
              <div className="flex items-start mt-4">
                <Info className="mr-2 text-green-500 mt-1" size={16} />
                <p className="text-sm text-gray-600 dark:text-gray-400">{business.description}</p>
              </div>
              <motion.button
                onClick={() => handleShopVisit(business.id)}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center w-full transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <CheckIn className="mr-2" size={16} />
                Check In (+10 XP)
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

