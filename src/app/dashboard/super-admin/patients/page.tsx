'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Users, Activity, Calendar, UserPlus } from 'lucide-react'
import { OverviewCards, KPICardData } from '@/components/shared/overview-cards'
import { SearchBar } from '@/components/shared/search-bar'
import { PatientFilters } from '@/components/shared/patient-filters'
import { PatientTable } from '@/components/tables/patient-table'
import { Pagination } from '@/components/shared/pagination'
import { usePagination } from '@/hooks/usePagination'
import { PatientCreationModal } from '@/components/modals/patient-creation-modal'
import { mockPatientsData } from '@/services/patient.service'

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedGender, setSelectedGender] = useState('all')
  const [selectedAgeRange, setSelectedAgeRange] = useState('all')
  const [selectedSort, setSelectedSort] = useState('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const filteredPatients = mockPatientsData.filter(patient => {
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
    console.log('Patient created:', newPatient)
    // For now, just log it - in production this would refresh data or add to state
  }

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
      trend: { value: '+5', isPositive: true },
      icon: <UserPlus className="h-5 w-5" />
    },
    {
      title: 'Referral Volume',
      value: mockPatientsData.reduce((sum, p) => sum + p.referrals, 0),
      trend: { value: '+15', isPositive: true },
      icon: <Calendar className="h-5 w-5" />
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
      <PatientTable patients={paginatedPatients} />

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
    </div>
  )
}
