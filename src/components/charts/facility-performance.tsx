'use client'

import { useState, useMemo } from 'react'
import { Building } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { facilities, getHeatColor, type Facility } from '@/services/facilities.service'
import { FacilityTooltip } from '@/components/dashboard/facility-tooltip'
import { FacilityFilters } from '@/components/dashboard/facility-filters'

export function FacilityPerformance() {
  const [hoveredFacility, setHoveredFacility] = useState<Facility | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [filters, setFilters] = useState({
    county: 'all',
    level: 'all',
    performance: 'all'
  })

  // Apply filters
  const filteredFacilities = useMemo(() => {
    return facilities.filter(facility => {
      if (filters.county !== 'all' && facility.county !== filters.county) return false
      if (filters.level !== 'all' && facility.level.toString() !== filters.level) return false
      if (filters.performance !== 'all') {
        if (filters.performance === 'high' && facility.performance < 71) return false
        if (filters.performance === 'medium' && (facility.performance < 41 || facility.performance > 70)) return false
        if (filters.performance === 'low' && facility.performance > 40) return false
      }
      return true
    })
  }, [filters])

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters)
  }

  return (
    <Card className="bg-background border-border shadow-lg shadow-[hsl(var(--primary))]/20">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Building className="h-5 w-5" />
          Facility Performance
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Performance heatmap across facilities
        </p>
      </CardHeader>

      <CardContent>

        {/* Filters */}
        <FacilityFilters onFilterChange={handleFilterChange} />

        {/* Heatmap */}
        <div className="flex justify-center">
          <div className="grid grid-cols-12 sm:grid-cols-14 md:grid-cols-15 lg:grid-cols-20 gap-[3px]">

            {filteredFacilities.map((facility) => (
              <div
                key={facility.id}
                className="w-4.5 h-4.5 sm:w-7 sm:h-6 md:w-4.5 md:h-4.5 rounded-[2px] cursor-pointer transition-all duration-150 ease-out hover:scale-110"
                style={{
                  backgroundColor: getHeatColor(facility.performance),
                  boxShadow:
                    facility.performance > 75
                      ? '0 0 8px rgba(59,130,246,0.5)'
                      : 'none'
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
          <span>Low</span>
          <div className="w-40 h-2 rounded-full overflow-hidden border border-white/10">
            <div
              className="w-full h-full"
              style={{
                background:
                  'linear-gradient(to right, hsl(222, 35%, 10%), hsl(187, 90%, 55%))'
              }}
            />
          </div>
          <span>High</span>
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