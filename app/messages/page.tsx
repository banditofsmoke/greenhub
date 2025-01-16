// app/messages/page.tsx
import { Suspense } from 'react'
import MessagesComponent from './MessagesComponent'

export default function MessagesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MessagesComponent />
    </Suspense>
  )
}