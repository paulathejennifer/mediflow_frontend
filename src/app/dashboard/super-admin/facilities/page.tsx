'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Building, Activity, TrendingUp, MapPin } from 'lucide-react'
import { OverviewCards, KPICardData } from '@/components/shared'
import { SearchBar } from '@/components/shared'
import { FacilityFilters } from '@/components/shared/forms/facility-filters'
import { FacilityTable } from '@/components/tables/facility-table'
import { Pagination } from '@/components/shared'
import { usePagination } from '@/hooks/usePagination'
import { FacilityCreationModal } from '@/components/modals/facility-creation-modal'
import { AdminCreationModal } from '@/components/modals/admin-creation-modal'
import { facilityService } from '@/features/facilities/services/facility.service'

export default function FacilitiesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCounty, setSelectedCounty] = useState('all')
  const [selectedSort, setSelectedSort] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false)
  const [facilitiesData, setFacilitiesData] = useState<any[]>([])
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [adminFacility, setAdminFacility] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    fetchFacilitiesData()
  }, [])

  const fetchFacilitiesData = async () => {
    try {
      const data = await facilityService.getFacilities()
      // Transform data to match component expectations
      const transformedData = data.map((facility: any) => ({
        ...facility,
        status: facility.is_active ? 'active' : 'inactive',
        joined: facility.created_at || new Date().toISOString(),
        performance: facility.performance_score ?? 0
      }))
      setFacilitiesData(transformedData)
    } catch (error) {
      console.error('Failed to fetch facilities data:', error)
      setFacilitiesData([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFacilities = facilitiesData.filter(facility => {
    const matchesSearch =
      facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.phone.includes(searchTerm) ||
      facility.facilityCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.county.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === 'all' || facility.type === selectedType
    const matchesLevel = selectedLevel === 'all' || facility.level.toString() === selectedLevel
    const matchesStatus = selectedStatus === 'all' || facility.status === selectedStatus
    const matchesCounty = selectedCounty === 'all' || facility.county === selectedCounty

    return matchesSearch && matchesType && matchesLevel && matchesStatus && matchesCounty
  }).sort((a, b) => {
    if (selectedSort === 'performance') {
      return b.performance - a.performance
    } else if (selectedSort === 'joined') {
      const dateA = a.joined ? new Date(a.joined).getTime() : 0
      const dateB = b.joined ? new Date(b.joined).getTime() : 0
      return dateB - dateA
    }
    return 0
  })

  const pagination = usePagination({
    totalItems: filteredFacilities.length,
    initialItemsPerPage: 10
  })

  const paginatedFacilities = pagination.paginatedItems(filteredFacilities)

  const handleFacilityCreated = (newFacility: any) => {
    // Refresh the table data
    fetchFacilitiesData()
  }

  const handleCreateAdmin = (facility: any) => {
    setAdminFacility(facility)
    setIsFacilityModalOpen(false)
    setIsAdminModalOpen(true)
  }

  const handleViewProfile = (facility: any) => {
    router.push(`/dashboard/super-admin/facilities/${facility.id}`)
  }

  const handleActivate = async (facility: any) => {
    try {
      await facilityService.updateFacility(facility.id, { is_active: true })
      toast.success('Facility activated successfully')
      fetchFacilitiesData()
    } catch (err) {
      toast.error('Failed to activate facility')
    }
  }

  const handleDeactivate = async (facility: any) => {
    try {
      await facilityService.updateDeactivate(facility.id, { is_active: false })
      toast.success('Facility deactivated')
      fetchFacilitiesData()
    } catch (err) {
      toast.error('Failed to deactivate facility')
    }
  }

  const facilitiesOverviewData: KPICardData[] = [
    {
      title: 'Total Facilities',
      value: facilitiesData.length,
      trend: { value: '+8', isPositive: true },
      icon: <Building className="h-5 w-5" />
    },
    {
      title: 'Active Facilities',
      value: facilitiesData.filter(f => f.status === 'active').length,
      trend: { value: '+5', isPositive: true },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'New Facilities',
      value: facilitiesData.filter(f => {
        const joinedDate = new Date(f.joined)
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        return joinedDate.getMonth() === currentMonth && joinedDate.getFullYear() === currentYear
      }).length,
      trend: { value: '+2', isPositive: true },
      icon: <Plus className="h-5 w-5" />
    },
    {
      title: 'Average Performance',
      value: Math.round(facilitiesData.reduce((sum, f) => sum + f.performance, 0) / facilitiesData.length) + '%',
      trend: { value: '+12%', isPositive: true },
      icon: <TrendingUp className="h-5 w-5" />
    }
  ]

  if (!isMounted || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Loading facilities...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Facilities</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage healthcare facilities and monitor performance
          </p>
        </div>

        <div className="relative">
          <Button 
            className="h-8 px-3 text-sm bg-primary/90 hover:bg-primary/80"
            onClick={() => setIsFacilityModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Facility
          </Button>
        </div>
      </div>

      {/* Overview */}
      <OverviewCards data={facilitiesOverviewData} />

      {/* Search and Filters Card */}
      <Card className="bg-gray-900/60 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <SearchBar
              placeholder="name, facility code, phone, county..."
              className="w-[400px] h-8 text-xs"
              value={searchTerm}
              onChange={setSearchTerm}
            />
            
            <div className="relative z-[999999]">
              <FacilityFilters
                selectedType={selectedType}
                selectedLevel={selectedLevel}
                selectedStatus={selectedStatus}
                selectedCounty={selectedCounty}
                selectedSort={selectedSort}
                onTypeChange={setSelectedType}
                onLevelChange={setSelectedLevel}
                onStatusChange={setSelectedStatus}
                onCountyChange={setSelectedCounty}
                onSortChange={setSelectedSort}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Facility Table */}
      <FacilityTable 
        facilities={paginatedFacilities} 
        userRole="super-admin" 
        onViewProfile={handleViewProfile}
        onEdit={(f) => { setAdminFacility(f); setIsFacilityModalOpen(true); }}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
      />

      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={filteredFacilities.length}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={pagination.setCurrentPage}
        onItemsPerPageChange={pagination.setItemsPerPage}
      />

      {/* Facility Creation Modal */}
      <FacilityCreationModal
        isOpen={isFacilityModalOpen}
        onClose={() => setIsFacilityModalOpen(false)}
        onSuccess={handleFacilityCreated}
        onCreateAdmin={handleCreateAdmin}
      />

      {/* Admin Creation Modal */}
      <AdminCreationModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSuccess={() => fetchFacilitiesData()}
        facility={adminFacility}
      />
    </div>
  )
}
