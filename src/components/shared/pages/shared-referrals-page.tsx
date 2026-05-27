'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, Users, Activity, TrendingUp } from 'lucide-react'
import { OverviewCards, KPICardData, SearchBar } from '@/components/shared'
import { ReferralFilters } from '@/components/shared/forms/referral-filters'
import { RecentReferralsTable } from '@/components/tables/recent-referrals-table'
import { Pagination } from '@/components/shared'
import { usePagination } from '@/hooks/usePagination'
import { referralService } from '@/features/referrals/services/referral.service'
import { analyticsService, AnalyticsMetrics } from '@/features/analytics/services/analytics.service'
import { mapReferralSummaryToTableRow, ReferralTableRow } from '@/utils/referral-mappers'
import { ROLES, UserRole } from '@/constants/roles'
import { toast } from '@/lib/toast'

interface SharedReferralsPageProps {
  userRole: UserRole
}

export function SharedReferralsPage({ userRole }: SharedReferralsPageProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedSort, setSelectedSort] = useState('all')
  const [isMounted, setIsMounted] = useState(false)
  const [referrals, setReferrals] = useState<ReferralTableRow[]>([])
  const [kpis, setKpis] = useState<AnalyticsMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const [refData, kpiData] = await Promise.all([
        referralService.getReferrals({ limit: 200 }),
        analyticsService.getDashboardKpis()
      ])
      setReferrals(refData.map(mapReferralSummaryToTableRow))
      setKpis(kpiData)
    } catch (error) {
      console.error('Failed to fetch referrals:', error)
      toast.error('Failed to load referrals')
      setReferrals([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchDataCombined = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  useEffect(() => {
    setIsMounted(true)
    fetchDataCombined()
  }, [fetchDataCombined])

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch =
      referral.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.receivingFacility.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === 'all' || referral.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || referral.priority === selectedPriority

    return matchesSearch && matchesStatus && matchesPriority
  }).sort((a, b) => {
    if (selectedSort === 'date') {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    } else if (selectedSort === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return 0
  })

  const pagination = usePagination({
    totalItems: filteredReferrals.length,
    initialItemsPerPage: 10
  })

  const paginatedReferrals = pagination.paginatedItems(filteredReferrals)

  const pageConfig: Record<string, { title: string; description: string; placeholder: string }> = {
    [ROLES.CLINICIAN]: {
      title: 'Referrals',
      description: 'Manage patient referrals and treatment requests',
      placeholder: 'patient, condition, facility, ID...'
    },
    [ROLES.FACILITY_ADMIN]: {
      title: 'Referrals',
      description: 'Manage facility referrals and patient transfers',
      placeholder: 'patient, condition, facility, ID...'
    }
  }

  const config = pageConfig[userRole] || pageConfig[ROLES.CLINICIAN]

  const referralsOverviewData: KPICardData[] = [
    {
      title: 'Total Referrals',
      value: kpis?.totalReferrals ?? 0,
      trend: { value: `${(kpis?.totalReferralsTrend ?? 0) >= 0 ? '+' : ''}${kpis?.totalReferralsTrend?.toFixed(1) ?? 0}%`, isPositive: (kpis?.totalReferralsTrend ?? 0) >= 0 },
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Pending Action',
      value: kpis?.pendingReferrals ?? 0,
      trend: { value: '0%', isPositive: true }, // Backend doesn't provide trend for pending count
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'Total Patients',
      value: kpis?.totalPatients ?? 0,
      trend: { value: `${(kpis?.totalPatientsTrend ?? 0) >= 0 ? '+' : ''}${kpis?.totalPatientsTrend?.toFixed(1) ?? 0}%`, isPositive: (kpis?.totalPatientsTrend ?? 0) >= 0 },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Monthly Documents',
      value: kpis?.totalDocuments ?? 0,
      trend: { value: `${(kpis?.totalDocumentsTrend ?? 0) >= 0 ? '+' : ''}${kpis?.totalDocumentsTrend?.toFixed(1) ?? 0}%`, isPositive: (kpis?.totalDocumentsTrend ?? 0) >= 0 },
      icon: <TrendingUp className="h-5 w-5" />
    }
  ]

  const rolePath = userRole.replace('_', '-')

  if (!isMounted || isLoading) {
    return null
  }

  return (
    <div className="flex-1 space-y-6 overflow-x-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{config.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {config.description}
          </p>
        </div>

        <Button 
          className="h-8 px-3 text-sm bg-primary/90 hover:bg-primary/80"
          onClick={() => router.push(`/dashboard/${rolePath}/referrals/create`)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Create Referral
        </Button>
      </div>

      <OverviewCards data={referralsOverviewData} />

      <Card className="bg-gray-900/60 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <SearchBar
              placeholder={config.placeholder}
              className="w-[400px] h-8 text-xs"
              value={searchTerm}
              onChange={setSearchTerm}
            />
            
            <div className="relative z-[999999]">
              <ReferralFilters
                selectedStatus={selectedStatus}
                selectedPriority={selectedPriority}
                selectedSort={selectedSort}
                onStatusChange={setSelectedStatus}
                onPriorityChange={setSelectedPriority}
                onSortChange={setSelectedSort}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/60 backdrop-blur-md border border-border/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileText className="h-5 w-5 mr-2 text-primary" />
            Recent Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecentReferralsTable 
            referrals={paginatedReferrals} 
            userRole={userRole === ROLES.SUPER_ADMIN ? 'facility-admin' : 
                    userRole === ROLES.FACILITY_ADMIN ? 'facility-admin' : 
                    userRole === ROLES.CLINICIAN ? 'clinician' : 'clinician'} 
          />
        </CardContent>
      </Card>

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={filteredReferrals.length}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={pagination.setCurrentPage}
        onItemsPerPageChange={pagination.setItemsPerPage}
      />
    </div>
  )
}
