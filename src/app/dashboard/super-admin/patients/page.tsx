'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Users, Activity, Calendar, UserPlus } from 'lucide-react'
import { OverviewCards, KPICardData } from '@/components/shared'
import { SearchBar } from '@/components/shared'
import { PatientFilters } from '@/components/shared/forms/patient-filters'
import { PatientTable } from '@/components/tables/patient-table'
import { Pagination } from '@/components/shared'
import { usePagination } from '@/hooks/usePagination'
import { PatientCreationModal } from '@/components/modals/patient-creation-modal'
import { EditPatientModal } from '@/components/modals/edit-patient-modal'
import { useRouter } from 'next/navigation'
import { usePatients, UIPatient } from '@/features/patients/hooks/usePatients'
import { analyticsService, AnalyticsMetrics } from '@/features/analytics/services/analytics.service'

export default function PatientsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedGender, setSelectedGender] = useState('all')
  const [selectedAgeRange, setSelectedAgeRange] = useState('all')
  const [selectedSort, setSelectedSort] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [kpis, setKpis] = useState<AnalyticsMetrics | null>(null)
  const { patients, isLoading } = usePatients()

  useEffect(() => {
    setIsMounted(true)
    fetchKpis()
  }, [])

  const fetchKpis = async () => {
    try {
      const data = await analyticsService.getDashboardKpis()
      setKpis(data)
    } catch (error) {
      console.error('Failed to fetch patient KPIs:', error)
    }
  }

  const filteredPatients = patients.filter(patient => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus
    const matchesGender = selectedGender === 'all' || patient.gender === selectedGender

    let matchesAgeRange = true
    if (selectedAgeRange !== 'all') {
      switch (selectedAgeRange) {
        case '0-18':
          matchesAgeRange = patient.age >= 0 && patient.age <= 18
          break
        case '19-40':
          matchesAgeRange = patient.age >= 19 && patient.age <= 40
          break
        case '41-65':
          matchesAgeRange = patient.age >= 41 && patient.age <= 65
          break
        case '65+':
          matchesAgeRange = patient.age >= 65
          break
      }
    }

    return matchesSearch && matchesStatus && matchesGender && matchesAgeRange
  }).sort((a, b) => {
    if (selectedSort === 'referrals') {
      return b.referrals - a.referrals
    } else if (selectedSort === 'lastVisit') {
      return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
    }
    return 0
  })

  const pagination = usePagination({
    totalItems: filteredPatients.length,
    initialItemsPerPage: 10
  })

  const paginatedPatients = pagination.paginatedItems(filteredPatients)

  const handlePatientCreated = (newPatient: any) => {
    // In a real app, this would add to the database
    // For now, just log it - in production this would refresh data or add to state
  }

  const handleViewProfile = (patient: any) => {
    // Navigate to patient profile page
    router.push(`/dashboard/super-admin/patients/${patient.id}`)
  }

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient)
    setIsEditModalOpen(true)
  }

  const patientsOverviewData: KPICardData[] = [
    {
      title: 'Total Patients',
      value: kpis?.totalPatients ?? patients.length,
      trend: { value: `${(kpis?.totalPatientsTrend ?? 0) >= 0 ? '+' : ''}${kpis?.totalPatientsTrend?.toFixed(1) ?? 0}%`, isPositive: (kpis?.totalPatientsTrend ?? 0) >= 0 },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Active Patients',
      value: kpis?.totalPatients ?? 0, // In production, backend provides 'active' status
      trend: { value: `${(kpis?.totalPatientsTrend ?? 0) >= 0 ? '+' : ''}${kpis?.totalPatientsTrend?.toFixed(1) ?? 0}%`, isPositive: (kpis?.totalPatientsTrend ?? 0) >= 0 },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'Referral Volume',
      value: kpis?.totalReferrals ?? 0,
      trend: { value: `${(kpis?.totalReferralsTrend ?? 0) >= 0 ? '+' : ''}${kpis?.totalReferralsTrend?.toFixed(1) ?? 0}%`, isPositive: (kpis?.totalReferralsTrend ?? 0) >= 0 },
      icon: <Calendar className="h-5 w-5" />
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
          <h1 className="text-2xl font-semibold text-foreground">Patients</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage patient records and medical information
          </p>
        </div>

        <div className="relative">
          <Button 
            className="h-8 px-3 text-sm bg-primary/90 hover:bg-primary/80"
            onClick={() => setIsPatientModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Patient
          </Button>
        </div>
      </div>

      {/* Overview */}
      <OverviewCards data={patientsOverviewData} />

      {/* Search and Filters Card */}
      <Card className="bg-gray-900/60 border-border/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <SearchBar
              placeholder="name, MRN, phone, location..."
              className="w-[400px] h-8 text-xs"
              value={searchTerm}
              onChange={setSearchTerm}
            />
            
            <div className="relative z-[999999]">
              <PatientFilters
                selectedStatus={selectedStatus}
                selectedGender={selectedGender}
                selectedAgeRange={selectedAgeRange}
                selectedSort={selectedSort}
                onStatusChange={setSelectedStatus}
                onGenderChange={setSelectedGender}
                onAgeRangeChange={setSelectedAgeRange}
                onSortChange={setSelectedSort}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Table */}
      <PatientTable 
        patients={paginatedPatients} 
        userRole="super-admin"
        onViewProfile={handleViewProfile}
        onEdit={handleEditPatient}
      />

      {/* Pagination */}
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={filteredPatients.length}
        itemsPerPage={pagination.itemsPerPage}
        onPageChange={pagination.setCurrentPage}
        onItemsPerPageChange={pagination.setItemsPerPage}
      />

      {/* Patient Creation Modal */}
      <PatientCreationModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccess={handlePatientCreated}
      />

      {/* Edit Patient Modal */}
      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPatient(null)
        }}
        onSuccess={(updatedPatient) => {
          setIsEditModalOpen(false)
          setSelectedPatient(null)
        }}
        patient={selectedPatient}
      />
    </div>
  )
}
