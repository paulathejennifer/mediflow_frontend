'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { counties } from '@/constants/counties'

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
  selectedType: string
  selectedLevel: string
  selectedStatus: string
  selectedCounty: string
  selectedSort: string
  onTypeChange: (value: string) => void
  onLevelChange: (value: string) => void
  onStatusChange: (value: string) => void
  onCountyChange: (value: string) => void
  onSortChange: (value: string) => void
}

export function FacilityFilters({ 
  selectedType, 
  selectedLevel, 
  selectedStatus, 
  selectedCounty,
  selectedSort,
  onTypeChange, 
  onLevelChange,
  onStatusChange,
  onCountyChange,
  onSortChange
}: FacilityFiltersProps) {
  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'clinic', label: 'Clinic' },
    { value: 'health_center', label: 'Health Center' },
    { value: 'dispensary', label: 'Dispensary' }
  ]

  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: '1', label: 'Level 1' },
    { value: '2', label: 'Level 2' },
    { value: '3', label: 'Level 3' },
    { value: '4', label: 'Level 4' },
    { value: '5', label: 'Level 5' },
    { value: '6', label: 'Level 6' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]

  const countyOptions = [
    { value: 'all', label: 'All Counties' },
    ...counties.map(county => ({ value: county, label: county }))
  ]

  const sortOptions = [
    { value: 'all', label: 'Sort By' },
    { value: 'performance', label: 'Performance' },
    // { value: 'referrals', label: 'Referrals' },
    { value: 'joined', label: 'Joined Date' }
  ]

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Facility Type Filter */}
      <FilterDropdown
        value={selectedType}
        onChange={onTypeChange}
        options={typeOptions}
        placeholder="Type"
      />

      {/* Facility Level Filter */}
      <FilterDropdown
        value={selectedLevel}
        onChange={onLevelChange}
        options={levelOptions}
        placeholder="Level"
      />

      {/* Status Filter */}
      <FilterDropdown
        value={selectedStatus}
        onChange={onStatusChange}
        options={statusOptions}
        placeholder="Status"
      />

      {/* County Filter */}
      <FilterDropdown
        value={selectedCounty}
        onChange={onCountyChange}
        options={countyOptions}
        placeholder="County"
      />

      {/* Sort Filter */}
      <FilterDropdown
        value={selectedSort}
        onChange={onSortChange}
        options={sortOptions}
        placeholder="Sort"
      />
    </div>
  )
}
