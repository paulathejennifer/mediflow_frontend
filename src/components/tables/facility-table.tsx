import { Badge } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Building, Phone, MapPin, Calendar, TrendingUp } from 'lucide-react'
import { Facility, getPerformanceVariant, getLevelVariant } from '@/services/facility.service'
import { ActionDropdown } from '@/components/shared'
import { formatTableDate } from '@/utils/date-utils'

interface FacilityTableProps {
  facilities: Facility[]
  userRole: 'super-admin' | 'facility-admin'
  onViewProfile?: (facility: Facility) => void
  onEdit?: (facility: Facility) => void
  onManageStaff?: (facility: Facility) => void
  onViewAnalytics?: (facility: Facility) => void
  onActivate?: (facility: Facility) => void
  onDeactivate?: (facility: Facility) => void
}

export function FacilityTable({ facilities, userRole, onViewProfile, onEdit, onManageStaff, onViewAnalytics, onActivate, onDeactivate }: FacilityTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="text-sm bg-gray-900/60 backdrop-blur-md border border-border" style={{ minWidth: '1400px', borderRadius: '0.5rem' }}>
        <thead>
          <tr className="border-b border-border bg-background/60">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[250px]">Facility</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[160px]">Facility Code</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[180px]">Phone</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[100px]">Type</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[100px]">Level</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[100px]">County</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[200px]">Address</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[100px]">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[120px]">Performance</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground min-w-[140px]">Joined</th>
            <th className="px-4 py-3 min-w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((facility) => (
            <tr key={facility.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Building className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{facility.name}</div>
                    <div className="text-xs text-muted-foreground">{facility.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{facility.facilityCode}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" />
                  {facility.phone}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-transparent text-gray-700 border-gray-400 capitalize">
                  {facility.type.replace('_', ' ')}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  facility.level === 1 ? 'bg-blue-200 text-blue-800 border-blue-300'
                  : facility.level === 2 ? 'bg-blue-300 text-blue-800 border-blue-400'
                  : facility.level === 3 ? 'bg-blue-400 text-white border-blue-500'
                  : facility.level === 4 ? 'bg-blue-500 text-white border-blue-600'
                  : facility.level === 5 ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-blue-700 text-white border-blue-800'
                }`}>
                  Level {facility.level}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-foreground">{facility.county}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  {facility.address}
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  facility.status === 'active' 
                    ? 'bg-green-600/10 text-green-600 border-green-600/20'
                    : 'bg-gray-600/10 text-gray-600 border-gray-600/20'
                }`}>
                  {facility.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{facility.performance}%</span>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    facility.performance >= 80 ? 'bg-green-600/10 text-green-600 border-green-600/20'
                    : facility.performance >= 60 ? 'bg-yellow-600/10 text-yellow-600 border-yellow-600/20'
                    : facility.performance >= 40 ? 'bg-orange-600/10 text-orange-600 border-orange-600/20'
                    : 'bg-red-600/10 text-red-600 border-red-600/20'
                  }`}>
                    {facility.performance >= 80 ? 'High' : 
                     facility.performance >= 60 ? 'Good' : 
                     facility.performance >= 40 ? 'Average' : 
                     'Low'}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatTableDate(facility.joined)}
                </div>
              </td>
              <td className="px-4 py-3">
                <ActionDropdown
                  type="facility"
                  userRole={userRole}
                  isActive={facility.status === 'active'}
                  onViewProfile={() => onViewProfile?.(facility)}
                  onEdit={() => onEdit?.(facility)}
                  onManageStaff={() => onManageStaff?.(facility)}
                  onViewAnalytics={() => onViewAnalytics?.(facility)}
                  onActivate={() => onActivate?.(facility)}
                  onDeactivate={() => onDeactivate?.(facility)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
