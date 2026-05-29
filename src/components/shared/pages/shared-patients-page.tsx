'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Users, Activity, Calendar, UserPlus, TrendingUp } from 'lucide-react'
import { OverviewCards, KPICardData } from '@/components/shared'
import { SearchBar } from '@/components/shared'
import { PatientFilters } from '@/components/shared/forms/patient-filters'
import { PatientTable } from '@/components/tables/patient-table'
import { Pagination } from '@/components/shared'
import { usePagination } from '@/hooks/usePagination'
import { PatientCreationModal } from '@/components/modals/patient-creation-modal'
import { EditPatientModal } from '@/components/modals/edit-patient-modal'
import { analyticsService, AnalyticsMetrics } from '@/features/analytics/services/analytics.service'
import { patientService } from '@/features/patients/services/patient.service'
import { useRouter } from 'next/navigation'
import { ROLES, UserRole } from '@/constants/roles'

interface SharedPatientsPageProps {
  userRole: UserRole
}

export function SharedPatientsPage({ userRole }: SharedPatientsPageProps) {
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
  const [patientsData, setPatientsData] = useState<any[]>([])
  const [kpis, setKpis] = useState<AnalyticsMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    fetchDataCombined() // Call the combined fetch function
  }, [])

  const fetchData = async () => {
    await Promise.all([fetchPatientsData(), fetchKpis()])
  }

  const fetchDataCombined = async () => {
    await fetchData();
  }

  const fetchKpis = async () => {
    try {
      const data = await analyticsService.getDashboardKpis()
      setKpis(data)
    } catch (error) {
      console.error('Failed to fetch patient KPIs:', error)
    }
  }


  const fetchPatientsData = async () => {
    try {
      const data = await patientService.getPatients()
      // Transform data to match component expectations
      const transformedData = data.map((patient: any) => {
        const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()
        return {
          ...patient,
          name: `${patient.first_name} ${patient.last_name}`,
          phone: patient.phone || 'No phone', // Ensure phone is explicitly mapped
          status: 'active', // Default to active since Patient interface doesn't have status
          registrationDate: patient.created_at,
          age,
          mrn: patient.identifiers?.[0]?.mrn || 'N/A'
        }
      })
      setPatientsData(transformedData)
    } catch (error) {
      console.error('Failed to fetch patients data:', error)
      setPatientsData([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPatients = patientsData.filter(patient => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.phone || '').includes(searchTerm) ||
      patient.mrn.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus === 'all' || patient.status === selectedStatus
    const matchesGender = selectedGender === 'all' || patient.gender === selectedGender
    const matchesAgeRange = selectedAgeRange === 'all' || 
      (selectedAgeRange === '0-18' && patient.age <= 18) ||
      (selectedAgeRange === '19-35' && patient.age > 18 && patient.age <= 35) ||
      (selectedAgeRange === '36-50' && patient.age > 35 && patient.age <= 50) ||
      (selectedAgeRange === '51+' && patient.age > 50)

    return matchesSearch && matchesStatus && matchesGender && matchesAgeRange
  }).sort((a, b) => {
    if (selectedSort === 'name') {
      return a.name.localeCompare(b.name)
    } else if (selectedSort === 'date') {
      const dateA = a.registrationDate ? new Date(a.registrationDate).getTime() : 0;
      const dateB = b.registrationDate ? new Date(b.registrationDate).getTime() : 0;
      return dateB - dateA;
    }
    return 0
  })

  const pagination = usePagination({
    totalItems: filteredPatients.length,
    initialItemsPerPage: 10
  })

  const paginatedPatients = pagination.paginatedItems(filteredPatients)

  const handlePatientCreated = (newPatient: any) => {
    // In a real app, this would add to database
    // For now, just log it - in production this would refresh data or add to state
  }

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient)
    setIsEditModalOpen(true)
  }

  const handlePatientUpdated = (updatedPatient: any) => {
    // In a real app, this would update database
    // For now, just log it - in production this would refresh data
  }

  const handleViewProfile = (patient: any) => {
    // Navigate to patient profile page based on user role
    if (userRole === ROLES.SUPER_ADMIN) {
      router.push(`/dashboard/super-admin/patients/${patient.id}`)
    } else if (userRole === ROLES.FACILITY_ADMIN) {
      router.push(`/dashboard/facility-admin/patients/${patient.id}`)
    } else if (userRole === ROLES.CLINICIAN) {
      router.push(`/dashboard/clinician/patients/${patient.id}`)
    }
  }

  // Role-specific configurations
  const pageConfig: Record<string, { title: string; description: string; placeholder: string }> = {
    [ROLES.CLINICIAN]: {
      title: 'Patients',
      description: 'Manage patient records and treatment information',
      placeholder: 'name, email, phone, MRN...'
    },
    [ROLES.FACILITY_ADMIN]: {
      title: 'Patients',
      description: 'Manage patient records and referral information',
      placeholder: 'name, email, phone, patient ID...'
    }
  }

  const config = pageConfig[userRole] || pageConfig[ROLES.CLINICIAN]

  const patientsOverviewData: KPICardData[] = [
    {
      title: 'Total Patients',
      value: kpis?.totalPatients ?? 0,
      trend: { value: `${(kpis?.totalPatientsTrend ?? 0) >= 0 ? '+' : ''}${kpis?.totalPatientsTrend ?? 0}%`, isPositive: (kpis?.totalPatientsTrend ?? 0) >= 0 },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Active Patients',
      value: kpis?.totalPatients ?? 0,
      trend: { value: `${(kpis?.totalPatientsTrend ?? 0) >= 0 ? '+' : ''}${kpis?.totalPatientsTrend ?? 0}%`, isPositive: (kpis?.totalPatientsTrend ?? 0) >= 0 },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'Monthly Referrals',
      value: kpis?.totalReferrals ?? 0,
      trend: { value: `${(kpis?.totalReferralsTrend ?? 0) >= 0 ? '+' : ''}${kpis?.totalReferralsTrend ?? 0}%`, isPositive: (kpis?.totalReferralsTrend ?? 0) >= 0 },
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: 'Referral Growth',
      value: `${(kpis?.totalReferralsTrend ?? 0) >= 0 ? '+' : ''}${kpis?.totalReferralsTrend ?? 0}%`,
      trend: { value: 'Overall', isPositive: (kpis?.totalReferralsTrend ?? 0) >= 0 },
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
              placeholder={config.placeholder}
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
        userRole={userRole === ROLES.SUPER_ADMIN ? 'super-admin' : 
                userRole === ROLES.FACILITY_ADMIN ? 'facility-admin' : 
                userRole === ROLES.CLINICIAN ? 'clinician' : 'clinician'}
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
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handlePatientUpdated}
        patient={selectedPatient}
      />
    </div>
  )
}
