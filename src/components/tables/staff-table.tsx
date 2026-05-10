import { Badge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, User, Phone } from 'lucide-react'
import { StaffMember } from '@/services/staff.service'
import { ActionDropdown } from '@/components/shared'

interface StaffTableProps {
  staff: StaffMember[]
  userRole: 'super-admin' | 'facility-admin'
  onViewProfile?: (staff: StaffMember) => void
  onEdit?: (staff: StaffMember) => void
  onActivate?: (staff: StaffMember) => void
  onDeactivate?: (staff: StaffMember) => void
  onManagePermissions?: (staff: StaffMember) => void
}

export function StaffTable({ staff, userRole, onViewProfile, onEdit, onActivate, onDeactivate, onManagePermissions }: StaffTableProps) {
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
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  staffMember.role === 'super_admin' 
                    ? 'bg-purple-600/10 text-purple-600 border-purple-600/20'
                    : staffMember.role === 'facility_admin'
                    ? 'bg-cyan-600/10 text-cyan-600 border-cyan-600/20'
                    : 'bg-green-600/10 text-green-600 border-green-600/20'
                }`}>
                  {staffMember.role.replace('_', ' ')}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-foreground">{staffMember.facility}</div>
                <div className="text-xs text-muted-foreground">{staffMember.facilityCode}</div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  staffMember.status === 'active' 
                    ? 'bg-green-600/10 text-green-600 border-green-600/20'
                    : 'bg-gray-600/10 text-gray-600 border-gray-600/20'
                }`}>
                  {staffMember.status}
                </span>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{staffMember.lastLogin}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{staffMember.referrals}</td>
              <td className="px-4 py-3 text-right">
                <ActionDropdown
                  type="staff"
                  userRole={userRole}
                  isActive={staffMember.status === 'active'}
                  onViewProfile={() => onViewProfile?.(staffMember)}
                  onEdit={() => onEdit?.(staffMember)}
                  onActivate={() => onActivate?.(staffMember)}
                  onDeactivate={() => onDeactivate?.(staffMember)}
                  onManagePermissions={() => onManagePermissions?.(staffMember)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
