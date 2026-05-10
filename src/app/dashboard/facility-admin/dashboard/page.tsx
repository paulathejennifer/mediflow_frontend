'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Users, Activity, Calendar, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { OverviewCards, KPICardData } from '@/components/shared'
import { SkeletonLoadingSection } from '@/components/shared'
import { RecentReferralsTable } from '@/components/tables/recent-referrals-table'
import { QuickInsights } from '@/components/dashboard/quick-insights'
import { usePagination } from '@/hooks/usePagination'
import { mockReferralsData } from '@/services/referral.service'

export default function FacilityAdminDashboard() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Calculate overview stats
  const todayReferrals = mockReferralsData.filter(r => {
    const today = new Date()
    const referralDate = new Date(r.date)
    return referralDate.toDateString() === today.toDateString()
  })

  const pendingReferrals = mockReferralsData.filter(r => r.status === 'pending')
  const acceptedReferrals = mockReferralsData.filter(r => r.status === 'accepted')
  const completedReferrals = mockReferralsData.filter(r => r.status === 'completed')

  const overviewData: KPICardData[] = [
    {
      title: "Today's Referrals",
      value: todayReferrals.length,
      trend: { value: '+5', isPositive: true },
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Pending Referrals',
      value: pendingReferrals.length,
      trend: { value: '+3', isPositive: true },
      icon: <Clock className="h-5 w-5" />
    },
    {
      title: 'Accepted Referrals',
      value: acceptedReferrals.length,
      trend: { value: '+2', isPositive: true },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'Completed Referrals',
      value: completedReferrals.length,
      trend: { value: '+8', isPositive: true },
      icon: <TrendingUp className="h-5 w-5" />
    }
  ]

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex-1 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Facility Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage facility operations and patient referrals
          </p>
        </div>
      </div>

      {/* Overview */}
      <div className="mt-8">
        <OverviewCards data={overviewData} />
      </div>

      {/* Recent Referrals */}
      <div className="mt-8">
        <Card className="bg-gray-900/60 backdrop-blur-md border border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Recent Referrals
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-gray-900">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <RecentReferralsTable referrals={mockReferralsData.slice(0, 5)} userRole="facility-admin" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}