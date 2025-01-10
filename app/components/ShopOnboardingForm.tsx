'use client'

import { useState } from 'react'
import { useToast } from '../contexts/ToastContext'

type ShopApplication = {
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  businessLicense: string
  cannabisLicense: string
}

export default function ShopOnboardingForm() {
  const [application, setApplication] = useState<ShopApplication>({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    businessLicense: '',
    cannabisLicense: '',
  })
  const { showToast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setApplication(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Here you would typically send the application to your backend
      // For now, we'll just simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast('Application submitted successfully!', 'success')
      // Reset form
      setApplication({
        name: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        businessLicense: '',
        cannabisLicense: '',
      })
    } catch (error) {
      showToast('Failed to submit application. Please try again.', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Shop Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={application.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
        <textarea
          id="description"
          name="description"
          value={application.description}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        ></textarea>
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={application.address}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={application.phone}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={application.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
        <input
          type="url"
          id="website"
          name="website"
          value={application.website}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <label htmlFor="businessLicense" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Business License Number</label>
        <input
          type="text"
          id="businessLicense"
          name="businessLicense"
          value={application.businessLicense}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <label htmlFor="cannabisLicense" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cannabis License Number</label>
        <input
          type="text"
          id="cannabisLicense"
          name="cannabisLicense"
          value={application.cannabisLicense}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
      </div>
      <div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Submit Application
        </button>
      </div>
    </form>
  )
}

