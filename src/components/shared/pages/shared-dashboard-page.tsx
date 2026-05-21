'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Users, Activity, Calendar, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { OverviewCards, KPICardData } from '@/components/shared'
import { SkeletonLoadingSection } from '@/components/shared'
import { RecentReferralsTable } from '@/components/tables/recent-referrals-table'
import { usePagination } from '@/hooks/usePagination'
import { useDashboard } from '@/hooks/useDashboard'
import { referralService } from '@/services/referral.service'
import { ROLES, UserRole } from '@/constants/roles'
import { calculateTrend, getDateRange, getPreviousDateRange } from '@/utils/trend-calculator'

interface SharedDashboardPageProps {
  userRole: UserRole
}

export function SharedDashboardPage({ userRole }: SharedDashboardPageProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [referrals, setReferrals] = useState<any[]>([])
  const [referralsLoading, setReferralsLoading] = useState(true)
  const [previousReferrals, setPreviousReferrals] = useState<any[]>([])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const data = await referralService.getReferrals()
        setReferrals(data)
        
        // Calculate previous period data for trend calculation
        // In a real implementation, you'd fetch data for the previous 30 days
        // For now, we'll estimate based on current data
        const previousPeriodData = data.slice(0, Math.max(0, data.length - 5))
        setPreviousReferrals(previousPeriodData)
      } catch (err) {
        console.error('Failed to fetch referrals:', err)
      } finally {
        setReferralsLoading(false)
      }
    }
    fetchReferrals()
  }, [])

  // Calculate overview stats from real data
  const today = new Date()
  const todayReferrals = referrals.filter(r => {
    const referralDate = new Date(r.created_at)
    return referralDate.toDateString() === today.toDateString()
  })

  const pendingReferrals = referrals.filter(r => r.status === 'submitted')
  const acceptedReferrals = referrals.filter(r => r.status === 'accepted')
  const completedReferrals = referrals.filter(r => r.status === 'completed')

  // Calculate previous period stats for trends
  const previousTodayReferrals = previousReferrals.filter(r => {
    const referralDate = new Date(r.created_at)
    return referralDate.toDateString() === today.toDateString()
  })

  const previousPendingReferrals = previousReferrals.filter(r => r.status === 'submitted')
  const previousAcceptedReferrals = previousReferrals.filter(r => r.status === 'accepted')
  const previousCompletedReferrals = previousReferrals.filter(r => r.status === 'completed')

  const overviewData: KPICardData[] = [
    {
      title: "Today's",
      value: todayReferrals.length,
      trend: calculateTrend(todayReferrals.length, previousTodayReferrals.length),
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Pending',
      value: pendingReferrals.length,
      trend: calculateTrend(pendingReferrals.length, previousPendingReferrals.length),
      icon: <Clock className="h-5 w-5" />
    },
    {
      title: 'Accepted',
      value: acceptedReferrals.length,
      trend: calculateTrend(acceptedReferrals.length, previousAcceptedReferrals.length),
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'Completed',
      value: completedReferrals.length,
      trend: calculateTrend(completedReferrals.length, previousCompletedReferrals.length),
      icon: <TrendingUp className="h-5 w-5" />
    }
  ]

  // Role-specific configurations
  const pageConfig: Record<string, { title: string; description: string }> = {
    [ROLES.CLINICIAN]: {
      title: 'Clinician Dashboard',
      description: 'Manage patient referrals and treatment plans'
    },
    [ROLES.FACILITY_ADMIN]: {
      title: 'Facility Dashboard', 
      description: 'Manage facility operations and patient referrals'
    }
  }

  const config = pageConfig[userRole] || pageConfig[ROLES.CLINICIAN]

  if (!isMounted) {
    return null
  }

  if (referralsLoading) {
    return (
      <div className="flex-1 space-y-6 overflow-x-hidden">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{config.title}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              {config.description}
            </p>
          </div>
        </div>
        <SkeletonLoadingSection />
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{config.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {config.description}
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
            <RecentReferralsTable
              referrals={referrals.slice(0, 5)}
              userRole={userRole === ROLES.SUPER_ADMIN ? 'facility-admin' :
                      userRole === ROLES.FACILITY_ADMIN ? 'facility-admin' :
                      userRole === ROLES.CLINICIAN ? 'clinician' : 'clinician'}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
