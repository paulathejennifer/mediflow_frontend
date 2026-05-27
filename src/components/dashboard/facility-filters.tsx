'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { counties } from '@/constants/counties'
import { facilityService } from '@/features/facilities/services/facility.service'

interface FilterDropdownProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
}

function FilterDropdown({ value, onChange, options, placeholder }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const selectedOption = options.find(option => option.value === value)

  return (
    <div className="relative z-[999999]">
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        className="h-8 px-3 text-xs bg-gray-800/50 border-gray-700 text-muted-foreground hover:bg-gray-700 hover:text-foreground focus:border-primary focus:text-foreground"
      >
        {selectedOption?.label || placeholder}
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 w-40 bg-gray-900 border border-gray-700 rounded-md shadow-lg z-[9999999]"
        >
          <div className="py-1 max-h-60 overflow-y-auto">
            {options.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-800 transition-colors ${
                  option.value === value ? 'bg-gray-800 text-primary' : 'text-muted-foreground'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface FacilityFiltersProps {
  onFilterChange: (filters: {
    county: string
    level: string
  }) => void
}

export function FacilityFilters({ onFilterChange }: FacilityFiltersProps) {
  const [selectedCounty, setSelectedCounty] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [availableLevels, setAvailableLevels] = useState<number[]>([])

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const facilities = await facilityService.getFacilities()
        const uniqueLevels = Array.from(new Set(facilities.map(f => f.level))).sort((a, b) => b - a)
        setAvailableLevels(uniqueLevels)
      } catch (error) {
        console.error('Failed to fetch levels for filters:', error)
      }
    }
    fetchLevels()
  }, [])

  const countyOptions = [
    { value: 'all', label: 'All Counties' },
    ...counties.map(county => ({ value: county, label: county }))
  ]

  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'level_6', label: 'Level 6' },
    { value: 'level_5', label: 'Level 5' },
    { value: 'level_4', label: 'Level 4' },
    { value: 'level_3', label: 'Level 3' },
    { value: 'level_2', label: 'Level 2' },
    { value: 'level_1', label: 'Level 1' }, // <-- This comma was missing
    ...availableLevels.map(level => ({
      value: level.toString(), 
      label: `Level ${level}` 
    }))
  ]

  const handleCountyChange = (county: string) => {
    setSelectedCounty(county)
    onFilterChange({ county, level: selectedLevel })
  }

  const handleLevelChange = (level: string) => {
    setSelectedLevel(level)
    onFilterChange({ county: selectedCounty, level })
  }

  return (
    <div className="flex flex-wrap gap-3 mb-4 justify-center">
      <FilterDropdown
        value={selectedCounty}
        onChange={handleCountyChange}
        options={countyOptions}
        placeholder="County"
      />

      <FilterDropdown
        value={selectedLevel}
        onChange={handleLevelChange}
        options={levelOptions}
        placeholder="Level"
      />
    </div>
  )
}
