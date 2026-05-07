import { Badge } from '@/components/shared/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, User, Phone, Calendar } from 'lucide-react'
import { Patient } from '@/services/patient.service'

interface PatientTableProps {
  patients: Patient[]
}

export function PatientTable({ patients }: PatientTableProps) {
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
                <Badge variant={patient.gender as 'male' | 'female' | 'other'}>
                  {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-foreground">{patient.age}</td>
              <td className="px-4 py-3">
                <Badge variant={patient.status as 'active' | 'inactive'}>
                  {patient.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {patient.lastVisit}
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{patient.referrals}</td>
              <td className="px-4 py-3 text-right">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-foreground hover:text-primary hover:bg-primary/10">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
