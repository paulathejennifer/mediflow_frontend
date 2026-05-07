'use client'

import { useState, useEffect, useRef } from 'react'
import { Modal } from '@/components/shared/modal'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Check } from 'lucide-react'

interface PatientCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (patient: any) => void
}

export function PatientCreationModal({ isOpen, onClose, onSuccess }: PatientCreationModalProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'patient',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_history: '',
    allergies: '',
    is_active: true
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
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
        role: 'patient',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        medical_history: '',
        allergies: '',
        is_active: true
      })
      setErrors({})
      setShowSuccess(false)
      setShowPassword(false)
    }
  }, [isOpen])

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
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!formData.date_of_birth.trim()) newErrors.date_of_birth = 'Date of birth is required'
    if (!formData.gender.trim()) newErrors.gender = 'Gender is required'

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    // Phone validation
    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format'
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
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const newPatient = {
        ...formData,
        id: `patient_${Date.now()}`,
        mrn: `MRN${Date.now()}`,
        registered_date: new Date().toISOString().split('T')[0],
        status: 'active'
      }

      onSuccess(newPatient)
      setShowSuccess(false)
      
    } catch (error) {
      console.error('Error creating patient:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={showSuccess ? "Patient Created" : "Create New Patient"}
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
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter first name"
                    disabled={isSubmitting}
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
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter last name"
                    disabled={isSubmitting}
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
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter email address"
                    disabled={isSubmitting}
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
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter phone number"
                    disabled={isSubmitting}
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
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isSubmitting}
                  />
                  {errors.date_of_birth && <p className="mt-1 text-sm text-red-500">{errors.date_of_birth}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, gender: e.target.value }))
                      clearFieldError('gender')
                    }}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    disabled={isSubmitting}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-red-500">{errors.gender}</p>}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Emergency Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.emergency_contact_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_name: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Emergency contact name"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Emergency Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact_phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Emergency contact phone"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Medical History */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Medical History
                </label>
                <textarea
                  value={formData.medical_history}
                  onChange={(e) => setFormData(prev => ({ ...prev, medical_history: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter medical history"
                  rows={3}
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
                  onChange={(e) => setFormData(prev => ({ ...prev, allergies: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter known allergies"
                  rows={2}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Account Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">Account Information</h3>
              
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
                    className="w-full px-3 py-2 pr-10 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter secure password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
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
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
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
            </div>
          
          <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-4 -mx-6 -mb-6 flex justify-end gap-3">
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
              {isSubmitting ? 'Creating...' : 'Create Patient'}
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
          <h3 className="text-xl font-semibold text-white mb-2">Patient Created Successfully!</h3>
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
