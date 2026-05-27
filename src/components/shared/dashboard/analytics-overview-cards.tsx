'use client'

import { useState, useEffect } from 'react' // Keep this for local state/effects
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Building2, Users, Zap, Activity, FileText } from 'lucide-react'
import { analyticsService, AnalyticsMetrics } from '@/features/analytics/services/analytics.service'

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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchKpis = async () => {
      try {
        const data = await analyticsService.getDashboardKpis()
        setKpis(data)
      } catch (error) {
        console.error('Failed to fetch analytics KPIs:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchKpis()
  }, [])

  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-32 bg-muted rounded-lg animate-pulse"></Card>
        ))}
      </div>
    )
  }

  const overviewData: KPICardData[] = [
    {
      title: 'Total Patients',
      value: kpis.totalPatients,
      trend: {
        value: `${(kpis.totalPatientsTrend ?? 0) >= 0 ? '+' : ''}${kpis.totalPatientsTrend?.toFixed(1) ?? 0}%`,
        isPositive: (kpis.totalPatientsTrend ?? 0) >= 0
      },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Total Referrals',
      value: kpis.totalReferrals,
      trend: {
        value: `${(kpis.totalReferralsTrend ?? 0) >= 0 ? '+' : ''}${kpis.totalReferralsTrend?.toFixed(1) ?? 0}%`,
        isPositive: (kpis.totalReferralsTrend ?? 0) >= 0
      },
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Total Users',
      value: kpis.totalUsers,
      trend: {
        value: `${(kpis.totalUsersTrend ?? 0) >= 0 ? '+' : ''}${kpis.totalUsersTrend?.toFixed(1) ?? 0}%`,
        isPositive: (kpis.totalUsersTrend ?? 0) >= 0
      },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Total Documents',
      value: kpis.totalDocuments,
      trend: {
        value: `${(kpis.totalDocumentsTrend ?? 0) >= 0 ? '+' : ''}${kpis.totalDocumentsTrend?.toFixed(1) ?? 0}%`,
        isPositive: (kpis.totalDocumentsTrend ?? 0) >= 0
      },
      icon: <FileText className="h-5 w-5" />
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
