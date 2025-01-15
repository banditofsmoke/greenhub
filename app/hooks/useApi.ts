// app/hooks/useApi.ts
'use client'

import { useState, useCallback } from 'react'

interface ApiResponse<T> {
  data: T | null
  isLoading: boolean
  error: string | null
}

export function useApi<T>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    isLoading: false,
    error: null,
  })

  const execute = useCallback(async (promise: Promise<T>) => {
    setState({ data: null, isLoading: true, error: null })
    try {
      const data = await promise
      setState({ data, isLoading: false, error: null })
      return data
    } catch (error) {
      setState({ data: null, isLoading: false, error: (error as Error).message })
      throw error
    }
  }, [])

  return { ...state, execute }
}