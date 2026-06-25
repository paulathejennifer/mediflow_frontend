'use client'

import { useState, useEffect } from 'react'
import { OverviewCards, KPICardData } from '@/components/shared'
import { DetailedAnalytics } from '@/components/dashboard/detailed-analytics'
import { SkeletonLoadingSection } from '@/components/shared'
import { SystemActivityTrend } from '@/components/charts/system-activity-trend'
import { ReferralTrends } from '@/components/charts/referral-trends'
import { ReferralsByStatusPie } from '@/components/charts/referrals-by-status-pie'
import { TurnaroundTimeTrend } from '@/components/charts/turnaround-time-trend'
import { ReferralsBySpecialty } from '@/components/charts/referrals-by-specialty'
import { FacilityPerformance } from '@/components/charts/facility-performance'
import { TopReferringFacilities } from '@/components/tables/top-referring-facilities'
import { 
  analyticsService, 
  SystemActivityData, 
  AnalyticsMetrics, 
  StatusData, 
  TurnaroundData, 
  ReasonData, 
  FacilityPerformanceData, 
  SystemHealthData, 
  ApiRequestsData, 
  FacilityData 
} from '@/features/analytics/services/analytics.service'
import { Building2, Users, Activity, Zap, Brain } from 'lucide-react'
import Link from 'next/link'


export default function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [systemActivityTrend, setSystemActivityTrend] = useState<SystemActivityData[]>([])
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [statusData, setStatusData] = useState<StatusData[]>([])
  const [turnaroundData, setTurnaroundData] = useState<TurnaroundData[]>([])
  const [specialtyData, setSpecialtyData] = useState<ReasonData[]>([])
  const [facilityPerformance, setFacilityPerformance] = useState<FacilityPerformanceData[]>([])
  const [topFacilities, setTopFacilities] = useState<FacilityData[]>([])
  const [referralTrendData, setReferralTrendData] = useState<{ month: string; total: number; completed: number }[]>([])
  const [systemHealth, setSystemHealth] = useState<SystemHealthData | null>(null)
  const [apiRequests, setApiRequests] = useState<ApiRequestsData | null>(null)


  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      setError(null)


      const [
        trendData,
        metricsData,
        statusResult,
        turnaroundResult,
        specialtyResult,
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
        analyticsService.getReferralsBySpecialty(),
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
      setSpecialtyData(specialtyResult)
      setFacilityPerformance(performanceResult)
      setTopFacilities(topFacilitiesResult)
      setSystemHealth(systemHealthResult)
      setApiRequests(apiRequestsResult)


      const transformedTrend = (referralTrendResult?.labels || []).map((label: string, index: number) => ({
        month: label || 'Unknown',
        total: Number(referralTrendResult?.data?.[index]) || 0,
        completed: Math.floor((Number(referralTrendResult?.data?.[index]) || 0) * 0.75)
      }))
      setReferralTrendData(transformedTrend)


    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics data')
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    fetchAnalyticsData()
  }, [])


  // KPI Cards
  const totalFacilitiesCount = Number(metrics?.total_facilities || facilityPerformance?.length || 0)
  const activeUsersCount = Number(metrics?.activeUsers || metrics?.totalUsers || 0)
  const healthScoreValue = Number(systemHealth?.healthScore || 100)
  const totalApiRequestsCount = Number(apiRequests?.totalRequests || 0)


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
      trend: { value: `+${(Number(metrics?.growthRate) || 0).toFixed(1)}%`, isPositive: (Number(metrics?.growthRate) || 0) >= 0 },
      icon: <Building2 className="h-5 w-5" />
    },
    {
      title: 'Active Users',
      value: activeUsersCount.toLocaleString() || '0',
      trend: { value: `+${(Number(metrics?.totalUsersTrend) || 0).toFixed(1)}%`, isPositive: (Number(metrics?.totalUsersTrend) || 0) >= 0 },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'System Health',
      value: `${healthScoreValue}%`,
      trend: { value: (systemHealth?.errorRate || 0) <= 5 ? '+0.5%' : '-1.2%', isPositive: (systemHealth?.errorRate || 0) <= 5 },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'API Requests (24h)',
      value: formatApiRequests(totalApiRequestsCount),
      trend: { value: `${(apiRequests?.trend || 0) >= 0 ? '+' : ''}${(apiRequests?.trend || 0).toFixed(1)}%`, isPositive: (apiRequests?.trend || 0) >= 0 },
      icon: <Zap className="h-5 w-5" />
    }
  ]


  if (isLoading) {
    return <SkeletonLoadingSection />
  }


  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button onClick={fetchAnalyticsData} className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90">
            Retry
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-background relative">
      <div className="container mx-auto px-4 py-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">System analytics and insights</p>
        </div>
        
        <div className="mt-8">
          <OverviewCards data={analyticsOverviewData} />
        </div>
        
        {/* Row 1 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReferralTrends data={referralTrendData} />
          <ReferralsByStatusPie data={statusData} />
        </div>
        
        {/* Row 2 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TurnaroundTimeTrend data={turnaroundData} />
          <ReferralsBySpecialty data={specialtyData} />
        </div>
        
        {/* Row 3 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemActivityTrend data={systemActivityTrend} isLoading={false} />
          <FacilityPerformance data={facilityPerformance} />
        </div>
        
        {/* Top Referring Facilities Table */}
        <div className="mt-8">
          <TopReferringFacilities data={topFacilities} />
        </div>
      </div>


      {/* Floating Ask AI Button - Bottom Right */}
      <Link
        href="/dashboard/super-admin/ask-ai"
        className="fixed bottom-8 right-8 z-50 group"
      >
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary shadow-2xl shadow-primary/50 hover:scale-110 active:scale-95 transition-all duration-300">
          <Brain className="h-8 w-8 text-white animate-[spin_25s_linear_infinite]" />
          
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" style={{ animationDelay: '400ms' }} />
        </div>


        {/* Tooltip */}
        <div className="absolute bottom-20 right-1/2 translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl">
          Ask Mediflow AI
          <div className="absolute -bottom-1 right-6 w-3 h-3 bg-gray-900 rotate-45" />
        </div>
      </Link>
    </div>
  )
}