'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { Modal } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { useFacilities } from '@/features/facilities/hooks/useFacilities'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { userService } from '@/features/users/services/user.service'

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
  const [justSelected, setJustSelected] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Initialize input value when prop value changes
  useEffect(() => {
    const selectedOption = options.find(option => option.value === value)
    setInputValue(selectedOption?.label || '')
  }, [value, options])

  // Filter options based on input
  useEffect(() => {
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    )
    setFilteredOptions(filtered)
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
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => (prev + 1) % filteredOptions.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => prev === -1 ? filteredOptions.length - 1 : (prev - 1 + filteredOptions.length) % filteredOptions.length)
          break
        case 'Enter':
          event.preventDefault()
          if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
            handleSelect(filteredOptions[selectedIndex])
          }
          break
        case 'Escape':
          event.preventDefault()
          setIsOpen(false)
          setSelectedIndex(-1)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredOptions, selectedIndex])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    setSelectedIndex(-1)
  }

  const handleSelect = (option: { value: string; label: string }) => {
    onChange(option.value)
    setInputValue(option.label)
    setIsOpen(false)
    setSelectedIndex(-1)
    setJustSelected(true)
    // Reset the flag after a short delay
    setTimeout(() => setJustSelected(false), 150)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => {
          if (!justSelected) {
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

// FilterDropdown component
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

interface UserCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: any) => void
  preSelectedFacilityId?: string
}

export function UserCreationModal({ isOpen, onClose, onSuccess, preSelectedFacilityId }: UserCreationModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '',
    password: '',
    confirm_password: '',
    role: preSelectedFacilityId ? 'facility_admin' : '',
    facility_id: preSelectedFacilityId || '',
    is_active: true
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { isLoading: isSubmitting, execute } = useAsyncOperation()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { facilities: facilitiesData } = useFacilities()

  // User roles
  const userRoles = [
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'facility_admin', label: 'Facility Admin' },
    { value: 'clinician', label: 'Clinician' }
  ]

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ]

  // Reset form when modal opens or preSelectedFacilityId changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        gender: '',
        password: '',
        confirm_password: '',
        role: preSelectedFacilityId ? 'facility_admin' : '',
        facility_id: preSelectedFacilityId || '',
        is_active: true
      })
      setErrors({})
      setShowSuccess(false)
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
  }, [isOpen, preSelectedFacilityId])

  // Update role and facility when preSelectedFacilityId changes
  useEffect(() => {
    if (preSelectedFacilityId) {
      setFormData(prev => ({
        ...prev,
        role: 'facility_admin',
        facility_id: preSelectedFacilityId
      }))
    }
  }, [preSelectedFacilityId])

  // Password validation function
  const getPasswordRequirements = (password: string) => {
    return {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  }

  // Clear error when user starts typing
  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleRoleChange = (role: string) => {
    setFormData(prev => ({ ...prev, role }))
    clearFieldError('role')
    
    // Clear facility_id if role doesn't require facility
    if (role !== 'facility_admin' && role !== 'clinician') {
      setFormData(prev => ({ ...prev, facility_id: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required'
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    if (!formData.confirm_password.trim()) newErrors.confirm_password = 'Confirm password is required'
    if (!formData.role) newErrors.role = 'User role is required'

    // Facility validation for specific roles
    if ((formData.role === 'facility_admin' || formData.role === 'clinician') && !formData.facility_id) {
      newErrors.facility_id = 'Facility is required for this role'
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // Password validation
    if (formData.password) {
      const requirements = getPasswordRequirements(formData.password)
      if (!requirements.minLength) newErrors.password = 'Password must be at least 8 characters'
      else if (!requirements.hasUpper) newErrors.password = 'Password must contain at least one uppercase letter'
      else if (!requirements.hasLower) newErrors.password = 'Password must contain at least one lowercase letter'
      else if (!requirements.hasNumber) newErrors.password = 'Password must contain at least one number'
      else if (!requirements.hasSpecial) newErrors.password = 'Password must contain at least one special character'
    }

    // Confirm password validation
    if (formData.password && formData.confirm_password && formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
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
      try {
        const newUser = await userService.createUser({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: formData.role as any,
          facility_id: formData.facility_id ? parseInt(formData.facility_id) : undefined,
          is_active: formData.is_active
        })

        onSuccess(newUser)
        setShowSuccess(true)
      } catch (err: any) {
        toast.error(err.response?.data?.detail || 'Failed to create user')
        throw err
      }
    })
  }

  const handleClose = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={showSuccess ? "User Created" : preSelectedFacilityId ? "Create Facility Admin" : "Create New User"}
      size="lg"
      footer={showSuccess ? null : null}
    >
      {!showSuccess ? (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                  className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., John"
                  data-field="first_name"
                />
                {errors.first_name && <p className="mt-1 text-sm text-red-500" data-field="first_name">{errors.first_name}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                  className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Doe"
                  data-field="last_name"
                />
                {errors.last_name && <p className="mt-1 text-sm text-red-500" data-field="last_name">{errors.last_name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., john.doe@facility.co.ke"
                  autoComplete="new-email"
                  data-field="email"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500" data-field="email">{errors.email}</p>}
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
                  placeholder="e.g., +254 712 345678"
                  data-field="phone"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-500" data-field="phone">{errors.phone}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Gender
                </label>
                <FilterDropdown
                  value={formData.gender}
                  onChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
                  options={genderOptions}
                  placeholder="Select Gender"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full px-2 py-1.5 pr-10 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter secure password"
                    autoComplete="new-password"
                    autoCorrect="off"
                    spellCheck="false"
                    style={{
                      WebkitTextSecurity: 'none',
                      MozTextSecurity: 'none'
                    } as React.CSSProperties}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-sm text-red-500" data-field="password">{errors.password}</p>}
                
                {/* Real-time password requirements */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs">
                    <span className={`mr-2 ${getPasswordRequirements(formData.password).minLength ? 'text-primary' : 'text-gray-600'}`}>
                      {getPasswordRequirements(formData.password).minLength ? '✓' : '○'}
                    </span>
                    <span className={`${getPasswordRequirements(formData.password).minLength ? 'text-primary' : 'text-gray-400'}`}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={`mr-2 ${getPasswordRequirements(formData.password).hasUpper ? 'text-primary' : 'text-gray-600'}`}>
                      {getPasswordRequirements(formData.password).hasUpper ? '✓' : '○'}
                    </span>
                    <span className={`${getPasswordRequirements(formData.password).hasUpper ? 'text-primary' : 'text-gray-400'}`}>One uppercase letter</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={`mr-2 ${getPasswordRequirements(formData.password).hasLower ? 'text-primary' : 'text-gray-600'}`}>
                      {getPasswordRequirements(formData.password).hasLower ? '✓' : '○'}
                    </span>
                    <span className={`${getPasswordRequirements(formData.password).hasLower ? 'text-primary' : 'text-gray-400'}`}>One lowercase letter</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={`mr-2 ${getPasswordRequirements(formData.password).hasNumber ? 'text-primary' : 'text-gray-600'}`}>
                      {getPasswordRequirements(formData.password).hasNumber ? '✓' : '○'}
                    </span>
                    <span className={`${getPasswordRequirements(formData.password).hasNumber ? 'text-primary' : 'text-gray-400'}`}>One number</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={`mr-2 ${getPasswordRequirements(formData.password).hasSpecial ? 'text-primary' : 'text-gray-600'}`}>
                      {getPasswordRequirements(formData.password).hasSpecial ? '✓' : '○'}
                    </span>
                    <span className={`${getPasswordRequirements(formData.password).hasSpecial ? 'text-primary' : 'text-gray-400'}`}>One special character</span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirm_password}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirm_password: e.target.value }))}
                    className="w-full px-2 py-1.5 pr-10 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    autoCorrect="off"
                    spellCheck="false"
                    style={{
                      WebkitTextSecurity: 'none',
                      MozTextSecurity: 'none'
                    } as React.CSSProperties}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirm_password && <p className="mt-1 text-sm text-red-500" data-field="confirm_password">{errors.confirm_password}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  User Role <span className="text-red-500">*</span>
                </label>
                <FilterDropdown
                  value={formData.role}
                  onChange={(value) => handleRoleChange(value)}
                  options={userRoles}
                  placeholder="Select Role"
                  disabled={!!preSelectedFacilityId}
                />
                {errors.role && <p className="mt-1 text-sm text-red-500" data-field="role">{errors.role}</p>}
              </div>

              {/* Facility (conditional) */}
              {(formData.role === 'facility_admin' || formData.role === 'clinician') && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Facility <span className="text-red-500">*</span>
                  </label>
                  <AutocompleteInput
                    value={formData.facility_id}
                    onChange={(value) => setFormData(prev => ({ ...prev, facility_id: value }))}
                    options={(facilitiesData || []).map(facility => ({
                      value: String(facility.id),
                      label: `${facility.name} (${facility.facilityCode})`
                    }))}
                    placeholder="Type to search facility..."
                    disabled={!!preSelectedFacilityId}
                  />
                  {errors.facility_id && <p className="mt-1 text-sm text-red-500" data-field="facility_id">{errors.facility_id}</p>}
                  {preSelectedFacilityId && (
                    <p className="mt-1 text-xs text-gray-400">
                      Pre-selected from facility creation
                    </p>
                  )}
                </div>
              )}

              {/* Account Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Status
                </label>
                <div className="flex items-center gap-3 mt-3">
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
              {isSubmitting ? 'Creating...' : 'Create User'}
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
          <h3 className="text-xl font-semibold text-white mb-2">User Created Successfully!</h3>
          <p className="text-gray-400 mb-6">
            {formData.first_name} {formData.last_name} has been added to the system.
          </p>
          <Button
            onClick={handleClose}
            className="px-6 py-2 bg-primary/80 text-primary-foreground hover:bg-primary/70"
          >
            Done
          </Button>
        </div>
      )}
    </Modal>
  )
}
