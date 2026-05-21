'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { Modal } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { counties } from '@/constants/counties'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { facilityService, CreateFacilityRequest } from '@/services/facility.service'

// AutocompleteInput component for long lists like counties and facilities
function AutocompleteInput({ value, onChange, options, placeholder, disabled = false }: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  disabled?: boolean
}) {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [filteredOptions, setFilteredOptions] = useState<typeof options>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Initialize input value when prop value changes
  useEffect(() => {
    const selectedOption = options.find(option => option.value === value)
    setInputValue(selectedOption?.label || '')
  }, [value, options])

  // Filter options based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      )
      setFilteredOptions(filtered)
      setIsOpen(filtered.length > 0)
    } else {
      setFilteredOptions([])
      setIsOpen(false)
    }
  }, [inputValue, options])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelect(filteredOptions[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleSelect = (option: { value: string; label: string }) => {
    onChange(option.value)
    setInputValue(option.label)
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setSelectedIndex(-1)
    
    // If input is cleared, clear the value
    if (!newValue.trim()) {
      onChange('')
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (inputValue.trim()) {
            setIsOpen(true)
          }
        }}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`w-full px-3 py-2 text-xs text-left hover:bg-gray-800 transition-colors ${
                index === selectedIndex ? 'bg-gray-800 text-primary' : 'text-muted-foreground'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// Keep FilterDropdown for short lists
function FilterDropdown({ value, onChange, options, placeholder, disabled = false }: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  disabled?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const selectedOption = options.find(option => option.value === value)

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        disabled={disabled}
        className="h-8 px-3 text-xs bg-gray-800/50 border-gray-700 text-muted-foreground hover:bg-gray-700 hover:text-foreground focus:border-primary focus:text-foreground w-full justify-start disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectedOption?.label || placeholder}
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50"
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

interface FacilityCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (facility: any) => void
  onCreateAdmin?: (facility: any) => void
}

export function FacilityCreationModal({ isOpen, onClose, onSuccess, onCreateAdmin }: FacilityCreationModalProps) {
  const [formData, setFormData] = useState<{
    name: string
    facility_code: string
    type: 'hospital' | 'clinic' | 'health_center' | 'dispensary' | 'referral_center' | ''
    level: 'level_1' | 'level_2' | 'level_3' | 'level_4' | 'level_5' | 'level_6' | ''
    county: string
    address: string
    phone: string
    email: string
    is_active: boolean
  }>({
    name: '',
    facility_code: '',
    type: '',
    level: '',
    county: '',
    address: '',
    phone: '',
    email: '',
    is_active: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const { isLoading: isSubmitting, execute } = useAsyncOperation()
  const [showAdminCreation, setShowAdminCreation] = useState(false)
  const [createdFacility, setCreatedFacility] = useState<any>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        facility_code: '',
        type: '',
        level: '',
        county: '',
        address: '',
        phone: '',
        email: '',
        is_active: true
      })
      setErrors({})
      setShowAdminCreation(false)
      setCreatedFacility(null)
    }
  }, [isOpen])

  const facilityTypes = [
    { value: 'hospital', label: 'Hospital' },
    { value: 'clinic', label: 'Clinic' },
    { value: 'health_center', label: 'Health Center' },
    { value: 'dispensary', label: 'Dispensary' },
    { value: 'referral_center', label: 'Referral Center' }
  ]

  const facilityLevels = [
    { value: 'level_1', label: 'Level 1' },
    { value: 'level_2', label: 'Level 2' },
    { value: 'level_3', label: 'Level 3' },
    { value: 'level_4', label: 'Level 4' },
    { value: 'level_5', label: 'Level 5' },
    { value: 'level_6', label: 'Level 6' }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.name.trim()) newErrors.name = 'Facility name is required'
    if (!formData.type) newErrors.type = 'Facility type is required'
    if (!formData.level) newErrors.level = 'Facility level is required'
    if (!formData.county) newErrors.county = 'County is required'

    // Facility code is optional - backend will generate if not provided
    // If provided, basic validation
    if (formData.facility_code.trim() && !/^[A-Z0-9-]{3,10}$/.test(formData.facility_code)) {
      newErrors.facility_code = 'Facility code must be 3-10 characters (letters, numbers, hyphens)'
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // Phone validation
    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        const errorElement = document.querySelector(`[data-field="${firstErrorField}"]`)
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
      return
    }

    await execute(async () => {
      // Call the backend API to create the facility
      const newFacility = await facilityService.createFacility(formData as CreateFacilityRequest)

      onSuccess(newFacility)
      setCreatedFacility(newFacility)
      setShowAdminCreation(true)

      // Reset form
      setFormData({
        name: '',
        facility_code: '',
        type: '',
        level: '',
        county: '',
        address: '',
        phone: '',
        email: '',
        is_active: true
      })
    })
  }

  const handleClose = () => {
    setShowAdminCreation(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={showAdminCreation ? "Facility Created" : "Create New Facility"}
      size="lg"
      footer={showAdminCreation ? null : null}
    >
    {!showAdminCreation ? (
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Facility Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Facility Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Kenyatta National Hospital"
              data-field="name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-500" data-field="name">{errors.name}</p>}
          </div>

          {/* Facility Code */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Facility Code <span className="text-gray-500">(Optional)</span>
            </label>
            <input
              type="text"
              value={formData.facility_code}
              onChange={(e) => setFormData(prev => ({ ...prev, facility_code: e.target.value.toUpperCase() }))}
              className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., KNH (leave blank for auto-generation)"
              maxLength={10}
            />
            {errors.facility_code && <p className="mt-1 text-sm text-red-500" data-field="facility_code">{errors.facility_code}</p>}
            <p className="mt-1 text-xs text-gray-400">Leave blank for automatic generation</p>
          </div>

          {/* Facility Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Facility Type <span className="text-red-500">*</span>
            </label>
            <FilterDropdown
              value={formData.type}
              onChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
              options={facilityTypes}
              placeholder="Select Facility Type"
            />
            {errors.type && <p className="mt-1 text-sm text-red-500" data-field="type">{errors.type}</p>}
          </div>

          {/* Facility Level */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Facility Level <span className="text-red-500">*</span>
            </label>
            <FilterDropdown
              value={formData.level}
              onChange={(value) => setFormData(prev => ({ ...prev, level: value as 'level_1' | 'level_2' | 'level_3' | 'level_4' | 'level_5' | 'level_6' | '' }))}
              options={facilityLevels}
              placeholder="Select Facility Level"
            />
            {errors.level && <p className="mt-1 text-sm text-red-500" data-field="level">{errors.level}</p>}
          </div>

          {/* County */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              County <span className="text-red-500">*</span>
            </label>
            <AutocompleteInput
              value={formData.county}
              onChange={(value) => setFormData(prev => ({ ...prev, county: value }))}
              options={counties.map((county: string) => ({ value: county, label: county }))}
              placeholder="Type to search county..."
            />
            {errors.county && <p className="mt-1 text-sm text-red-500" data-field="county">{errors.county}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., +254-20-1234567"
            />
            {errors.phone && <p className="mt-1 text-sm text-red-500" data-field="phone">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., info@facility.co.ke"
              data-field="email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-500" data-field="email">{errors.email}</p>}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Physical Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Hospital Road, Nairobi"
              data-field="address"
            />
          </div>

          {/* Status */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <div className="flex items-center space-x-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={formData.is_active === true}
                  onChange={() => setFormData(prev => ({ ...prev, is_active: true }))}
                  className="mr-2 w-4 h-4 border-gray-600 bg-gray-800"
                  style={{
                    accentColor: 'hsl(var(--primary))'
                  }}
                />
                <span className="text-gray-300">Active</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={formData.is_active === false}
                  onChange={() => setFormData(prev => ({ ...prev, is_active: false }))}
                  className="mr-2 w-4 h-4 border-gray-600 bg-gray-800"
                  style={{
                    accentColor: 'hsl(var(--primary))'
                  }}
                />
                <span className="text-gray-300">Inactive</span>
              </label>
            </div>
          </div>
        </div>
          
          <div className="border-t border-gray-800 pt-4 mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="px-4 py-2 border-none bg-transparent text-gray-300 hover:text-foreground hover:bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-primary/90 text-primary-foreground hover:bg-primary/80"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Facility'}
            </Button>
          </div>
        </form>
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Facility Created Successfully!</h3>
        <p className="text-gray-400 mb-6">
          {createdFacility?.name || formData.name} has been added to the system. Would you like to create a facility administrator for this facility?
        </p>
        <div className="flex justify-center gap-3">
          <Button
            onClick={handleClose}
            variant="outline"
            className="px-6 py-2 border-none bg-transparent text-gray-300 hover:text-foreground hover:bg-transparent"
          >
            Skip
          </Button>
          <Button
            onClick={() => onCreateAdmin && onCreateAdmin(createdFacility)}
            className="px-6 py-2 bg-primary/90 text-primary-foreground hover:bg-primary/80"
          >
            Create Admin
          </Button>
        </div>
      </div>
    )}
  </Modal>
)
}
