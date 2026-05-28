'use client'

import { useState, useEffect, useRef } from 'react'
import { Modal } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { Eye, EyeOff, Check, ChevronDown } from 'lucide-react'
import { userService } from '@/features/users/services/user.service'

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

  const selectedOption = options.find(option => option.value === value)

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between`}
      >
        <span className={selectedOption ? 'text-white' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {options.map((option) => (
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
      )}
    </div>
  )
}

interface AdminCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (user: any) => void
  facility: any
}

export function AdminCreationModal({ isOpen, onClose, onSuccess, facility }: AdminCreationModalProps) {
  const facilityData = facility
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'facility_admin',
    facility_id: facilityData?.id || '',
    is_active: true
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { isLoading: isSubmitting, execute } = useAsyncOperation()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'facility_admin',
        facility_id: facilityData?.id || '',
        is_active: true
      })
      setErrors({})
      setShowSuccess(false)
      setShowPassword(false)
    }
  }, [isOpen, facility])

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

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // Password validation
    if (formData.password) {
      const requirements = getPasswordRequirements(formData.password)
      if (!requirements.minLength) newErrors.password = 'Password must be at least 8 characters'
      else if (!requirements.hasUpper) newErrors.password = 'Password must contain uppercase letter'
      else if (!requirements.hasLower) newErrors.password = 'Password must contain lowercase letter'
      else if (!requirements.hasNumber) newErrors.password = 'Password must contain number'
      else if (!requirements.hasSpecial) newErrors.password = 'Password must contain special character'
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
      // Call the backend API to create the admin
      const newAdmin = await userService.createUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: '',
        password: formData.password,
        role: formData.role as 'facility_admin' | 'clinician',
        facility_id: facilityData?.id ? Number(facilityData.id) : undefined,
        is_active: formData.is_active
      })

      onSuccess(newAdmin)
      setShowSuccess(true)

      // Reset form
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'facility_admin',
        facility_id: facilityData?.id || '',
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
      title={showSuccess ? "Admin Created" : "Create Facility Admin"}
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
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, first_name: e.target.value }))
                    clearFieldError('first_name')
                  }}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter first name"
                  disabled={isSubmitting}
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
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, last_name: e.target.value }))
                    clearFieldError('last_name')
                  }}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter last name"
                  disabled={isSubmitting}
                />
                {errors.last_name && <p className="mt-1 text-sm text-red-500" data-field="last_name">{errors.last_name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, email: e.target.value }))
                    clearFieldError('email')
                  }}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter email address"
                  disabled={isSubmitting}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500" data-field="email">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, password: e.target.value }))
                      clearFieldError('password')
                    }}
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
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role <span className="text-red-500">*</span>
              </label>
              <FilterDropdown
                value={formData.role}
                onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                options={[
                  { value: 'facility_admin', label: 'Facility Admin' },
                  { value: 'clinician', label: 'Clinician' }
                ]}
                placeholder="Select Role"
              />
              {errors.role && <p className="mt-1 text-sm text-red-500" data-field="role">{errors.role}</p>}
            </div>

            {/* Facility Info */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-300">Facility:</span>
                <span className="text-sm text-white">
                  {facility ? `${facility.name} (${facility.facilityCode})` : 'Loading facility...'}
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Admin user will be assigned to this facility
              </p>
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Status
              </label>
              <div className="flex items-center gap-3 mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.is_active}
                    onChange={() => setFormData(prev => ({ ...prev, is_active: true }))}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-300">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={!formData.is_active}
                    onChange={() => setFormData(prev => ({ ...prev, is_active: false }))}
                    className="text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-gray-300">Inactive</span>
                </label>
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
              {isSubmitting ? 'Creating...' : 'Create Admin'}
            </Button>
          </div>
        </form>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Admin Created Successfully!</h3>
          <p className="text-gray-400 mb-6">
            {formData.first_name} {formData.last_name} has been added as an administrator for {facilityData?.name}.
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
