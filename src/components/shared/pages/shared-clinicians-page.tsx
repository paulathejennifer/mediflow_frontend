'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Users, Activity, Calendar, TrendingUp } from 'lucide-react'
import { OverviewCards, KPICardData } from '@/components/shared'
import { SearchBar } from '@/components/shared'
import { StaffFilters } from '@/components/shared/forms/filters'
import { StaffTable } from '@/components/tables/staff-table'
import { Pagination } from '@/components/shared'
import { usePagination } from '@/hooks/usePagination'
import { staffService } from '@/services/staff.service'
import { useRouter } from 'next/navigation'
import { ClinicianCreationModal } from '@/components/modals/clinician-creation-modal'
import { useAuthStore } from '@/store/auth-store'
import { ROLES, UserRole } from '@/constants/roles'

interface SharedCliniciansPageProps {
  userRole: UserRole
}

export function SharedCliniciansPage({ userRole }: SharedCliniciansPageProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSpecialty, setSelectedSpecialty] = useState('all')
  const [selectedSort, setSelectedSort] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isClinicianModalOpen, setIsClinicianModalOpen] = useState(false)
  const [staffData, setStaffData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    fetchStaffData()
  }, [])

  const fetchStaffData = async () => {
    try {
      const data = await staffService.getStaff()
      // Transform data to match component expectations
      const transformedData = data.map((staff: any) => ({
        ...staff,
        name: `${staff.first_name} ${staff.last_name}`,
        status: staff.is_active ? 'active' : 'inactive',
        joinDate: staff.created_at,
      }))
      setStaffData(transformedData)
    } catch (error) {
      console.error('Failed to fetch staff data:', error)
      setStaffData([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredClinicians = staffData.filter(clinician => {
    // Exclude super admin role
    if (clinician.role === 'super_admin') return false

    const matchesSearch =
      clinician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinician.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clinician.phone.includes(searchTerm) ||
      clinician.role.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === 'all' || clinician.status === selectedStatus
    const matchesRole = selectedSpecialty === 'all' || clinician.role === selectedSpecialty

    return matchesSearch && matchesStatus && matchesRole
  }).sort((a, b) => {
    if (selectedSort === 'referrals') {
      return b.referrals - a.referrals
    }
    return 0
  })

  const pagination = usePagination({
    totalItems: filteredClinicians.length,
    initialItemsPerPage: 10
  })

  const paginatedClinicians = pagination.paginatedItems(filteredClinicians)

  const handleClinicianCreated = (newClinician: any) => {
    // In a real app, this would add to the database
    // For now, just log it - in production this would refresh data or add to state
    // Note: Don't close modal here - let the modal show success screen first
  }

  // Role-specific configurations
  const pageConfig: Record<string, { title: string; description: string; showAddButton: boolean; canViewDetails: boolean }> = {
    [ROLES.CLINICIAN]: {
      title: 'Clinicians',
      description: 'View clinician team and referral information',
      showAddButton: false,
      canViewDetails: false
    },
    [ROLES.FACILITY_ADMIN]: {
      title: 'Clinicians',
      description: 'Manage facility clinicians and staff assignments',
      showAddButton: true,
      canViewDetails: true
    }
  }

  const config = pageConfig[userRole] || pageConfig[ROLES.CLINICIAN]

  const cliniciansOverviewData: KPICardData[] = [
    {
      title: 'Total Clinicians',
      value: staffData.filter(c => c.role !== 'super_admin').length,
      trend: { value: '+8', isPositive: true },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Active Clinicians',
      value: staffData.filter(c => c.status === 'active' && c.role !== 'super_admin').length,
      trend: { value: '+3', isPositive: true },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'New This Month',
      value: staffData.filter(c => {
        const registrationDate = new Date(c.joinDate)
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        return registrationDate.getMonth() === currentMonth && registrationDate.getFullYear() === currentYear && c.role !== 'super_admin'
      }).length,
      trend: { value: '+5', isPositive: true },
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: 'Referral Volume',
      value: staffData.filter(c => c.role !== 'super_admin').reduce((sum, c) => sum + c.referrals, 0),
      trend: { value: '+15', isPositive: true },
      icon: <TrendingUp className="h-5 w-5" />
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
          <h1 className="text-2xl font-semibold text-foreground">{config.title}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {config.description}
          </p>
        </div>

        {/* Conditional Add Clinician Button - only for facility admin */}
        {config.showAddButton && (
          <div className="relative">
            <Button 
              className="h-8 px-3 text-sm bg-primary/90 hover:bg-primary/80"
              onClick={() => setIsClinicianModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Clinician
            </Button>
          </div>
        )}
      </div>

      {/* Overview */}
      <OverviewCards data={cliniciansOverviewData} />

      {/* Search and Filters Card */}
      <Card className="bg-gray-900/60 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <SearchBar
              placeholder="name, email, phone, role..."
              className="w-[400px] h-8 text-xs"
              value={searchTerm}
              onChange={setSearchTerm}
            />
            
            <div className="relative z-[999999]">
              <StaffFilters
                selectedStatus={selectedStatus}
                selectedRole={selectedSpecialty}
                selectedSort={selectedSort}
                onStatusChange={setSelectedStatus}
                onRoleChange={setSelectedSpecialty}
                onSortChange={setSelectedSort}
                excludeRoles={['super_admin']}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clinician Table */}
      <StaffTable 
        staff={paginatedClinicians} 
        userRole={userRole === ROLES.SUPER_ADMIN ? 'super-admin' : 
                userRole === ROLES.FACILITY_ADMIN ? 'facility-admin' : 
                userRole === ROLES.CLINICIAN ? 'clinician' : 'clinician'}
      />

      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={filteredClinicians.length}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={pagination.setCurrentPage}
        onItemsPerPageChange={pagination.setItemsPerPage}
      />

      {/* Clinician Creation Modal - only for facility admin */}
      {config.showAddButton && (
        <ClinicianCreationModal
          isOpen={isClinicianModalOpen}
          onClose={() => setIsClinicianModalOpen(false)}
          onSuccess={handleClinicianCreated}
          preSelectedFacilityId={userRole === ROLES.FACILITY_ADMIN ? user?.facility_id?.toString() : undefined}
        />
      )}
    </div>
  )
}
