'use client'

import { useState, useEffect } from 'react'

export default function AdminPage() {
  const [submissions, setSubmissions] = useState([])

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    const response = await fetch('/api/shopSubmissions')
    const data = await response.json()
    setSubmissions(data)
  }

  const handleStatusChange = async (id: number, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/shopSubmissions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      })
      if (response.ok) {
        fetchSubmissions()
      } else {
        throw new Error('Failed to update status')
      }
    } catch (error) {
      alert('There was an error updating the submission. Please try again.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin: Shop Submissions</h1>
      <div className="space-y-6">
        {submissions.map((submission: any) => (
          <div key={submission.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-2">{submission.name}</h2>
            <p className="mb-2"><strong>Type:</strong> {submission.type}</p>
            <p className="mb-2"><strong>Location:</strong> {submission.location}</p>
            <p className="mb-2"><strong>Hours:</strong> {submission.hours}</p>
            <p className="mb-2"><strong>Tags:</strong> {submission.tags}</p>
            <p className="mb-2"><strong>Phone:</strong> {submission.phone}</p>
            <p className="mb-2"><strong>Email:</strong> {submission.email}</p>
            <p className="mb-4"><strong>Description:</strong> {submission.description}</p>
            <p className="mb-4"><strong>Status:</strong> {submission.status}</p>
            {submission.status === 'pending' && (
              <div className="space-x-4">
                <button
                  onClick={() => handleStatusChange(submission.id, 'approved')}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusChange(submission.id, 'rejected')}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

