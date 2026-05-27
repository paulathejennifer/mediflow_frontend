'use client'

import { useState, useEffect } from 'react'
import { OverviewCards } from '@/components/shared'
import { SkeletonLoadingSection } from '@/components/shared'
import { RecentAlerts } from '@/components/dashboard/recent-alerts'
import { QuickInsights } from '@/components/dashboard/quick-insights'
import { useDashboard } from '@/features/analytics/hooks/useDashboard'
import { FileText, Building2, Users, TrendingUp } from 'lucide-react'
import { dashboardService } from '@/features/analytics/services/dashboard.service'
import { calculateTrend } from '@/utils/trend-calculator'
import { analyticsService, AnalyticsMetrics } from '@/features/analytics/services/analytics.service'
import { KPICardData } from '@/components/shared/dashboard/overview-cards'

export default function SuperAdminDashboard() {
  const [kpis, setKpis] = useState<AnalyticsMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await analyticsService.getDashboardKpis()
        console.log("📊 [SUPER ADMIN DASHBOARD] KPI Data:", JSON.stringify(data, null, 2));
        setKpis(data)
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  // Safe trend formatter to prevent NaN%
  const formatTrend = (val: number | undefined | null) => {
    const numeric = Number(val);
    if (isNaN(numeric)) return "0.0%";
    return `${numeric >= 0 ? '+' : ''}${numeric.toFixed(1)}%`;
  }

  const dashboardOverviewData: KPICardData[] = [
    {
      title: 'Total Referrals',
      value: kpis?.totalReferrals ?? 0,
      trend: { value: formatTrend(kpis?.totalReferralsTrend), isPositive: (kpis?.totalReferralsTrend ?? 0) >= 0 },
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Total Facilities',
      value: kpis?.total_facilities ?? kpis?.totalFacilities ?? 0,
      trend: { value: '0.0%', isPositive: true }, // Facilities don't typically have a monthly trend
      icon: <Building2 className="h-5 w-5" />
    },
    {
      title: 'Total Users',
      value: kpis?.totalUsers ?? 0,
      trend: { value: formatTrend(kpis?.totalUsersTrend), isPositive: (kpis?.totalUsersTrend ?? 0) >= 0 },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'AI Documents (Processed)',
      value: kpis?.totalDocuments ?? 0,
      trend: { value: formatTrend(kpis?.totalDocumentsTrend), isPositive: (kpis?.totalDocumentsTrend ?? 0) >= 0 },
      icon: <TrendingUp className="h-5 w-5" />
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Super Admin Dashboard</h1>
            <p className="text-muted-foreground">System overview and management</p>
          </div>
          
          <SkeletonLoadingSection />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-background">
          <div className="container mx-auto px-4 py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
              <p className="text-gray-600">System overview and management</p>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-background">
        <div className="container mx-auto px-4 py-3">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Super Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">System overview and management</p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-3 space-y-6">
        {/* Overview Cards */}
        <OverviewCards data={dashboardOverviewData} />
        
        {/* Recent Alerts and Quick Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentAlerts />
          </div>
          <div>
            <QuickInsights />
          </div>
        </div>
      </div>
    </div>
  )
}
