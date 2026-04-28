'use client'

import { OverviewCards } from '@/components/dashboard/overview-cards'
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
        <div className="bg-background">
          <div className="container mx-auto px-4 py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
              <p className="text-gray-600">System overview and management</p>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-background border-border rounded-lg p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
              </div>
            ))}
          </div>
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
