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
import { mockStaffData } from '@/services/staff.service'

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSort, setSelectedSort] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredStaff = mockStaffData.filter(staff => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.phone.includes(searchTerm) ||
      staff.facility.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = selectedRole === 'all' || staff.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || staff.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  }).sort((a, b) => {
    if (selectedSort === 'referrals') {
      return b.referrals - a.referrals
    } else if (selectedSort === 'lastLogin') {
      return new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime()
    }
    return 0
  })

  const pagination = usePagination({
    totalItems: filteredStaff.length,
    initialItemsPerPage: 10
  })

  const paginatedStaff = pagination.paginatedItems(filteredStaff)

  const handleUserCreated = (newUser: any) => {
    // In a real app, this would add to the database
    console.log('User created:', newUser)
    // For now, just log it - in production this would refresh data or add to state
  }

  const staffOverviewData: KPICardData[] = [
    {
      title: 'Total Staff',
      value: mockStaffData.length,
      trend: { value: '+2', isPositive: true },
      icon: <User className="h-5 w-5" />
    },
    {
      title: 'Active Staff',
      value: mockStaffData.filter(s => s.status === 'active').length,
      trend: { value: '+1', isPositive: true },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'Facility Admins',
      value: mockStaffData.filter(s => s.role === 'facility_admin').length,
      trend: { value: '0', isPositive: true },
      icon: <Building2 className="h-5 w-5" />
    },
    {
      title: 'Clinicians',
      value: mockStaffData.filter(s => s.role === 'clinician').length,
      trend: { value: '+3', isPositive: true },
      icon: <Users className="h-5 w-5" />
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