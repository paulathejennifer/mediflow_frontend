import { useEffect, useState } from 'react'
import { dashboardService } from '@/services/dashboard.service'
import { DashboardData } from '@/types/dashboard'

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const dashboardData = await dashboardService.getDashboardData()
      setData(dashboardData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setError('Failed to load dashboard data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  return {
    data,
    isLoading,
    error,
    refetch: loadDashboardData
  }
}
