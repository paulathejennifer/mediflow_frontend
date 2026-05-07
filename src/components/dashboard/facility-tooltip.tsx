import { useEffect, useState } from 'react'
import { Facility } from '@/services/facilities.service'

interface FacilityTooltipProps {
  facility: Facility | null
  position: { x: number; y: number }
}

export function FacilityTooltip({ facility, position }: FacilityTooltipProps) {
  const [coords, setCoords] = useState({ left: 0, top: 0 })

  useEffect(() => {
    if (!facility) return

    const tooltipWidth = 220
    const tooltipHeight = 120
    const padding = 12

    let left = position.x + padding
    let top = position.y - tooltipHeight / 2

    // RIGHT EDGE FIX
    if (left + tooltipWidth > window.innerWidth) {
      left = position.x - tooltipWidth - padding
    }

    // TOP EDGE FIX
    if (top < 0) {
      top = padding
    }

    // BOTTOM EDGE FIX
    if (top + tooltipHeight > window.innerHeight) {
      top = window.innerHeight - tooltipHeight - padding
    }

    setCoords({ left, top })
  }, [position, facility])

  if (!facility) return null

  return (
    <div
      className="fixed z-[9999] bg-[#0b0f1a]/95 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-2xl transition-all duration-150"
      style={{
        left: coords.left,
        top: coords.top
      }}
    >
      <p className="text-white font-semibold text-sm">
        {facility.name}
      </p>

      <span className="text-xs text-gray-400">
        {facility.code}
      </span>

      <p className="text-gray-400 text-xs">
        Level {facility.level} • {facility.county}
      </p>

      <div className="mt-3 flex justify-between text-xs">
        <span className="text-gray-400">Performance</span>
        <span className="text-blue-400 font-medium">
          {facility.performance}%
        </span>
      </div>

      {/* Premium progress bar */}
      <div className="mt-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${facility.performance}%`,
            background: 'linear-gradient(90deg, rgba(59,130,246,0.3), rgba(103, 232, 249, 1)'
          }}
        />
      </div>
    </div>
  )
}