'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Building, Activity, TrendingUp } from 'lucide-react'
import { OverviewCards, KPICardData } from '@/components/shared'
import { SearchBar } from '@/components/shared'
import { FacilityFilters } from '@/components/shared/forms/facility-filters'
import { FacilityTable } from '@/components/tables/facility-table'
import { Pagination } from '@/components/shared'
import { usePagination } from '@/hooks/usePagination'
import { FacilityCreationModal } from '@/components/modals/facility-creation-modal'
import { AdminCreationModal } from '@/components/modals/admin-creation-modal'
import { facilityService } from '@/features/facilities/services/facility.service'
import { analyticsService, AnalyticsMetrics } from '@/features/analytics/services/analytics.service'

export default function FacilitiesPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCounty, setSelectedCounty] = useState('all')
  const [selectedSort, setSelectedSort] = useState('all')
  const [isMounted, setIsMounted] = useState(false)
  const [isFacilityModalOpen, setIsFacilityModalOpen] = useState(false)
  const [facilitiesData, setFacilitiesData] = useState<any[]>([])
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false)
  const [adminFacility, setAdminFacility] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [kpis, setKpis] = useState<AnalyticsMetrics | null>(null)
  const [editFacility, setEditFacility] = useState<any>(null)

  useEffect(() => {
    setIsMounted(true)
    fetchFacilitiesData()
  }, [])

  const fetchFacilitiesData = async () => {
    try {
      setIsLoading(true)
      const [facilitiesResult, kpisResult] = await Promise.all([
        facilityService.getFacilities(),
        analyticsService.getDashboardKpis()
      ])
      setFacilitiesData(facilitiesResult)
      setKpis(kpisResult)
    } catch (error) {
      console.error('Failed to fetch facilities data:', error)
      setFacilitiesData([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredFacilities = facilitiesData.filter(facility => {
    const matchesSearch =
      facility.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.phone?.includes(searchTerm) ||
      facility.facilityCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.county?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = selectedType === 'all' || facility.type === selectedType
    const matchesLevel = selectedLevel === 'all' || facility.level?.toString() === selectedLevel
    const matchesStatus = selectedStatus === 'all' || facility.status === selectedStatus
    const matchesCounty = selectedCounty === 'all' || facility.county === selectedCounty

    return matchesSearch && matchesType && matchesLevel && matchesStatus && matchesCounty
  }).sort((a, b) => {
    if (selectedSort === 'performance') return (b.performance ?? 0) - (a.performance ?? 0)
    if (selectedSort === 'joined') {
      return new Date(b.joined ?? 0).getTime() - new Date(a.joined ?? 0).getTime()
    }
    return 0
  })

  const pagination = usePagination({
    totalItems: filteredFacilities.length,
    initialItemsPerPage: 10
  })

  const paginatedFacilities = pagination.paginatedItems(filteredFacilities)

  const handleFacilityCreated = () => {
    fetchFacilitiesData()
  }

  // Called from FacilityCreationModal success screen "Create Admin" button
  const handleCreateAdmin = (facility: any) => {
    setAdminFacility(facility)
    setIsFacilityModalOpen(false)
    // Small delay to let facility modal fully unmount before opening admin modal
    setTimeout(() => setIsAdminModalOpen(true), 150)
  }

  // Called from FacilityTable "Edit" action
  const handleEditFacility = (facility: any) => {
    setEditFacility(facility)
    setIsFacilityModalOpen(true)
  }

  const handleViewProfile = (facility: any) => {
    router.push(`/dashboard/super-admin/facilities/${facility.id}`)
  }

  const handleActivate = async (facility: any) => {
    try {
      await facilityService.updateFacility(facility.id, { is_active: true })
      toast.success('Facility activated successfully')
      fetchFacilitiesData()
    } catch {
      toast.error('Failed to activate facility')
    }
  }

  const handleDeactivate = async (facility: any) => {
    try {
      await facilityService.updateDeactivate(facility.id, { is_active: false })
      toast.success('Facility deactivated')
      fetchFacilitiesData()
    } catch {
      toast.error('Failed to deactivate facility')
    }
  }

  // KPI calculations
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const newThisMonth = facilitiesData.filter(f => {
    const d = new Date(f.joined)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  }).length

  const newLastMonth = facilitiesData.filter(f => {
    const d = new Date(f.joined)
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
  }).length

  const newThisMonthTrend = newLastMonth > 0
    ? Math.round(((newThisMonth - newLastMonth) / newLastMonth) * 100)
    : newThisMonth > 0 ? 100 : 0

  const activeFacilities = facilitiesData.filter(f => f.status === 'active').length
  const inactiveFacilities = facilitiesData.filter(f => f.status === 'inactive').length
  const totalFacilities = kpis?.total_facilities ?? facilitiesData.length

  const avgPerformance = facilitiesData.length > 0
    ? Math.round(facilitiesData.reduce((sum, f) => sum + (f.performance ?? 0), 0) / facilitiesData.length)
    : 0

  const facilitiesOverviewData: KPICardData[] = [
    {
      title: 'Total Facilities',
      value: totalFacilities,
      trend: {
        value: `${activeFacilities} active, ${inactiveFacilities} inactive`,
        isPositive: activeFacilities >= inactiveFacilities
      },
      icon: <Building className="h-5 w-5" />
    },
    {
      title: 'Active Facilities',
      value: activeFacilities,
      trend: {
        value: totalFacilities > 0
          ? `${Math.round((activeFacilities / totalFacilities) * 100)}% of total`
          : '0% of total',
        isPositive: activeFacilities > inactiveFacilities
      },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'New This Month',
      value: newThisMonth,
      trend: {
        value: newLastMonth > 0
          ? `${newThisMonthTrend >= 0 ? '+' : ''}${newThisMonthTrend}% vs last month`
          : newThisMonth > 0 ? 'first this period' : 'none last month',
        isPositive: newThisMonthTrend >= 0
      },
      icon: <Plus className="h-5 w-5" />
    },
    {
      title: 'Avg Performance',
      value: `${avgPerformance}%`,
      trend: {
        value: avgPerformance >= 70
          ? 'Good — above 70%'
          : avgPerformance >= 40
          ? 'Fair — above 40%'
          : 'Low — needs attention',
        isPositive: avgPerformance >= 50
      },
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
        <Button
          className="h-8 px-3 text-sm bg-primary/90 hover:bg-primary/80"
          onClick={() => {
            setEditFacility(null)
            setIsFacilityModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Facility
        </Button>
      </div>

      {/* Overview */}
      <OverviewCards data={facilitiesOverviewData} />

      {/* Search and Filters */}
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
        onEdit={handleEditFacility}
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

      {/* Facility Creation/Edit Modal */}
      <FacilityCreationModal
        isOpen={isFacilityModalOpen}
        onClose={() => {
          setIsFacilityModalOpen(false)
          setEditFacility(null)
        }}
        onSuccess={handleFacilityCreated}
        onCreateAdmin={handleCreateAdmin}
      />

      {/* Admin Creation Modal */}
      <AdminCreationModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false)
          setAdminFacility(null)
        }}
        onSuccess={() => {
          fetchFacilitiesData()
          setIsAdminModalOpen(false)
        }}
        facility={adminFacility}
      />
    </div>
  )
}