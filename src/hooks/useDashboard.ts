import { useEffect, useState } from 'react'
import { dashboardService } from '@/services/dashboard.service'
import { DashboardStats } from '@/types/dashboard'

export function useDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const dashboardData = await dashboardService.getDashboardStats()
      setData(dashboardData)
    } catch (error) {
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
