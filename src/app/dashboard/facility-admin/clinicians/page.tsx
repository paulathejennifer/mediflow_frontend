// 'use client'

// import { useState, useEffect } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Plus, Users, Activity, Calendar, TrendingUp } from 'lucide-react'
// import { OverviewCards, KPICardData } from '@/components/shared'
// import { SearchBar } from '@/components/shared'
// import { ClinicianFilters } from '@/components/shared/forms/clinician-filters'
// import { ClinicianTable } from '@/components/tables/clinician-table'
// import { Pagination } from '@/components/shared'
// import { usePagination } from '@/hooks/usePagination'
// import { mockCliniciansData } from '@/services/clinician.service'
// import { useRouter } from 'next/navigation'

// export default function CliniciansPage() {
//   const router = useRouter()
//   const [searchTerm, setSearchTerm] = useState('')
//   const [selectedStatus, setSelectedStatus] = useState('all')
//   const [selectedSpecialty, setSelectedSpecialty] = useState('all')
//   const [selectedSort, setSelectedSort] = useState('all')
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//   const [isMounted, setIsMounted] = useState(false)
//   const [isClinicianModalOpen, setIsClinicianModalOpen] = useState(false)

//   useEffect(() => {
//     setIsMounted(true)
//   }, [])

//   const filteredClinicians = mockCliniciansData.filter(clinician => {
//     const matchesSearch =
//       clinician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       clinician.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       clinician.phone.includes(searchTerm) ||
//       clinician.specialty.toLowerCase().includes(searchTerm.toLowerCase())

//     const matchesStatus = selectedStatus === 'all' || clinician.status === selectedStatus
//     const matchesSpecialty = selectedSpecialty === 'all' || clinician.specialty === selectedSpecialty

//     return matchesSearch && matchesStatus && matchesSpecialty
//   }).sort((a, b) => {
//     if (selectedSort === 'patients') {
//       return b.patients - a.patients
//     } else if (selectedSort === 'referrals') {
//       return b.referrals - a.referrals
//     }
//     return 0
//   })

//   const pagination = usePagination({
//     totalItems: filteredClinicians.length,
//     initialItemsPerPage: 10
//   })

//   const paginatedClinicians = pagination.paginatedItems(filteredClinicians)

//   const handleClinicianCreated = (newClinician: any) => {
//     // In a real app, this would add to the database
//     console.log('Clinician created:', newClinician)
//     // For now, just log it - in production this would refresh data or add to state
//   }

//   const cliniciansOverviewData: KPICardData[] = [
//     {
//       title: 'Total Clinicians',
//       value: mockCliniciansData.length,
//       trend: { value: '+8', isPositive: true },
//       icon: <Users className="h-5 w-5" />
//     },
//     {
//       title: 'Active Clinicians',
//       value: mockCliniciansData.filter(c => c.status === 'active').length,
//       trend: { value: '+3', isPositive: true },
//       icon: <Activity className="h-5 w-5" />
//     },
//     {
//       title: 'New This Month',
//       value: mockCliniciansData.filter(c => {
//         const registrationDate = new Date(c.registrationDate)
//         const currentMonth = new Date().getMonth()
//         const currentYear = new Date().getFullYear()
//         return registrationDate.getMonth() === currentMonth && registrationDate.getFullYear() === currentYear
//       }).length,
//       trend: { value: '+5', isPositive: true },
//       icon: <Calendar className="h-5 w-5" />
//     },
//     {
//       title: 'Referral Volume',
//       value: mockCliniciansData.reduce((sum, c) => sum + c.referrals, 0),
//       trend: { value: '+15', isPositive: true },
//       icon: <TrendingUp className="h-5 w-5" />
//     }
//   ]

//   if (!isMounted) {
//     return null
//   }

//   return (
//     <div className="flex-1 space-y-6 overflow-x-hidden">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold text-foreground">Clinicians</h1>
//           <p className="text-muted-foreground text-sm mt-1">
//             Manage facility clinicians and staff assignments
//           </p>
//         </div>

//         <div className="relative">
//           <Button 
//             className="h-8 px-3 text-sm bg-primary/90 hover:bg-primary/80"
//             onClick={() => setIsClinicianModalOpen(true)}
//           >
//             <Plus className="h-4 w-4 mr-1" />
//             Add Clinician
//           </Button>
//         </div>
//       </div>

//       {/* Overview */}
//       <OverviewCards data={cliniciansOverviewData} />

//       {/* Search and Filters Card */}
//       <Card className="bg-gray-900/60 border-border/50">
//         <CardContent className="p-4">
//           <div className="flex items-center justify-between gap-3 flex-wrap">
//             <SearchBar
//               placeholder="name, email, phone, specialty..."
//               className="w-[400px] h-8 text-xs"
//               value={searchTerm}
//               onChange={setSearchTerm}
//             />
            
//             <div className="relative z-[999999]">
//               <ClinicianFilters
//                 selectedStatus={selectedStatus}
//                 selectedSpecialty={selectedSpecialty}
//                 selectedSort={selectedSort}
//                 onStatusChange={setSelectedStatus}
//                 onSpecialtyChange={setSelectedSpecialty}
//                 onSortChange={setSelectedSort}
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Clinician Table */}
//       <ClinicianTable 
//         clinicians={paginatedClinicians} 
//         userRole="super-admin"
//       />

//       {/* Pagination */}
//       <Pagination
//         currentPage={pagination.currentPage}
//         totalPages={pagination.totalPages}
//         totalItems={filteredClinicians.length}
//         itemsPerPage={pagination.itemsPerPage}
//         onPageChange={pagination.setCurrentPage}
//         onItemsPerPageChange={pagination.setItemsPerPage}
//       />

//       {/* Clinician Creation Modal */}
//       <ClinicianCreationModal
//         isOpen={isClinicianModalOpen}
//         onClose={() => setIsClinicianModalOpen(false)}
//         onSuccess={handleClinicianCreated}
//       />
//     </div>
//   )
// }
