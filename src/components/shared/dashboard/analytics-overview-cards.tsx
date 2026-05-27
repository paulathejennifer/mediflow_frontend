'use client'

import { useState, useEffect } from 'react' // Keep this for local state/effects
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Building2, Users, Zap, Activity, FileText, HeartPulse, Server } from 'lucide-react'
import { analyticsService, AnalyticsMetrics, SystemHealthData, ApiRequestsData } from '@/features/analytics/services/analytics.service'

interface KPICardProps {
  title: string
  value: string | number
  trend: {
    value: string
    isPositive: boolean
  }
  trendLabel?: string
  icon: React.ReactNode
}

export interface KPICardData {
  title: string
  value: string | number
  trend: {
    value: string
    isPositive: boolean
  }
  icon: React.ReactNode
  trendLabel?: string
}

function KPICard({ title, value, trend, icon, trendLabel = 'vs last month' }: KPICardProps) {
  return (
    <Card className="
bg-background
border border-border
rounded-2xl
transition-all duration-300
hover:border-primary/40
hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)]
hover:-translate-y-1
">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <div className="text-primary bg-primary/20 rounded-lg p-2">
            {icon}
          </div>
        </div>
        <div className="text-3xl font-bold text-foreground mb-2">{value}</div>
        <div className={`flex items-center text-xs ${trend.isPositive ? 'text-primary' : 'text-red-400'}`}>
          {trend.isPositive ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          <span>{trend.value} {trendLabel}</span>
        </div>
      </CardContent>
    </Card>
  )
}

export function AnalyticsOverviewCards() { // Renamed from AnalyticsOverviewCards to avoid confusion
  const [kpis, setKpis] = useState<AnalyticsMetrics | null>(null)
  const [systemHealth, setSystemHealth] = useState<SystemHealthData | null>(null)
  const [apiRequests, setApiRequests] = useState<ApiRequestsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiData, healthData, apiData] = await Promise.all([
          analyticsService.getDashboardKpis(),
          analyticsService.getSystemHealth(),
          analyticsService.getApiRequests(1) // Fetch statistics for the last 24 hours
        ])
        setKpis(kpiData)
        setSystemHealth(healthData)
        setApiRequests(apiData)
      } catch (error) {
        console.error('Failed to fetch analytics overview data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Safe trend formatter to prevent NaN%
  const formatTrend = (val: number | undefined | null) => {
    const numeric = Number(val)
    if (isNaN(numeric)) return "0.0%"
    return `${numeric >= 0 ? '+' : ''}${numeric.toFixed(1)}%`
  }

  if (isLoading || !kpis || !systemHealth || !apiRequests) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    )
  }

  const overviewData: KPICardData[] = [
    {
      title: 'Total Facilities',
      value: kpis.total_facilities ?? 0,
      trend: {
        value: '0.0%',
        isPositive: true
      },
      icon: <Building2 className="h-5 w-5" />
    },
    {
      title: 'Active Users',
      value: kpis.activeUsers ?? 0,
      trend: {
        value: formatTrend(kpis.activeUsersTrend),
        isPositive: (kpis.activeUsersTrend ?? 0) >= 0
      },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'System Health',
      value: `${systemHealth.healthScore}%`,
      trend: {
        value: '0.0%',
        isPositive: true
      },
      icon: <HeartPulse className="h-5 w-5" />
    },
    {
      title: 'API Requests (24h)',
      value: apiRequests.requestsLast24h ?? 0,
      trend: {
        value: formatTrend(apiRequests.trend),
        isPositive: (apiRequests.trend ?? 0) >= 0
      },
      icon: <Server className="h-5 w-5" />,
      trendLabel: 'vs yesterday'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewData.map((data, index) => (
        <KPICard
          key={index}
          title={data.title}
          value={data.value}
          trend={data.trend}
          icon={data.icon}
        />
      ))}
    </div>
  )
}
