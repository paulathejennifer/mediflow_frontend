'use client'

import { OverviewCards, KPICardData } from '@/components/shared'
import { ReferralVolume } from '@/components/charts/referral-volume'
import { ReferralsByStatusPie } from '@/components/charts/referrals-by-status-pie'
import { TurnaroundTimeTrend } from '@/components/charts/turnaround-time-trend'
import { ReferralTrends } from '@/components/charts/referral-trends'
import { FileText, Clock, TrendingUp, AlertCircle } from 'lucide-react'

export function SharedAnalyticsPage() {
  const analyticsOverviewData: KPICardData[] = [
    {
      title: 'Total Referrals',
      value: '1,245',
      trend: {
        value: '+12.5%',
        isPositive: true
      },
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Average Turnaround',
      value: '3.2 days',
      trend: {
        value: '-0.5 days',
        isPositive: true
      },
      icon: <Clock className="h-5 w-5" />
    },
    {
      title: 'Completion Rate',
      value: '87.5%',
      trend: {
        value: '+5.2%',
        isPositive: true
      },
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      title: 'Pending Referrals',
      value: '45',
      trend: {
        value: '-8',
        isPositive: true
      },
      icon: <AlertCircle className="h-5 w-5" />
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Referral analytics and insights</p>
        </div>
        
        <div className="mt-8">
          <OverviewCards data={analyticsOverviewData} />
        </div>
        
        {/* Row 1: Referral Volume and Referrals by Status */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ReferralVolume />
          <ReferralsByStatusPie />
        </div>
        
        {/* Row 2: Turnaround Time Trend and Referral Trends */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TurnaroundTimeTrend />
          <ReferralTrends />
        </div>
      </div>
    </div>
  )
}
