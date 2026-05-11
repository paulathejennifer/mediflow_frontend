'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, FileText, Users, Activity, TrendingUp } from 'lucide-react'
import { OverviewCards, KPICardData, SearchBar } from '@/components/shared'
import { ReferralFilters } from '@/components/shared/forms/referral-filters'
import { RecentReferralsTable } from '@/components/tables/recent-referrals-table'
import { Pagination } from '@/components/shared'
import { usePagination } from '@/hooks/usePagination'
import { mockReferralsData } from '@/services/referral.service'
import { ROLES, UserRole } from '@/constants/roles'

interface SharedReferralsPageProps {
  userRole: UserRole
}

export function SharedReferralsPage({ userRole }: SharedReferralsPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedSort, setSelectedSort] = useState('all')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredReferrals = mockReferralsData.filter(referral => {
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
      return new Date(b.date).getTime() - new Date(a.date).getTime()
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

  // Role-specific configurations
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
      value: mockReferralsData.length,
      trend: { value: '+12', isPositive: true },
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Pending',
      value: mockReferralsData.filter(r => r.status === 'pending').length,
      trend: { value: '+5', isPositive: true },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'Accepted',
      value: mockReferralsData.filter(r => r.status === 'accepted').length,
      trend: { value: '+8', isPositive: true },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Completed',
      value: mockReferralsData.filter(r => r.status === 'completed').length,
      trend: { value: '+3', isPositive: true },
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
          <h1 className="text-2xl font-semibold text-foreground">{config.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {config.description}
          </p>
        </div>

        <Button className="h-8 px-3 text-sm bg-primary/90 hover:bg-primary/80">
          <Plus className="h-4 w-4 mr-1" />
          Create Referral
        </Button>
      </div>

      {/* Overview */}
      <OverviewCards data={referralsOverviewData} />

      {/* Search and Filters Card */}
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

      {/* Referrals Table */}
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

      {/* Pagination */}
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
