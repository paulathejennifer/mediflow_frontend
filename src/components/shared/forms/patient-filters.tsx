'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

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

interface PatientFiltersProps {
  selectedStatus: string
  selectedGender: string
  selectedAgeRange: string
  selectedSort: string
  onStatusChange: (value: string) => void
  onGenderChange: (value: string) => void
  onAgeRangeChange: (value: string) => void
  onSortChange: (value: string) => void
}

export function PatientFilters({
  selectedStatus,
  selectedGender,
  selectedAgeRange,
  selectedSort,
  onStatusChange,
  onGenderChange,
  onAgeRangeChange,
  onSortChange,
}: PatientFiltersProps) {
  const statusOptions = [
    { value: 'all', label: 'All Patients' },
    { value: 'active', label: 'Active Patients' },
    { value: 'inactive', label: 'Inactive Patients' },
  ]

  const genderOptions = [
    { value: 'all', label: 'All Genders' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ]

  const ageRangeOptions = [
    { value: 'all', label: 'All Ages' },
    { value: '0-18', label: 'Pediatric (0-18)' },
    { value: '19-40', label: 'Adult (19-40)' },
    { value: '41-65', label: 'Middle Age (41-65)' },
    { value: '65+', label: 'Elderly (65+)' },
  ]

  const sortOptions = [
    { value: 'all', label: 'Sort By' },
    { value: 'referrals', label: 'Referrals' },
    { value: 'lastVisit', label: 'Last Visit' },
  ]

  return (
    <div className="flex items-center gap-3">
      {/* Status Filter */}
      <FilterDropdown
        value={selectedStatus}
        onChange={onStatusChange}
        options={statusOptions}
        placeholder="Status"
      />

      {/* Gender Filter */}
      <FilterDropdown
        value={selectedGender}
        onChange={onGenderChange}
        options={genderOptions}
        placeholder="Gender"
      />

      {/* Age Range Filter */}
      <FilterDropdown
        value={selectedAgeRange}
        onChange={onAgeRangeChange}
        options={ageRangeOptions}
        placeholder="Age Range"
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
