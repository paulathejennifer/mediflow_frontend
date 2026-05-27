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

  // Generate color based on performance score (Heatmap logic)
  const getFacilityColor = (performance: number) => {
    if (performance >= 80) return '#10B981' // High (Emerald)
    if (performance >= 60) return '#3B82F6' // Good (Blue)
    if (performance >= 40) return '#F59E0B' // Average (Amber)
    return '#EF4444' // Low (Red)
  }

  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Building className="h-5 w-5" />
          Facility Overview
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Facility performance heatmap across the network
        </p>
      </CardHeader>

      <CardContent>
        {/* Filters */}
        <FacilityFilters onFilterChange={handleFilterChange} />

        {/* Facility Grid (Heatmap) */}
        <div className="flex justify-center mt-4">
          <div className="grid grid-cols-12 sm:grid-cols-14 md:grid-cols-15 lg:grid-cols-20 gap-[3px]">
            {filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                className="w-4.5 h-4.5 sm:w-7 sm:h-6 md:w-4.5 md:h-4.5 rounded-[2px] cursor-pointer transition-all duration-150 ease-out hover:scale-110"
                style={{
                  backgroundColor: getFacilityColor(facility.performance),
                  boxShadow: facility.status === 'active'
                    ? `0 0 8px ${getFacilityColor(facility.performance)}80`
                    : 'none',
                  opacity: facility.status === 'active' ? 1 : 0.4
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
        <div className="flex items-center justify-center gap-3 mt-8 text-xs text-muted-foreground">
          <span>Low Performance</span>
          <div className="w-40 h-2 rounded-full overflow-hidden border border-white/10">
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(to right, #EF4444, #F59E0B, #3B82F6, #10B981)'
              }}
            />
          </div>
          <span>High Performance</span>
        </div>

        {/* Tooltip */}
        <FacilityTooltip
          facility={hoveredFacility}
          position={tooltipPosition}
        />
      </CardContent>
    </Card>
  )
}