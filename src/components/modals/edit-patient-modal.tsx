'use client'

import { useState, useEffect, useRef } from 'react'
import { Modal } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { patientService } from '@/features/patients/services/patient.service'
import { toast } from 'sonner'

interface PatientData {
  id: number
  first_name?: string
  last_name?: string
  date_of_birth?: string
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  gender: string
  email?: string
  phone?: string
  // emergency_contact_name?: string
  // emergency_contact_phone?: string
  emergencyContact?: string
  emergencyPhone?: string
  allergies?: string
  medications?: string
  medical_history?: string
  chronic_conditions?: string
  profileImage?: string
}

interface EditPatientModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (patient: PatientData) => void
  patient: PatientData
}

// FilterDropdown component
function FilterDropdown({ value, onChange, options, placeholder, disabled = false, dataField }: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder: string
  disabled?: boolean
  dataField?: string
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
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  const selectedOption = options.find(option => option.value === value)

  return (
    <div className="relative z-[999999]">
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        disabled={disabled}
        className="w-full h-8 px-3 text-xs bg-gray-800/50 border-gray-700 text-muted-foreground hover:bg-gray-700 hover:text-foreground focus:border-primary focus:text-foreground"
        {...(dataField && { 'data-field': dataField })}
      >
        {selectedOption?.label || placeholder}
        <ChevronDown className="h-3 w-3 ml-1" />
      </Button>

      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg z-[9999999]"
        >
          <div className="py-1 max-h-60 overflow-y-auto">
            {options.map(option => (
              <button
                key={option.value}
                onClick={(e) => {
                  e.stopPropagation()
                  e.preventDefault()
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

export function EditPatientModal({ isOpen, onClose, onSuccess, patient }: EditPatientModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: '',
    allergies: '',
    medications: '',
    chronic_conditions: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { isLoading: isSubmitting, execute } = useAsyncOperation()
  const [showSuccess, setShowSuccess] = useState(false)

  // Update form data when patient changes
  useEffect(() => {
    if (isOpen && patient) {
      setFormData({
        first_name: patient.first_name || '',
        last_name: patient.last_name || '',
        email: patient.email || '',
        phone: patient.phone && patient.phone !== 'No phone' ? patient.phone : '',
        date_of_birth: patient.date_of_birth ? new Date(patient.date_of_birth).toISOString().split('T')[0] : '',
        gender: patient.gender || '',
        emergency_contact_name: patient.emergency_contact_name || '',
        emergency_contact_phone: patient.emergency_contact_phone || '',
        medical_history: patient.medical_history || '',
        allergies: patient.allergies || '',
        medications: patient.medications || '',
        chronic_conditions: patient.chronic_conditions || ''
      })
      setErrors({})
      setShowSuccess(false)
    }
  }, [isOpen, patient])

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
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.date_of_birth.trim()) newErrors.date_of_birth = 'Date of birth is required'
    if (!formData.gender) newErrors.gender = 'Gender is required'

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]+$/
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0]
      const errorElement = document.querySelector(`[data-field="${firstErrorField}"]`)
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return
    }

    await execute(async () => {
      try {
        const updatedPatient = await patientService.updatePatient(Number(patient.id), {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          medical_history: formData.medical_history,
          allergies: formData.allergies,
          medications: formData.medications,
          chronic_conditions: formData.chronic_conditions
        } as any)

        onSuccess(updatedPatient)
        setShowSuccess(true)
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to update patient'
        toast.error(message)
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
      title={showSuccess ? "Patient Updated" : "Edit Patient"}
      size="lg"
      footer={showSuccess ? null : null}
    >
      {!showSuccess ? (
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., John"
                    disabled={isSubmitting}
                    data-field="first_name"
                  />
                  {errors.first_name && <p className="mt-1 text-sm text-red-500">{errors.first_name}</p>}
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
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Doe"
                    disabled={isSubmitting}
                    data-field="last_name"
                  />
                  {errors.last_name && <p className="mt-1 text-sm text-red-500">{errors.last_name}</p>}
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
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., john.doe@email.com"
                    disabled={isSubmitting}
                    data-field="email"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, phone: e.target.value }))
                      clearFieldError('phone')
                    }}
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., +254 712 345 678"
                    disabled={isSubmitting}
                    data-field="phone"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_birth}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))
                      clearFieldError('date_of_birth')
                    }}
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer [&::-webkit-calendar-picker-indicator]:text-white [&::-webkit-calendar-picker-indicator]:hover:text-primary [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    disabled={isSubmitting}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    data-field="date_of_birth"
                  />
                  {errors.date_of_birth && <p className="mt-1 text-sm text-red-500">{errors.date_of_birth}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <FilterDropdown
                    value={formData.gender}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, gender: value }))
                      clearFieldError('gender')
                    }}
                    options={[
                      { value: 'Male', label: 'Male' },
                      { value: 'Female', label: 'Female' },
                      { value: 'Other', label: 'Other' }
                    ]}
                    placeholder="Select gender"
                    disabled={isSubmitting}
                    dataField="gender"
                  />
                  {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Emergency Contact Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergency_contact_name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, emergency_contact_name: e.target.value }))
                    }}
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., Jane Doe"
                    disabled={isSubmitting}
                  />
                </div>

                {/* Emergency Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))
                    }}
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., +254 712 345 679"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Medical History */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Medical History
                  </label>
                  <textarea
                    value={formData.medical_history}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, medical_history: e.target.value }))
                    }}
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter medical history (one condition per line)"
                    rows={4}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Allergies
                  </label>
                  <textarea
                    value={formData.allergies}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, allergies: e.target.value }))
                    }}
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter allergies (separated by commas)"
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Medications */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Medications
                  </label>
                  <textarea
                    value={formData.medications}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, medications: e.target.value }))
                    }}
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter current medications (one medication per line)"
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>

                {/* Chronic Conditions */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Chronic Conditions
                  </label>
                  <textarea
                    value={formData.chronic_conditions}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, chronic_conditions: e.target.value }))
                    }}
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter chronic conditions (separated by commas)"
                    rows={2}
                    disabled={isSubmitting}
                  />
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
              {isSubmitting ? 'Updating...' : 'Update Patient'}
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
          <h3 className="text-xl font-semibold text-white mb-2">Patient Updated Successfully!</h3>
          <p className="text-gray-400 mb-6">
            {formData.first_name} {formData.last_name}'s information has been updated.
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
