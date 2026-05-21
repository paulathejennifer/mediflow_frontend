import { Badge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, User, Phone, Calendar } from 'lucide-react'
import { UIPatient } from '@/hooks/usePatients'
import { ActionDropdown } from '@/components/shared'
import { formatTableDate } from '@/utils/date-utils'

interface PatientTableProps {
  patients: UIPatient[]
  userRole: 'super-admin' | 'facility-admin' | 'clinician'
  onViewProfile?: (patient: UIPatient) => void
  onEdit?: (patient: UIPatient) => void
  onCreateReferral?: (patient: UIPatient) => void
  onTransferFacility?: (patient: UIPatient) => void
}

export function PatientTable({ patients, userRole, onViewProfile, onEdit, onCreateReferral, onTransferFacility }: PatientTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="text-sm bg-gray-900/60 backdrop-blur-md border border-border" style={{ minWidth: '1000px', borderRadius: '0.5rem' }}>
        <thead>
          <tr className="border-b border-border bg-background/60">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[250px]">Patient</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[160px]">MRN</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[160px]">Phone</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[100px]">Gender</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[80px]">Age</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[80px]">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[140px]">Last Visit</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[80px]">Referrals</th>
            <th className="px-4 py-3 min-w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id} className="border-b border-gray-800 hover:bg-gray-900">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{patient.name}</div>
                    <div className="text-xs text-muted-foreground">{patient.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{patient.mrn}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  {patient.phone}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  patient.gender === 'male' 
                    ? 'bg-blue-600/10 text-blue-600 border-blue-600/20'
                    : patient.gender === 'female'
                    ? 'bg-pink-600/10 text-pink-600 border-pink-600/20'
                    : 'bg-purple-600/10 text-purple-600 border-purple-600/20'
                }`}>
                  {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-foreground">{patient.age}</td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  patient.status === 'active' 
                    ? 'bg-green-600/10 text-green-600 border-green-600/20'
                    : 'bg-gray-600/10 text-gray-600 border-gray-600/20'
                }`}>
                  {patient.status}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatTableDate(patient.lastVisit)}
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{patient.referrals}</td>
              <td className="px-4 py-3 text-right">
                <ActionDropdown
                  type="patient"
                  userRole={userRole}
                  isActive={patient.status === 'active'}
                  onViewProfile={() => onViewProfile?.(patient)}
                  onEdit={() => onEdit?.(patient)}
                  onCreateReferral={() => onCreateReferral?.(patient)}
                  onTransferFacility={() => onTransferFacility?.(patient)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
