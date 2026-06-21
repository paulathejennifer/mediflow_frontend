'use client'

import { Badge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, User, Phone, Calendar, Users } from 'lucide-react'
import { ActionDropdown } from '@/components/shared'

interface Clinician {
  id: string | number
  first_name?: string
  last_name?: string
  name?: string          // fallback
  email: string
  phone: string          // This must be the actual phone
  speciality?: string
  status: 'active' | 'inactive'
  patients?: number
  referrals?: number
  registrationDate?: string
}

interface ClinicianTableProps {
  clinicians: Clinician[]
  userRole: 'super-admin' | 'facility-admin' | 'clinician'
  onEdit?: (clinician: Clinician) => void
}

export function ClinicianTable({ clinicians, userRole, onEdit }: ClinicianTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="text-sm bg-gray-900/60 backdrop-blur-md border border-border" style={{ minWidth: '1000px', borderRadius: '0.5rem' }}>
        <thead>
          <tr className="border-b border-border bg-background/60">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[250px]">Clinician</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[200px]">Email</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[160px]">Phone</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[150px]">Specialty</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[100px]">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[80px]">Patients</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[80px]">Referrals</th>
            <th className="px-4 py-3 min-w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {clinicians.map((clinician) => {
            const fullName = clinician.name || 
                            `${clinician.first_name || ''} ${clinician.last_name || ''}`.trim()

            return (
              <tr key={clinician.id} className="border-b border-gray-800 hover:bg-gray-900">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-sm">{fullName}</div>
                      <div className="text-xs text-muted-foreground">{clinician.email}</div>
                    </div>
                  </div>
                </td>

                {/* Email Column */}
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {clinician.email}
                </td>

                {/* Phone Column - FIXED */}
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {clinician.phone || '—'}
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-600/10 text-gray-600 border-gray-600/20">
                    {clinician.speciality || '—'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    clinician.status === 'active'
                      ? 'bg-green-600/10 text-green-600 border-green-600/20'
                      : 'bg-gray-600/10 text-gray-600 border-gray-600/20'
                  }`}>
                    {clinician.status}
                  </span>
                </td>

                <td className="px-4 py-3 text-sm text-foreground">
                  {clinician.patients ?? '—'}
                </td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {clinician.referrals ?? '—'}
                </td>

                <td className="px-4 py-3 text-right">
                  <ActionDropdown
                    type="clinician"
                    userRole={userRole}
                    isActive={clinician.status === 'active'}
                    onEdit={() => onEdit?.(clinician)}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}