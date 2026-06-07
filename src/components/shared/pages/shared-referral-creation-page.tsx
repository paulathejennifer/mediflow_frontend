'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Upload, Mic, FileText, AlertCircle, Clock, Zap, Shield } from 'lucide-react'
import { patientService } from '@/features/patients/services/patient.service'
import { facilityService } from '@/features/facilities/services/facility.service'
import { referralService } from '@/features/referrals/services/referral.service'
import { documentService } from '@/features/documents/services/document.service'
import { voiceNoteService } from '@/features/voice-notes/services/voice-note.service'
import { formatTableDate } from '@/utils/date-utils'
import { PatientCreationModal } from '@/components/modals/patient-creation-modal'
import { VoiceRecorder } from '@/components/voice-notes/voice-recorder'
import { useAuthStore } from '@/store/auth-store'
import { Modal } from '@/components/shared'
import { toast } from '@/lib/toast'

// AutocompleteInput component for patient and facility search
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
    
    // If input is cleared, clear value
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
        onFocus={() => setIsOpen(true)}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />
      
      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-full bg-gray-900 border border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {filteredOptions.map((option, index) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-800 transition-colors ${
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

interface ReferralCreationPageProps {
  userRole?: string
}

export function SharedReferralCreationPage({ userRole = 'clinician' }: ReferralCreationPageProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false)
  const [showEnrichmentModal, setShowEnrichmentModal] = useState(false)
  const [isRecordingInEnrichment, setIsRecordingInEnrichment] = useState(false)
  const [createdReferralId, setCreatedReferralId] = useState<number | null>(null)
  const [patients, setPatients] = useState<any[]>([])
  const [facilities, setFacilities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [patientsData, facilitiesData] = await Promise.all([
        patientService.getPatients(),
        facilityService.getFacilities()
      ])
      // Transform patients data to match expected format
      const transformedPatients = patientsData.map((patient: any) => ({
        ...patient,
        name: `${patient.first_name} ${patient.last_name}`,
        mrn: patient.identifiers?.[0]?.mrn || 'N/A'
      }))
      setPatients(transformedPatients)
      // Transform facilities data to match expected format
      const transformedFacilities = facilitiesData.map((facility: any) => ({
        ...facility,
        facilityCode: facility.facility_code
      }))
      setFacilities(transformedFacilities)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setPatients([])
      setFacilities([])
    } finally {
      setIsLoading(false)
    }
  }
  
  const [formData, setFormData] = useState({
    patientId: '',
    receivingFacilityId: '',
    reason: '',
    clinicalNotes: '',
    urgency: 'medium',
    attachments: [] as File[],
    voiceNotes: [] as File[]
  })

  // Prepare patient options for autocomplete
  const patientOptions = patients.map(patient => ({
    value: patient.id,
    label: `${patient.name} (MRN: ${patient.mrn})`
  }))

  // Handle patient creation success
  const handlePatientCreated = (newPatient: any) => {
    setPatients(prev => [...prev, newPatient])
    // Auto-select the newly created patient
    setFormData(prev => ({ ...prev, patientId: newPatient.id }))
    setIsPatientModalOpen(false)
  }

  // Prepare facility options for autocomplete
  const facilityOptions = facilities
    .filter(facility => String(facility.id) !== String(user?.facility_id))
    .map(facility => ({
      value: facility.id,
      label: `${facility.name} (${facility.facilityCode})`
    }))

  const urgencyLevels = [
    {
      value: 'low',
      label: 'Low',
      description: 'Routine referral can wait weeks',
      icon: <Clock className="h-4 w-4" />,
      color: 'bg-green-600/10 border-green-600/20 text-green-600'
    },
    {
      value: 'medium',
      label: 'Medium',
      description: 'Should be seen within days',
      icon: <AlertCircle className="h-4 w-4" />,
      color: 'bg-yellow-600/10 border-yellow-600/20 text-yellow-600'
    },
    {
      value: 'high',
      label: 'High',
      description: 'Urgent request',
      icon: <Zap className="h-4 w-4" />,
      color: 'bg-orange-600/10 border-orange-600/20 text-orange-600'
    },
    {
      value: 'emergency',
      label: 'Emergency',
      description: 'Immediate attention required',
      icon: <Shield className="h-4 w-4" />,
      color: 'bg-red-600/10 border-red-600/20 text-red-600'
    }
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.patientId) newErrors.patientId = 'Patient selection is required'
    if (!formData.receivingFacilityId) newErrors.receivingFacilityId = 'Receiving facility is required'
    if (!formData.reason.trim()) newErrors.reason = 'Reason for referral is required'
    if (!formData.urgency) newErrors.urgency = 'Urgency level is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const referral = await referralService.createReferral({
        patient_id: Number(formData.patientId),
        to_facility_id: Number(formData.receivingFacilityId),
        priority: formData.urgency as 'low' | 'medium' | 'high' | 'emergency',
        reason_for_referral: formData.reason,
        clinical_notes: formData.clinicalNotes || formData.reason,
      })

      await Promise.all([
        ...formData.attachments.map((file) =>
          documentService.uploadDocument({
            file,
            referral_id: referral.id,
            document_type: 'lab_report',
          })
        ),
        ...formData.voiceNotes.map((file) =>
          voiceNoteService.uploadVoiceNote({
            audio_file: file,
            referral_id: referral.id,
          })
        ),
      ])

      await referralService.submitReferral(referral.id)
      setCreatedReferralId(referral.id)
      setShowEnrichmentModal(true)
    } catch (error) {
      console.error('Failed to create referral:', error)
      toast.error('Failed to create referral. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const handleVoiceNoteUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      voiceNotes: [...prev.voiceNotes, ...files]
    }))
  }

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const removeVoiceNote = (index: number) => {
    setFormData(prev => ({
      ...prev,
      voiceNotes: prev.voiceNotes.filter((_, i) => i !== index)
    }))
  }

  const handleRecordingComplete = (file: File) => {
    setFormData(prev => ({
      ...prev,
      voiceNotes: [...prev.voiceNotes, file]
    }))
  }

  const handleFinalRedirect = () => {
    router.push(`/dashboard/${userRole.replace('_', '-')}/referrals`)
  }

  if (isLoading) {
    return <div className="p-6 max-w-4xl mx-auto">Loading...</div>
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground hover:bg-transparent"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          
        </Button>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Create Referral</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Submit a new patient referral to another facility
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Information */}
        <Card className="bg-gray-900/60 border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Patient <span className="text-red-500">*</span>
              </label>
              <AutocompleteInput
                value={formData.patientId}
                onChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))}
                options={patientOptions}
                placeholder="Type to search for patient (name or MRN)..."
              />
              {errors.patientId && <p className="mt-1 text-sm text-red-500">{errors.patientId}</p>}
              <p className="mt-2 text-xs text-gray-400">
                Don't see the patient? <Button variant="link" className="p-0 h-auto text-xs text-primary hover:text-primary/80" onClick={() => setIsPatientModalOpen(true)}>Quick Add New Patient</Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Referral Details */}
        <Card className="bg-gray-900/60 border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              Referral Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From Facility (Auto-filled) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  From Facility
                </label>
                <input
                  type="text"
                  value={facilities.find(f => String(f.id) === String(user?.facility_id))?.name || 'Loading facility...'}
                  disabled
                  className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-md text-gray-400 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-400">Your current facility</p>
              </div>

              {/* To Facility */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  To Facility <span className="text-red-500">*</span>
                </label>
                <AutocompleteInput
                  value={formData.receivingFacilityId}
                  onChange={(value) => setFormData(prev => ({ ...prev, receivingFacilityId: value }))}
                  options={facilityOptions}
                  placeholder="Type to search for facility..."
                />
                {errors.receivingFacilityId && <p className="mt-1 text-sm text-red-500">{errors.receivingFacilityId}</p>}
              </div>
            </div>

            {/* Reason for Referral */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reason for Referral <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.reason}
                onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Suspected cardiac arrhythmia requiring specialist evaluation"
              />
              {errors.reason && <p className="mt-1 text-sm text-red-500">{errors.reason}</p>}
            </div>

            {/* Clinical Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Clinical Notes
              </label>
              <textarea
                value={formData.clinicalNotes}
                onChange={(e) => setFormData(prev => ({ ...prev, clinicalNotes: e.target.value }))}
                className="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                rows={4}
                placeholder="Provide detailed clinician notes, including symptoms, examination findings, and relevant history."
              />
            </div>

            {/* Urgency Level */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Urgency Level <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {urgencyLevels.map((level) => (
                  <div
                    key={level.value}
                    className={`relative cursor-pointer rounded-lg border p-4 transition-all hover:border-primary/50 ${
                      formData.urgency === level.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-gray-800/30'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, urgency: level.value }))}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${level.color}`}>
                        {level.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-foreground text-sm">{level.label}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                      </div>
                    </div>
                    {formData.urgency === level.value && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
              {errors.urgency && <p className="mt-1 text-sm text-red-500">{errors.urgency}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="px-6 py-2 border-none bg-transparent text-gray-300 hover:text-foreground hover:bg-transparent"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 bg-primary/90 text-primary-foreground hover:bg-primary/80"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Referral...' : 'Create Referral'}
          </Button>
        </div>
      </form>

      {/* Patient Creation Modal */}
      <PatientCreationModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSuccess={handlePatientCreated}
      />
    </div>
  )
}