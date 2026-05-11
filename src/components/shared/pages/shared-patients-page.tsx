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
import { mockPatientsData } from '@/services/patient.service'
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

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredPatients = mockPatientsData.filter(patient => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
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
      return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
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
    console.log('Patient created:', newPatient)
    // For now, just log it - in production this would refresh data or add to state
  }

  const handleEditPatient = (patient: any) => {
    setSelectedPatient(patient)
    setIsEditModalOpen(true)
  }

  const handlePatientUpdated = (updatedPatient: any) => {
    // In a real app, this would update database
    console.log('Patient updated:', updatedPatient)
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
      value: mockPatientsData.length,
      trend: { value: '+12', isPositive: true },
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Active Patients',
      value: mockPatientsData.filter(p => p.status === 'active').length,
      trend: { value: '+8', isPositive: true },
      icon: <Activity className="h-5 w-5" />
    },
    {
      title: 'New This Month',
      value: mockPatientsData.filter(p => {
        const registrationDate = new Date(p.registrationDate)
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        return registrationDate.getMonth() === currentMonth && registrationDate.getFullYear() === currentYear
      }).length,
      trend: { value: '+15', isPositive: true },
      icon: <Calendar className="h-5 w-5" />
    },
    {
      title: 'Inactive Patients',
      value: mockPatientsData.filter(p => p.status === 'inactive').length,
      trend: { value: '+3', isPositive: true },
      icon: <UserPlus className="h-5 w-5" />
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
