'use client'

import { useState, useEffect } from 'react'
import { OverviewCards, KPICardData } from '@/components/shared'
import { SkeletonLoadingSection } from '@/components/shared'
import { RecentAlerts } from '@/components/dashboard/recent-alerts'
import { QuickInsights } from '@/components/dashboard/quick-insights'
import { useDashboard } from '@/features/analytics/hooks/useDashboard'
import { Button } from '@/components/ui/button'
import { BarChart3, FileText, Clock, Activity, CheckCircle } from 'lucide-react'
import { dashboardService } from '@/features/analytics/services/dashboard.service'
import { calculateTrend } from '@/utils/trend-calculator'

export default function SuperAdminDashboard() {
  const { isLoading, error } = useDashboard()
  const [dashboardStats, setDashboardStats] = useState<any>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await dashboardService.getDashboardStatsWithTrends()
        setDashboardStats(stats)
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
      } finally {
        setStatsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const dashboardOverviewData: KPICardData[] = [
    {
      title: 'Total Referrals',
      value: dashboardStats?.totalReferrals?.toLocaleString() || '0',
      trend: dashboardStats?.trends?.totalReferrals 
        ? calculateTrend(dashboardStats.trends.totalReferrals.current, dashboardStats.trends.totalReferrals.previous)
        : undefined,
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Total Facilities',
      value: dashboardStats?.totalFacilities?.toLocaleString() || '0',
      trend: dashboardStats?.trends?.totalFacilities
        ? calculateTrend(dashboardStats.trends.totalFacilities.current, dashboardStats.trends.totalFacilities.previous)
        : undefined,
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'Total Users',
      value: dashboardStats?.totalUsers?.toLocaleString() || '0',
      trend: dashboardStats?.trends?.totalUsers
        ? calculateTrend(dashboardStats.trends.totalUsers.current, dashboardStats.trends.totalUsers.previous)
        : undefined,
      icon: <BarChart3 className="h-5 w-5" />
    },
    {
      title: 'Total Patients',
      value: dashboardStats?.totalPatients?.toLocaleString() || '0',
      trend: dashboardStats?.trends?.totalPatients
        ? calculateTrend(dashboardStats.trends.totalPatients.current, dashboardStats.trends.totalPatients.previous)
        : undefined,
      icon: <CheckCircle className="h-5 w-5" />
    }
  ]

  if (isLoading || statsLoading) {
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
