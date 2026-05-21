import { useState } from 'react'

export const useAsyncOperation = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = async <T,>(
    operation: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: any) => void
  ): Promise<T | null> => {
    try {
      setIsLoading(true)
      setError(null)
      const result = await operation()
      if (onSuccess) onSuccess(result)
      return result
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      if (onError) onError(error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, error, execute }
}
