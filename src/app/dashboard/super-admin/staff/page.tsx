'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Users, ChevronDown, User, Activity, Building2 } from 'lucide-react'
import { OverviewCards, KPICardData } from '@/components/shared'
import { SearchBar } from '@/components/shared'
import { StaffFilters } from '@/components/shared/forms/filters'
import { StaffTable } from '@/components/tables/staff-table'
import { Pagination } from '@/components/shared'
import { usePagination } from '@/hooks/usePagination'
import { UserCreationModal } from '@/components/modals/user-creation-modal'
import { staffService, StaffMember } from '@/features/users/services/staff.service'
import { analyticsService, AnalyticsMetrics } from '@/features/analytics/services/analytics.service'

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSort, setSelectedSort] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [kpis, setKpis] = useState<AnalyticsMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [staffData, kpiData] = await Promise.all([
        staffService.getStaff(),
        analyticsService.getDashboardKpis()
      ])
      setStaff(staffData)
      setKpis(kpiData)
    } catch (error) {
      console.error('Failed to fetch staff:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStaff = staff.filter(staffMember => {
    const name = `${staffMember.first_name} ${staffMember.last_name}`
    const status = staffMember.is_active ? 'active' : 'inactive'
    
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.phone.includes(searchTerm) ||
      staffMember.facility.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = selectedRole === 'all' || staffMember.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  }).sort((a, b) => {
    if (selectedSort === 'referrals') {
      return b.referralCount - a.referralCount
    } else if (selectedSort === 'lastLogin') {
      const aDate = a.lastLogin ? new Date(a.lastLogin).getTime() : 0
      const bDate = b.lastLogin ? new Date(b.lastLogin).getTime() : 0
      return bDate - aDate
    }
    return 0
  })

  const pagination = usePagination({
    totalItems: filteredStaff.length,
    initialItemsPerPage: 10
  })

  const paginatedStaff = pagination.paginatedItems(filteredStaff)

  const handleUserCreated = (newUser: any) => {
    fetchData()
  }

  const staffOverviewData: KPICardData[] = [
    {
      title: 'Total Staff',
      value: kpis?.totalUsers ?? 0,
      trend: { value: `${(kpis?.totalUsersTrend ?? 0) >= 0 ? '+' : ''}${kpis?.totalUsersTrend?.toFixed(1) ?? 0}%`, isPositive: (kpis?.totalUsersTrend ?? 0) >= 0 },
      icon: <User className="h-5 w-5" />
    },
    {
      title: 'Active Staff',
      value: kpis?.activeUsers ?? 0,
      trend: { value: `${(kpis?.activeUsersTrend ?? 0) >= 0 ? '+' : ''}${kpis?.activeUsersTrend?.toFixed(1) ?? 0}%`, isPositive: (kpis?.activeUsersTrend ?? 0) >= 0 },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'Facility Admins',
      value: kpis?.facilityAdminsCount ?? 0,
      trend: { value: `${(kpis?.facilityAdminsTrend ?? 0) >= 0 ? '+' : ''}${kpis?.facilityAdminsTrend?.toFixed(1) ?? 0}%`, isPositive: (kpis?.facilityAdminsTrend ?? 0) >= 0 },
      icon: <Building2 className="h-5 w-5" />
    },
    {
      title: 'Clinicians',
      value: kpis?.cliniciansCount ?? 0,
      trend: { value: `${(kpis?.cliniciansTrend ?? 0) >= 0 ? '+' : ''}${kpis?.cliniciansTrend?.toFixed(1) ?? 0}%`, isPositive: (kpis?.cliniciansTrend ?? 0) >= 0 },
      icon: <Users className="h-5 w-5" />
    }
  ]

  if (!isMounted || isLoading) {
  return null
}

  return (
    <div className="flex-1 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Staff</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage healthcare staff members and their roles
          </p>
        </div>

        <div className="relative">
        <Button 
          className="h-8 px-3 text-sm bg-primary/90 hover:bg-primary/80"
          onClick={() => setIsUserModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Staff
        </Button>
        </div>
      </div>

      {/* Overview */}
      <OverviewCards data={staffOverviewData} />

      {/* Search and Filters Card */}
      <Card className="bg-gray-900/60 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <SearchBar
              placeholder="name, email, phone..."
              className="w-[400px] h-8 text-xs"
              value={searchTerm}
              onChange={setSearchTerm}
            />
            
            <div className="relative z-[999999]">
              <StaffFilters
                selectedRole={selectedRole}
                selectedStatus={selectedStatus}
                selectedSort={selectedSort}
                onRoleChange={setSelectedRole}
                onStatusChange={setSelectedStatus}
                onSortChange={setSelectedSort}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <StaffTable staff={paginatedStaff} userRole="super-admin" />

      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={filteredStaff.length}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={pagination.setCurrentPage}
        onItemsPerPageChange={pagination.setItemsPerPage}
      />

      {/* User Creation Modal */}
      <UserCreationModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSuccess={handleUserCreated}
      />
    </div>
  )
}