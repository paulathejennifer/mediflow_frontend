'use client'

import { OverviewCards } from '@/components/dashboard/shared/overview-cards'
import { SkeletonLoadingSection } from '@/components/dashboard/shared/skeleton-loading-section'
import { RecentAlerts } from '@/components/dashboard/recent-alerts'
import { QuickInsights } from '@/components/dashboard/quick-insights'
import { useDashboard } from '@/hooks/useDashboard'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'

export default function SuperAdminDashboard() {
  const { isLoading, error } = useDashboard()

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
        <OverviewCards />
        
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
