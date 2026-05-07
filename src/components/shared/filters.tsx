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

interface StaffFiltersProps {
  selectedRole: string
  selectedStatus: string
  selectedSort: string
  onRoleChange: (role: string) => void
  onStatusChange: (status: string) => void
  onSortChange: (sort: string) => void
}

export function StaffFilters({ 
  selectedRole, 
  selectedStatus, 
  selectedSort,
  onRoleChange, 
  onStatusChange,
  onSortChange
}: StaffFiltersProps) {
  const roleOptions = [
    { value: 'all', label: 'All Roles' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'facility_admin', label: 'Facility Admin' },
    { value: 'clinician', label: 'Clinician' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ]

  const sortOptions = [
    { value: 'all', label: 'Sort By' },
    { value: 'referrals', label: 'Referrals' },
    { value: 'lastLogin', label: 'Last Login' }
  ]

  return (
    <div className="flex items-center gap-3">
      {/* Role Filter */}
      <FilterDropdown
        value={selectedRole}
        onChange={onRoleChange}
        options={roleOptions}
        placeholder="Role"
      />

      {/* Status Filter */}
      <FilterDropdown
        value={selectedStatus}
        onChange={onStatusChange}
        options={statusOptions}
        placeholder="Status"
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
