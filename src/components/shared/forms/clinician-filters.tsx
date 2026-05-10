// 'use client'

// import { useState } from 'react'

// interface ClinicianFiltersProps {
//   selectedStatus: string
//   selectedSpecialty: string
//   selectedSort: string
//   onStatusChange: (status: string) => void
//   onSpecialtyChange: (specialty: string) => void
//   onSortChange: (sort: string) => void
// }

// export function ClinicianFilters({ 
//   selectedStatus, 
//   selectedSpecialty, 
//   selectedSort,
//   onStatusChange,
//   onSpecialtyChange,
//   onSortChange 
// }: ClinicianFiltersProps) {
//   const [isOpen, setIsOpen] = useState(false)

//   return (
//     <div className="relative z-[999999]">
//       <Button
//         variant="outline"
//         size="sm"
//         onClick={() => setIsOpen(!isOpen)}
//         className="h-8 px-3 text-xs"
//       >
//         Filters
//       </Button>

//       {isOpen && (
//         <>
//           <div 
//             className="fixed inset-0 z-40" 
//             onClick={() => setIsOpen(false)}
//           />
//           <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
//             <div className="py-2">
//               <div className="space-y-3">
//                 <div>
//                   <label className="text-xs text-muted-foreground block mb-1">Status</label>
//                   <select
//                     value={selectedStatus}
//                     onChange={(e) => onStatusChange(e.target.value)}
//                     className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary"
//                   >
//                     <option value="all">All</option>
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-xs text-muted-foreground block mb-1">Specialty</label>
//                   <select
//                     value={selectedSpecialty}
//                     onChange={(e) => onSpecialtyChange(e.target.value)}
//                     className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary"
//                   >
//                     <option value="all">All</option>
//                     <option value="cardiology">Cardiology</option>
//                     <option value="neurology">Neurology</option>
//                     <option value="orthopedics">Orthopedics</option>
//                     <option value="pediatrics">Pediatrics</option>
//                     <option value="general">General Practice</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="text-xs text-muted-foreground block mb-1">Sort By</label>
//                   <select
//                     value={selectedSort}
//                     onChange={(e) => onSortChange(e.target.value)}
//                     className="w-full px-2 py-1 text-sm bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-primary"
//                   >
//                     <option value="all">All</option>
//                     <option value="patients">Patients</option>
//                     <option value="referrals">Referrals</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }
