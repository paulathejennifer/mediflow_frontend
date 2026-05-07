'use client'

import { OverviewCards, KPICardData } from '@/components/shared/overview-cards'
import { DetailedAnalytics } from '@/components/dashboard/detailed-analytics'
import { SkeletonLoadingSection } from '@/components/dashboard/shared/skeleton-loading-section'
import { SystemActivityTrend } from '@/components/charts/system-activity-trend'
import { ReferralTrends } from '@/components/charts/referral-trends'
import { ReferralsByStatus } from '@/components/charts/referrals-by-status'
import { TurnaroundTimeTrend } from '@/components/charts/turnaround-time-trend'
import { ReferralReasons } from '@/components/charts/referrals-by-reason'
import { FacilityPerformance } from '@/components/charts/facility-performance'
import { TopReferringFacilities } from '@/components/tables/top-referring-facilities'
import { useAnalytics } from '@/hooks/useAnalytics'
import { Building2, Users, Activity, Zap } from 'lucide-react'

export default function AnalyticsPage() {
  const { systemActivityTrend, isLoading, error, refetch } = useAnalytics()

  const analyticsOverviewData: KPICardData[] = [
    {
      title: 'New Facilities',
      value: '12',
      trend: {
        value: '+15%',
        isPositive: true
      },
      icon: <Building2 className="h-5 w-5" />
    },
    {
      title: 'Active Users',
      value: '2,847',
      trend: {
        value: '+12.3%',
        isPositive: true
      },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'System Health',
      value: '98.5%',
      trend: {
        value: '+1.2%',
        isPositive: true
      },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'API Requests (24h)',
      value: '1.2M',
      trend: {
        value: '-5.4%',
        isPositive: false
      },
      icon: <Zap className="h-5 w-5" />
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
            <p className="text-muted-foreground">System analytics and insights</p>
          </div>
          
          <SkeletonLoadingSection />
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
            <p className="text-muted-foreground">System analytics and insights</p>
          </div>
          
          <div className="mt-8">
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
              <button 
                onClick={refetch}
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
          <ReferralTrends />
          <ReferralsByStatus />
        </div>
        
        {/* Row 2: Turnaround Time Trend and Referrals by Specialty */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TurnaroundTimeTrend />
          <ReferralReasons />
        </div>
        
        {/* Row 3: System Activity Trend and Facility Performance */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SystemActivityTrend data={systemActivityTrend} isLoading={isLoading} />
          <FacilityPerformance />
        </div>
        
        {/* Top Referring Facilities Table - Full Width */}
        <div className="mt-8">
          <TopReferringFacilities />
        </div>
      </div>
    </div>
  )
}
