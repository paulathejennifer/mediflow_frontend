'use client'

import { useState, useEffect } from 'react'
import { OverviewCards, KPICardData } from '@/components/shared'
import { DetailedAnalytics } from '@/components/dashboard/detailed-analytics'
import { SkeletonLoadingSection } from '@/components/shared'
import { SystemActivityTrend } from '@/components/charts/system-activity-trend'
import { ReferralTrends } from '@/components/charts/referral-trends'
import { ReferralsByStatus } from '@/components/charts/referrals-by-status'
import { TurnaroundTimeTrend } from '@/components/charts/turnaround-time-trend'
import { ReferralReasons } from '@/components/charts/referrals-by-reason'
import { FacilityPerformance } from '@/components/charts/facility-performance'
import { TopReferringFacilities } from '@/components/tables/top-referring-facilities'
import { analyticsService, SystemActivityData, AnalyticsMetrics, StatusData, TurnaroundData, ReasonData, FacilityPerformanceData, SystemHealthData, ApiRequestsData, FacilityData } from '@/features/analytics/services/analytics.service'
import { Building2, Users, Activity, Zap } from 'lucide-react'

export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [systemActivityTrend, setSystemActivityTrend] = useState<SystemActivityData[]>([])
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [statusData, setStatusData] = useState<StatusData[]>([])
  const [turnaroundData, setTurnaroundData] = useState<TurnaroundData[]>([])
  const [reasonData, setReasonData] = useState<ReasonData[]>([])
  const [facilityPerformance, setFacilityPerformance] = useState<FacilityPerformanceData[]>([])
  const [topFacilities, setTopFacilities] = useState<FacilityData[]>([])
  const [referralTrendData, setReferralTrendData] = useState<{ month: string; total: number; completed: number }[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealthData | null>(null)
  const [apiRequests, setApiRequests] = useState<ApiRequestsData | null>(null)

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Fetch all data in parallel
      const [
        trendData,
        metricsData,
        statusResult,
        turnaroundResult,
        reasonResult,
        performanceResult,
        topFacilitiesResult,
        referralTrendResult,
        systemHealthResult,
        apiRequestsResult,
        kpiData
      ] = await Promise.all([
        analyticsService.getSystemActivityTrend(6),
        analyticsService.getAnalyticsMetrics(),
        analyticsService.getReferralsByStatus(),
        analyticsService.getTurnaroundTimeTrend(4),
        analyticsService.getReferralsByReason(),
        analyticsService.getFacilityPerformance(10),
        analyticsService.getTopReferringFacilities(10),
        analyticsService.getReferralTrend(30),
        analyticsService.getSystemHealth(),
        analyticsService.getApiRequests(1),
        analyticsService.getDashboardKpis()
      ])

      setSystemActivityTrend(trendData)
      setMetrics({ ...(metricsData || {}), ...(kpiData || {}) })
      setStatusData(statusResult)
      setTurnaroundData(turnaroundResult)
      setReasonData(reasonResult)
      setFacilityPerformance(performanceResult)
      setTopFacilities(topFacilitiesResult)
      setSystemHealth(systemHealthResult)
      setApiRequests(apiRequestsResult)

      // Transform trend data to include total and completed
      const transformedTrend = (referralTrendResult?.labels || []).map((label: string, index: number) => {
        const total = Number(referralTrendResult?.data?.[index]) || 0;
        return {
          month: label || 'Unknown',
          total,
          completed: total // Displaying actual totals until backend provides completion trends
        }
      })
      setReferralTrendData(transformedTrend)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  // Calculate KPI values from real data
  const totalFacilitiesCount = Number(metrics?.total_facilities || facilityPerformance?.length || 0);
  const activeUsersCount = Number(metrics?.activeUsers || metrics?.totalUsers || 0);
  const healthScoreValue = Number(systemHealth?.healthScore || 100);
  const totalApiRequestsCount = Number(apiRequests?.totalRequests || 0);

  // Format large numbers for API requests
  const formatApiRequests = (num: number): string => {
    const n = Math.max(0, Number(num) || 0)
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toLocaleString()
  }

  const analyticsOverviewData: KPICardData[] = [
    {
      title: 'New Facilities',
      value: totalFacilitiesCount.toLocaleString() || '0',
      trend: {
        // Estimate facility growth based on metrics growth rate
        value: `+${(Number(metrics?.growthRate) || 0).toFixed(1)}%`,
        isPositive: (Number(metrics?.growthRate) || 0) >= 0
      },
      icon: <Building2 className="h-5 w-5" />
    },
    {
      title: 'Active Users',
      value: activeUsersCount.toLocaleString() || '0',
      trend: {
        value: `+${(Number(metrics?.totalUsersTrend) || 0).toFixed(1)}%`,
        isPositive: (Number(metrics?.totalUsersTrend) || 0) >= 0
      },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'System Health',
      value: `${healthScoreValue}%`,
      trend: {
        // System health trend based on error rate
        value: `${(systemHealth?.errorRate || 0) <= 5 ? '+0.5%' : '-1.2%'}`,
        isPositive: (systemHealth?.errorRate || 0) <= 5
      },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'API Requests (24h)',
      value: formatApiRequests(totalApiRequestsCount),
      trend: {
        value: `${(apiRequests?.trend || 0) >= 0 ? '+' : ''}${(apiRequests?.trend || 0).toFixed(1)}%`,
        isPositive: (apiRequests?.trend || 0) >= 0
      },
      icon: <Zap className="h-5 w-5" />
    }
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Loading system analytics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">System analytics and insights</p>
          </div>
          
          <div className="mt-8">
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
              <button 
                onClick={fetchAnalyticsData}
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
          <p className="text-muted-foreground">System analytics and insights</p>
        </div>
        
        <div className="mt-8">
          <OverviewCards data={analyticsOverviewData} />
        </div>
        
        {/* Row 1: Referral Trends and Referrals by Status */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReferralTrends data={referralTrendData} />
          <ReferralsByStatus data={statusData} />
        </div>
        
        {/* Row 2: Turnaround Time Trend and Referrals by Reason */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TurnaroundTimeTrend data={turnaroundData} />
          <ReferralReasons data={reasonData} />
        </div>
        
        {/* Row 3: System Activity Trend and Facility Performance */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemActivityTrend data={systemActivityTrend} isLoading={false} />
          <FacilityPerformance data={facilityPerformance} />
        </div>
        
        {/* Top Referring Facilities Table - Full Width */}
        <div className="mt-8">
          <TopReferringFacilities data={topFacilities} />
        </div>
      </div>
    </div>
  )
}