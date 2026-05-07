import { Badge } from '@/components/shared/badge'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Building, Phone, MapPin, Calendar, TrendingUp } from 'lucide-react'
import { Facility, getPerformanceVariant, getLevelVariant } from '@/services/facility.service'

interface FacilityTableProps {
  facilities: Facility[]
}

export function FacilityTable({ facilities }: FacilityTableProps) {
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
                <Badge variant="outline" className="capitalize">
                  {facility.type.replace('_', ' ')}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <Badge variant={getLevelVariant(facility.level) as any}>
                  Level {facility.level}
                </Badge>
              </td>
              <td className="px-4 py-3 text-sm text-foreground">{facility.county}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5" />
                  {facility.address}
                </div>
              </td>
              <td className="px-4 py-3">
                <Badge variant={facility.status as any}>
                  {facility.status}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm font-medium">{facility.performance}%</span>
                  </div>
                  <Badge variant={getPerformanceVariant(facility.performance) as any} className="text-xs">
                    {facility.performance >= 80 ? 'High' : 
                     facility.performance >= 60 ? 'Good' : 
                     facility.performance >= 40 ? 'Average' : 
                     facility.performance >= 20 ? 'Low' : 'Critical'}
                  </Badge>
                </div>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(facility.joined).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  })}
                </div>
              </td>
              <td className="px-4 py-3">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
