'use client'

import { AnalyticsOverviewCards } from '@/components/dashboard/shared/analytics-overview-cards'
import { DetailedAnalytics } from '@/components/dashboard/detailed-analytics'
import { SkeletonLoadingSection } from '@/components/dashboard/shared/skeleton-loading-section'
import { SystemActivityTrend } from '@/components/charts/system-activity-trend'
import { ReferralTrends } from '@/components/charts/referral-trends'
import { ReferralsByStatus } from '@/components/charts/referrals-by-status'
import { TurnaroundTimeTrend } from '@/components/charts/turnaround-time-trend'
import { ReferralsBySpecialty } from '@/components/charts/referrals-by-specialty'
import { FacilityPerformance } from '@/components/charts/facility-performance'
import { TopReferringFacilities } from '@/components/tables/top-referring-facilities'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function AnalyticsPage() {
  const { systemActivityTrend, isLoading, error, refetch } = useAnalytics()

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
          <AnalyticsOverviewCards />
        </div>
        
        {/* System Activity Trend - Full Width */}
        <div className="mt-8">
          <SystemActivityTrend data={systemActivityTrend} isLoading={isLoading} />
        </div>
        
        {/* Row 1: Referral Trends and Referrals by Status */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReferralTrends />
          <ReferralsByStatus />
        </div>
        
        {/* Row 2: Turnaround Time Trend and Referrals by Specialty */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TurnaroundTimeTrend />
          <ReferralsBySpecialty />
        </div>
        
        {/* Facility Performance - Full Width */}
        <div className="mt-8">
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
