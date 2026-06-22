'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAsyncOperation } from '@/hooks/useAsyncOperation'
import { Modal } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { ChevronDown, Sparkles, AlertTriangle, UserCheck } from 'lucide-react'
import { patientService } from '@/features/patients/services/patient.service'
import { toast } from 'sonner'

interface PatientCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (patient: any) => void
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
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(option => option.value === value)

  return (
    <div className="relative z-[999999]">
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
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
                type="button"
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

export function PatientCreationModal({ isOpen, onClose, onSuccess }: PatientCreationModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: 'patient',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: '',
    allergies: '',
    medications: '',
    chronic_conditions: '',
    is_active: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const { isLoading: isSubmitting, execute } = useAsyncOperation()
  const [showSuccess, setShowSuccess] = useState(false)

  // Duplicate check state
  const [duplicateWarning, setDuplicateWarning] = useState<{ isDuplicate: boolean; matches: any[] } | null>(null)
  const [bypassDuplicate, setBypassDuplicate] = useState(false)
  const [isCheckingDuplicate, setIsCheckingDuplicate] = useState(false)
  const duplicateCheckTimer = useRef<NodeJS.Timeout | null>(null)

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        role: 'patient',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        medical_history: '',
        allergies: '',
        medications: '',
        chronic_conditions: '',
        is_active: true
      })
      setErrors({})
      setShowSuccess(false)
      setDuplicateWarning(null)
      setBypassDuplicate(false)
      setIsCheckingDuplicate(false)
    }
  }, [isOpen])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (duplicateCheckTimer.current) {
        clearTimeout(duplicateCheckTimer.current)
      }
    }
  }, [])

  // Real-time debounced duplicate check
  const triggerDuplicateCheck = useCallback((data: typeof formData) => {
    // Need at least first + last name to bother checking
    if (!data.first_name.trim() || !data.last_name.trim()) {
      setDuplicateWarning(null)
      setIsCheckingDuplicate(false)
      return
    }

    // Clear previous pending check
    if (duplicateCheckTimer.current) {
      clearTimeout(duplicateCheckTimer.current)
    }

    // Show scanning indicator immediately
    setIsCheckingDuplicate(true)

    // Debounce 800ms after user stops typing
    duplicateCheckTimer.current = setTimeout(async () => {
      try {
        const results = await patientService.preCheckDuplicate({
          first_name: data.first_name,
          last_name: data.last_name,
          date_of_birth: data.date_of_birth || undefined,
          phone: data.phone || undefined,
          email: data.email || undefined,
        })

        if (results.length > 0) {
          setDuplicateWarning({ isDuplicate: true, matches: results })
          // Reset bypass if new matches are found after a field change
          setBypassDuplicate(false)
        } else {
          setDuplicateWarning(null)
        }
      } catch {
        // Silently fail — don't block the form for a check error
        setDuplicateWarning(null)
      } finally {
        setIsCheckingDuplicate(false)
      }
    }, 800)
  }, [])

  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required'
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.date_of_birth.trim()) newErrors.date_of_birth = 'Date of birth is required'
    if (!formData.gender.trim()) newErrors.gender = 'Gender is required'

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format'
    }
    if (formData.emergency_contact_phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.emergency_contact_phone)) {
      newErrors.emergency_contact_phone = 'Invalid emergency phone format'
    }
    if (formData.address && formData.address.length > 500) {
      newErrors.address = 'Address must be less than 500 characters'
    }
    if (formData.medical_history && formData.medical_history.length > 2000) {
      newErrors.medical_history = 'Medical history must be less than 2000 characters'
    }
    if (formData.allergies && formData.allergies.length > 500) {
      newErrors.allergies = 'Allergies must be less than 500 characters'
    }
    if (formData.medications && formData.medications.length > 1000) {
      newErrors.medications = 'Medications must be less than 1000 characters'
    }
    if (formData.chronic_conditions && formData.chronic_conditions.length > 1000) {
      newErrors.chronic_conditions = 'Chronic conditions must be less than 1000 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      const firstErrorField = Object.keys(errors)[0]
      if (firstErrorField) {
        const errorElement = document.querySelector(`[data-field="${firstErrorField}"]`)
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
      return
    }

    // Block submit if duplicate warning is showing and not bypassed
    if (duplicateWarning?.isDuplicate && !bypassDuplicate) {
      toast.warning('Please review the potential duplicate records above before saving.')
      return
    }

    // Also block if still scanning
    if (isCheckingDuplicate) {
      toast.info('Duplicate scan in progress, please wait a moment.')
      return
    }

    try {
      await execute(async () => {
        const newPatient = await patientService.createPatient({
          first_name: formData.first_name,
          last_name: formData.last_name,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender as 'male' | 'female' | 'other',
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          medical_history: formData.medical_history,
          allergies: formData.allergies,
          medications: formData.medications,
          chronic_conditions: formData.chronic_conditions
        })

        onSuccess(newPatient)
        setShowSuccess(true)
      })
    } catch (error: any) {
      const detail = error.response?.data?.detail
      const message = typeof detail === 'string' ? detail : JSON.stringify(detail) || 'Server Error'
      toast.error(`Creation Failed: ${message}`)
    }
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={showSuccess ? "Patient Created" : "Create New Patient"}
      size="lg"
      footer={null}
    >
      {!showSuccess ? (
        <div className="space-y-6">
          {/* AskMediFlow Panel */}
          <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 animate-pulse flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-white">AskMediFlow Auto-Fill Assistant</h4>
              <p className="text-xs text-muted-foreground">
                Have unstructured voice logs or referral PDFs? Let AskMediFlow populate this form automatically.
              </p>
              <Button
                type="button"
                variant="link"
                size="sm"
                className="text-primary text-xs p-0 h-auto font-medium hover:text-primary/80"
                onClick={() => toast.info('AskMediFlow AI extraction drawer opening...')}
              >
                Launch AI Intake Processor →
              </Button>
            </div>
          </div>

          {/* Real-time scanning indicator */}
          {isCheckingDuplicate && !duplicateWarning && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-1 py-2">
              <div className="animate-spin h-3 w-3 border border-primary border-t-transparent rounded-full flex-shrink-0" />
              Scanning for duplicate records...
            </div>
          )}

          {/* Duplicate Match Warning */}
          {duplicateWarning?.isDuplicate && !bypassDuplicate && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-1">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <h4 className="text-sm font-semibold">Possible Existing Patient Found</h4>
                {isCheckingDuplicate && (
                  <div className="animate-spin h-3 w-3 border border-amber-400 border-t-transparent rounded-full ml-auto flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-300">
                The system found existing records that may match this patient. Please review before saving:
              </p>
              <div className="bg-gray-950/40 rounded-lg p-2.5 space-y-2 border border-gray-800">
                {duplicateWarning.matches.map((m: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white">{m.existing_patient_name}</span>
                    <span className={`font-mono font-semibold px-2 py-0.5 rounded-full text-xs ${
                      m.combined_score >= 0.90
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {Math.round(m.combined_score * 100)}% match
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                  onClick={() => {
                    setBypassDuplicate(true)
                    setDuplicateWarning(null)
                    toast.success("Duplicate check bypassed. Ready to save.")
                  }}
                >
                  Ignore & Save Anyway
                </Button>
              </div>
            </div>
          )}

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
                      const updated = { ...formData, first_name: e.target.value }
                      setFormData(updated)
                      clearFieldError('first_name')
                      triggerDuplicateCheck(updated)
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
                      const updated = { ...formData, last_name: e.target.value }
                      setFormData(updated)
                      clearFieldError('last_name')
                      triggerDuplicateCheck(updated)
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      const updated = { ...formData, email: e.target.value }
                      setFormData(updated)
                      clearFieldError('email')
                      triggerDuplicateCheck(updated)
                    }}
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., john@example.com"
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
                      const updated = { ...formData, phone: e.target.value }
                      setFormData(updated)
                      clearFieldError('phone')
                      triggerDuplicateCheck(updated)
                    }}
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g., +1234567890"
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
                      const updated = { ...formData, date_of_birth: e.target.value }
                      setFormData(updated)
                      clearFieldError('date_of_birth')
                      triggerDuplicateCheck(updated)
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
                      { value: '', label: 'Select Gender' },
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' }
                    ]}
                    placeholder="Select Gender"
                    disabled={isSubmitting}
                    dataField="gender"
                  />
                  {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter address"
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Medical Information</h3>

              {/* Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergency_contact_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Emergency contact name"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                    className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Emergency contact phone"
                    disabled={isSubmitting}
                  />
                  {errors.emergency_contact_phone && <p className="mt-1 text-sm text-red-500">{errors.emergency_contact_phone}</p>}
                </div>
              </div>

              {/* Medical History */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Medical History</label>
                <textarea
                  value={formData.medical_history}
                  onChange={(e) => setFormData(prev => ({ ...prev, medical_history: e.target.value }))}
                  className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter medical history"
                  rows={3}
                  disabled={isSubmitting}
                />
                {errors.medical_history && <p className="mt-1 text-sm text-red-500">{errors.medical_history}</p>}
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Allergies</label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                  className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter known allergies"
                  rows={2}
                  disabled={isSubmitting}
                />
                {errors.allergies && <p className="mt-1 text-sm text-red-500">{errors.allergies}</p>}
              </div>

              {/* Medications */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Medications</label>
                <textarea
                  value={formData.medications}
                  onChange={(e) => setFormData(prev => ({ ...prev, medications: e.target.value }))}
                  className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter current medications"
                  rows={2}
                  disabled={isSubmitting}
                />
                {errors.medications && <p className="mt-1 text-sm text-red-500">{errors.medications}</p>}
              </div>

              {/* Chronic Conditions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Chronic Conditions</label>
                <textarea
                  value={formData.chronic_conditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, chronic_conditions: e.target.value }))}
                  className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter chronic conditions"
                  rows={2}
                  disabled={isSubmitting}
                />
                {errors.chronic_conditions && <p className="mt-1 text-sm text-red-500">{errors.chronic_conditions}</p>}
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4 mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                type="button"
                className="px-4 py-2 border-none bg-transparent text-gray-300 hover:text-foreground hover:bg-transparent"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-4 py-2 bg-primary/90 text-primary-foreground hover:bg-primary/80"
                disabled={isSubmitting || isCheckingDuplicate}
              >
                {isSubmitting
                  ? 'Creating...'
                  : isCheckingDuplicate
                  ? 'Scanning...'
                  : 'Create Patient'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <UserCheck className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Patient Created Successfully!</h3>
          <p className="text-gray-400 mb-6">
            {formData.first_name} {formData.last_name} has been added to the system.
          </p>
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-primary/80 text-primary-foreground hover:bg-primary/70"
          >
            Done
          </Button>
        </div>
      )}
    </Modal>
  )
}
