'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import { Modal } from '@/components/shared'
import { Button } from '@/components/ui/button'
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

  // Initialize with selected option if value exists
  useEffect(() => {
    if (value) {
      const selectedOption = options.find(option => option.value === value)
      setInputValue(selectedOption?.label || '')
    }
  }, [value, options])
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

  // Handle case where facility is pre-selected but options haven't loaded yet
  useEffect(() => {
    if (value && !inputValue && options.length > 0) {
      const selectedOption = options.find(option => option.value === value)
      setInputValue(selectedOption?.label || '')
    }
  }, [value, options, inputValue])

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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen || filteredOptions.length === 0) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setSelectedIndex(prev => (prev + 1) % filteredOptions.length)
          break
        case 'ArrowUp':
          event.preventDefault()
          setSelectedIndex(prev => (prev - 1 + filteredOptions.length) % filteredOptions.length)
          break
        case 'Enter':
          event.preventDefault()
          if (selectedIndex >= 0) {
            const selectedOption = filteredOptions[selectedIndex]
            onChange(selectedOption.value)
            setInputValue(selectedOption.label)
            setIsOpen(false)
            setJustSelected(true)
            setTimeout(() => setJustSelected(false), 100)
          }
          break
        case 'Escape':
          setIsOpen(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, filteredOptions, selectedIndex, onChange])

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleSelect = (optionValue: string, optionLabel: string) => {
    onChange(optionValue)
    setInputValue(optionLabel)
    setIsOpen(false)
    setJustSelected(true)
    setTimeout(() => setJustSelected(false), 100)
  }

  const selectedOption = options.find(option => option.value === value)

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          setJustSelected(false)
        }}
        onFocus={handleToggle}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        autoComplete="off"
      />
      <button
        type="button"
        onClick={handleToggle}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 focus:outline-none"
        disabled={disabled}
      >
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg z-[9999999]"
        >
          <div className="py-1 max-h-60 overflow-y-auto">
            {filteredOptions.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value, option.label)}
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

interface ClinicianCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (clinician: any) => void
  preSelectedFacilityId?: string
}

export function ClinicianCreationModal({ isOpen, onClose, onSuccess, preSelectedFacilityId }: ClinicianCreationModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    role: 'clinician',
    facility_id: preSelectedFacilityId || '',
    is_active: true
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { isLoading: isSubmitting, execute } = useAsyncOperation()
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdUserName, setCreatedUserName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // User roles - only clinician option for this modal
  const userRoles = [
    { value: 'clinician', label: 'Clinician' }
  ]

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: '',
        role: 'clinician',
        facility_id: preSelectedFacilityId || '',
        is_active: true
      })
      setErrors({})
      setShowSuccess(false)
      setCreatedUserName('')
      setShowPassword(false)
      setShowConfirmPassword(false)
    }
  }, [isOpen, preSelectedFacilityId])

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Required fields validation
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required'
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    if (!formData.confirm_password.trim()) newErrors.confirm_password = 'Confirm password is required'
    if (!formData.role) newErrors.role = 'User role is required'

    // Facility validation for clinician role
    if (formData.role === 'clinician' && !formData.facility_id) {
      newErrors.facility_id = 'Facility is required for clinician role'
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
      // Call the backend API to create the clinician
      const newClinician = await userService.createUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        gender: (formData as any).gender || '',
        password: formData.password,
        role: 'clinician',
        facility_id: formData.facility_id ? parseInt(formData.facility_id) : undefined,
        is_active: formData.is_active
      })

      setCreatedUserName(`${formData.first_name} ${formData.last_name}`)
      onSuccess(newClinician)
      setShowSuccess(true)

      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: '',
        role: 'clinician',
        facility_id: preSelectedFacilityId || '',
        is_active: true
      })
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
      title={showSuccess ? "Clinician Created" : "Create Clinician"}
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

              {/* Facility - Hidden - automatically assigned to facility admin's facility */}
              <input type="hidden" value={formData.facility_id} readOnly />

              {/* Role - Hidden but set to clinician */}
              <input type="hidden" value={formData.role} readOnly />
            </div>

            {/* Submit Button */}
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
                {isSubmitting ? 'Creating...' : 'Create Clinician'}
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
          <h3 className="text-xl font-semibold text-white mb-2">Clinician Created Successfully!</h3>
          <p className="text-gray-400 mb-6">
            {createdUserName} has been added to the system.
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

 