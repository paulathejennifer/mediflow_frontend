'use client'

import { useState, useEffect } from 'react'
import { OverviewCards, KPICardData } from '@/components/shared'
import { ReferralVolume } from '@/components/charts/referral-volume'
import { ReferralsByStatusPie } from '@/components/charts/referrals-by-status-pie'
import { TurnaroundTimeTrend } from '@/components/charts/turnaround-time-trend'
import { ReferralTrends } from '@/components/charts/referral-trends'
import { FileText, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import { analyticsService, AnalyticsMetrics, ReferralVolumeData, TurnaroundData, StatusData, ReferralTrendData } from '@/features/analytics/services/analytics.service'

export function SharedAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [referralVolume, setReferralVolume] = useState<ReferralVolumeData[]>([])
  const [statusData, setStatusData] = useState<StatusData[]>([])
  const [turnaroundData, setTurnaroundData] = useState<TurnaroundData[]>([])
  const [referralTrendData, setReferralTrendData] = useState<ReferralTrendData[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch all data in parallel
        const [metricsData, volumeData, statusDataResult, turnaroundDataResult, trendResult] = await Promise.all([
          analyticsService.getAnalyticsMetrics(),
          analyticsService.getReferralVolume(6),
          analyticsService.getReferralsByStatus(),
          analyticsService.getTurnaroundTimeTrend(4),
          analyticsService.getReferralTrend(30)
        ])

        setMetrics(metricsData)
        setReferralVolume(volumeData)
        setStatusData(statusDataResult)
        setTurnaroundData(turnaroundDataResult)

        // Transform trend data to include total and completed
        const transformedTrend = trendResult.labels.map((label, index) => ({
          month: label,
          total: trendResult.data[index] || 0,
          completed: Math.round((trendResult.data[index] || 0) * 0.85) // Estimate 85% completion rate
        }))
        setReferralTrendData(transformedTrend)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnalyticsData()
  }, [])

  // Calculate KPI values from real data
  const totalReferrals = metrics?.totalReferrals || 0
  const avgTurnaround = metrics?.recentAvgTurnaround || 0
  const completionRate = metrics?.recentCompletionRate || 0
  const pendingReferrals = metrics?.recentPending || 0

  // Format trend values with proper signs
  const formatTrendValue = (value: number, suffix: string = '%', showSign: boolean = true): string => {
    if (value === 0) return '0%'
    const sign = showSign ? (value > 0 ? '+' : '') : ''
    return `${sign}${value.toFixed(1)}${suffix}`
  }

  const analyticsOverviewData: KPICardData[] = [
    {
      title: 'Total Referrals',
      value: totalReferrals.toLocaleString(),
      trend: {
        value: formatTrendValue(metrics?.growthRate || 0),
        isPositive: (metrics?.growthRate || 0) >= 0
      },
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Average Turnaround',
      value: `${avgTurnaround} days`,
      trend: {
        // Negative trend is good for turnaround (faster is better)
        value: formatTrendValue(-(metrics?.turnaroundTrend || 0)),
        isPositive: (metrics?.turnaroundTrend || 0) <= 0
      },
      icon: <Clock className="h-5 w-5" />
    },
    {
      title: 'Completion Rate',
      value: `${completionRate.toFixed(1)}%`,
      trend: {
        value: formatTrendValue(metrics?.completionRateTrend || 0),
        isPositive: (metrics?.completionRateTrend || 0) >= 0
      },
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      title: 'Pending Referrals',
      value: pendingReferrals.toString(),
      trend: {
        // Negative trend is good for pending (fewer pending is better)
        value: formatTrendValue(-(metrics?.pendingTrend || 0), '', false),
        isPositive: (metrics?.pendingTrend || 0) <= 0
      },
      icon: <AlertCircle className="h-5 w-5" />
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Referral analytics and insights</p>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
            <div className="h-80 bg-muted rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">Referral analytics and insights</p>
          </div>
          
          <div className="mt-8">
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Referral analytics and insights</p>
        </div>
        
        <div className="mt-8">
          <OverviewCards data={analyticsOverviewData} />
        </div>
        
        {/* Row 1: Referral Volume and Referrals by Status */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReferralVolume data={referralVolume} />
          <ReferralsByStatusPie data={statusData} />
        </div>
        
        {/* Row 2: Turnaround Time Trend and Referral Trends */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TurnaroundTimeTrend data={turnaroundData} />
          <ReferralTrends data={referralTrendData} />
        </div>
      </div>
    </div>
  )
}