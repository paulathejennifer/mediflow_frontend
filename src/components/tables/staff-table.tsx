import { Badge } from '@/components/shared/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, User, Phone } from 'lucide-react'
import { StaffMember } from '@/services/staff.service'

interface StaffTableProps {
  staff: StaffMember[]
}

export function StaffTable({ staff }: StaffTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="text-sm bg-gray-900/60 backdrop-blur-md border border-border" style={{ minWidth: '1000px', borderRadius: '0.5rem' }}>
        <thead>
          <tr className="border-b border-border bg-background/60">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[250px]">Staff</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[160px]">Phone</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[140px]">Role</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[200px]">Facility</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[80px]">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[120px]">Last Login</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[80px]">Referrals</th>
            <th className="px-4 py-3 min-w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {staff.map((staffMember) => (
            <tr key={staffMember.id} className="border-b border-border hover:bg-gray-900">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{staffMember.name}</div>
                    <div className="text-xs text-muted-foreground">{staffMember.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  {staffMember.phone}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={staffMember.role as any}>
                  {staffMember.role.replace('_', ' ')}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-foreground">{staffMember.facility}</div>
                <div className="text-xs text-muted-foreground">{staffMember.facilityCode}</div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={staffMember.status as 'active' | 'inactive'}>
                  {staffMember.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{staffMember.lastLogin}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{staffMember.referrals}</td>
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
