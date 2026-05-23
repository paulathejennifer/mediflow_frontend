import { useState, useEffect } from 'react'
import { analyticsService, SystemActivityData, AnalyticsMetrics } from '../services/analytics.service'

export interface UseAnalyticsReturn {
  systemActivityTrend: SystemActivityData[]
  metrics: AnalyticsMetrics | null
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useAnalytics(): UseAnalyticsReturn {
  const [systemActivityTrend, setSystemActivityTrend] = useState<SystemActivityData[]>([])
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch both datasets in parallel
      const [trendData, metricsData] = await Promise.all([
        analyticsService.getSystemActivityTrend(),
        analyticsService.getAnalyticsMetrics()
      ])

      setSystemActivityTrend(trendData)
      setMetrics(metricsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  const refetch = async () => {
    await fetchAnalyticsData()
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  return {
    systemActivityTrend,
    metrics,
    isLoading,
    error,
    refetch
  }
}
