'use client'

import { useState, useEffect } from 'react'
import { Building } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FacilityTooltip } from '@/components/dashboard/facility-tooltip'
import { FacilityFilters } from '@/components/dashboard/facility-filters'
import { Facility, facilityService } from '@/features/facilities/services/facility.service'

interface FacilityPerformanceData {
  facility: string
  total_referrals: number
  completed_referrals: number
  completion_rate: number
  avg_turnaround_days: number
}

interface FacilityPerformanceProps {
  data?: FacilityPerformanceData[]
}

export function FacilityPerformance({ data }: FacilityPerformanceProps) {
  const [hoveredFacility, setHoveredFacility] = useState<Facility | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [filters, setFilters] = useState({
    county: 'all',
    level: 'all',
  })
  const [facilities, setFacilities] = useState<Facility[]>([])

  useEffect(() => {
    facilityService.getFacilities().then(setFacilities)
  }, [])

  // Apply filters
  const filteredFacilities = facilities.filter(facility => {
    if (filters.county !== 'all' && facility.county !== filters.county) return false
    if (filters.level !== 'all' && String(facility.level) !== filters.level) return false
    return true
  })

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  // Generate a consistent color based on facility ID
  const getFacilityColor = (id: string) => {
    const colors = ['#67E8F9', '#38BDF8', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A']
    const numericId = parseInt(id, 10) || 0
    return colors[numericId % colors.length]
  }

  // If we have performance data, show based on that, otherwise use facilities list
  const showPerformanceData = data && data.length > 0

  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Building className="h-5 w-5" />
          Facility Overview
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Healthcare facilities in the system
        </p>
      </CardHeader>

      <CardContent>
        {showPerformanceData ? (
          /* Performance Data Table */
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 text-muted-foreground font-medium">Facility</th>
                  <th className="text-right py-3 px-3 text-muted-foreground font-medium">Referrals</th>
                  <th className="text-right py-3 px-3 text-muted-foreground font-medium">Completed</th>
                  <th className="text-right py-3 px-3 text-muted-foreground font-medium">Rate</th>
                  <th className="text-right py-3 px-3 text-muted-foreground font-medium">Avg Days</th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                {data.map((item, index) => (
                  <tr key={index} className="border-b border-border hover:bg-gray-900 transition-colors">
                    <td className="py-3 px-3 font-medium">{item.facility}</td>
                    <td className="text-right py-3 px-3 font-mono">{item.total_referrals}</td>
                    <td className="text-right py-3 px-3 font-mono">{item.completed_referrals}</td>
                    <td className="text-right py-3 px-3 font-mono">{item.completion_rate}%</td>
                    <td className="text-right py-3 px-3 font-mono">{item.avg_turnaround_days}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            {/* Filters */}
            <FacilityFilters onFilterChange={handleFilterChange} />

            {/* Facility Grid */}
            <div className="flex justify-center">
              <div className="grid grid-cols-12 sm:grid-cols-14 md:grid-cols-15 lg:grid-cols-20 gap-[3px]">
                {filteredFacilities.map((facility) => (
                  <div
                    key={facility.id}
                    className="w-4.5 h-4.5 sm:w-7 sm:h-6 md:w-4.5 md:h-4.5 rounded-[2px] cursor-pointer transition-all duration-150 ease-out hover:scale-110"
                    style={{
                      backgroundColor: getFacilityColor(facility.id),
                      boxShadow: facility.status === 'active'
                        ? '0 0 8px rgba(59,130,246,0.5)'
                        : 'none',
                      opacity: facility.status === 'active' ? 1 : 0.5
                    }}
                    onMouseEnter={(e) => {
                      setHoveredFacility(facility)
                      setTooltipPosition({
                        x: e.clientX,
                        y: e.clientY
                      })
                    }}
                    onMouseLeave={() => setHoveredFacility(null)}
                  />
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-3 mt-6 text-xs text-muted-foreground">
              <span>Inactive</span>
              <div className="w-40 h-2 rounded-full overflow-hidden border border-white/10">
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      'linear-gradient(to right, hsl(222, 35%, 10%), hsl(187, 90%, 55%))'
                  }}
                />
              </div>
              <span>Active</span>
            </div>
          </>
        )}

        {/* Tooltip */}
        <FacilityTooltip
          facility={hoveredFacility}
          position={tooltipPosition}
        />
      </CardContent>
    </Card>
  )
}