'use client'

import { useState, useEffect } from 'react'
import { PatientHeader } from './_components/patient-header'
import { PatientDetails } from './_components/patient-details'
import { MedicationsList } from './_components/medications-list'
import { ActivityCards } from './_components/activity-cards'
import { MedicalHistory } from './_components/medical-history'
import { ChronicConditions } from './_components/chronic-conditions'
import { Allergies } from './_components/allergies'
import { ReferralSummary } from './_components/referral-summary'
import { EditPatientModal } from '@/components/modals/edit-patient-modal'
import { patientService } from '@/features/patients/services/patient.service'

interface ReferralData {
  id: string
  condition: string
  to: string
  date: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'completed' | 'in-progress'
}

interface LocalPatientData {
  id: number
  firstName: string
  lastName: string
  dateOfBirth: string
  first_name?: string
  last_name?: string
  date_of_birth?: string
  gender: string
  email?: string
  phone?: string
  emergencyContact?: string
  emergencyPhone?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  lastVisit: string
  allergies: string[]
  registrationDate: string
  medications: string[]
  medicalHistory: string[]
  chronicConditions: string[]
  referrals: ReferralData[]
  profileImage?: string
}

interface PatientProfileProps {
  patientId: string
}

const parseStringList = (value: unknown): string[] => {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
  }

  if (typeof value !== 'string') {
    return []
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return []
  }

  try {
    const parsed = JSON.parse(trimmed)
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean)
    }
  } catch {
    // ignore invalid JSON and fall back to delimiter parsing
  }

  return trimmed
    .split(/[,\n]+/)
    .map((item) => item.trim())
    .filter(Boolean)
}

const parseReferrals = (value: unknown): ReferralData[] => {
  if (!value) return []
  if (!Array.isArray(value)) return []

  return value
    .filter((item) => item && typeof item === 'object')
    .map((item: any) => ({
      id: String(item.id ?? item.referralId ?? ''),
      condition: String(item.condition ?? item.reason ?? 'Unknown condition'),
      to: String(item.to ?? item.destination ?? 'Unknown facility'),
      date: String(item.date ?? item.created_at ?? ''),
      priority: ['high', 'medium', 'low'].includes(item.priority) ? item.priority : 'low',
      status: ['pending', 'completed', 'in-progress'].includes(item.status) ? item.status : 'pending'
    }))
}

const normalizePatient = (raw: any): LocalPatientData => {
  return {
    id: Number(raw?.id ?? raw?.patient_id ?? 0),
    firstName: raw?.first_name || raw?.firstName || '',
    lastName: raw?.last_name || raw?.lastName || '',
    dateOfBirth: raw?.date_of_birth || raw?.dateOfBirth || '',
    first_name: raw?.first_name || raw?.firstName || '',
    last_name: raw?.last_name || raw?.lastName || '',
    date_of_birth: raw?.date_of_birth || raw?.dateOfBirth || '',
    gender: String(raw?.gender || raw?.sex || 'unknown'),
    email: raw?.email || '',
    phone: raw?.phone || '',
    emergencyContact: raw?.emergency_contact_name || raw?.emergencyContact || '',
    emergencyPhone: raw?.emergency_contact_phone || raw?.emergencyPhone || '',
    emergency_contact_name: raw?.emergency_contact_name || raw?.emergencyContact || '',
    emergency_contact_phone: raw?.emergency_contact_phone || raw?.emergencyPhone || '',
    lastVisit: raw?.updated_at || raw?.lastVisit || raw?.last_visit || '',
    registrationDate: raw?.created_at || '',
    allergies: parseStringList(raw?.allergies),
    medications: parseStringList(raw?.medications),
    medicalHistory: parseStringList(raw?.medical_history),
    chronicConditions: parseStringList(raw?.chronic_conditions),
    referrals: parseReferrals(raw?.referrals),
    profileImage: raw?.profile_image || raw?.profileImage || undefined
  }
}

export function PatientProfile({ patientId }: PatientProfileProps) {
  const [patient, setPatient] = useState<LocalPatientData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    const fetchPatient = async () => {
      setIsLoading(true)
      setError(null)

      const id = Number(patientId)
      if (!id) {
        setError('Invalid patient ID')
        setIsLoading(false)
        return
      }

      try {
        const patientData = await patientService.getPatientById(id)
        setPatient(normalizePatient(patientData))
      } catch (err: any) {
        console.error('Failed to load patient:', err)
        setError(err?.response?.data?.detail || 'Failed to load patient data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPatient()
  }, [patientId])

  const handleEditPatient = () => {
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  const handlePatientUpdate = (updatedPatient: any) => {
    setPatient(normalizePatient(updatedPatient))
    setIsEditModalOpen(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center text-muted-foreground">Loading patient data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Unable to load patient</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Patient Not Found</h2>
          <p className="text-muted-foreground">The patient you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  const patientName = `${patient.firstName} ${patient.lastName}`

  return (
    <div className="space-y-6">
      <PatientHeader
        patientName={patientName}
        patientDescription="View and manage patient information"
        patientId={patientId}
        onEditPatient={handleEditPatient}
      />

      <div className="space-y-6">
        <PatientDetails
          firstName={patient.firstName}
          lastName={patient.lastName}
          dateOfBirth={patient.dateOfBirth}
          gender={patient.gender}
          email={patient.email}
          phone={patient.phone}
          emergencyContact={patient.emergencyContact}
          emergencyPhone={patient.emergencyPhone}
          lastVisit={patient.lastVisit}
          profileImage={patient.profileImage}
        />
      </div>

      <ActivityCards 
        referrals={patient.referrals} 
        registrationDate={patient.registrationDate} 
      />

      <MedicationsList
        medications={patient.medications}
        onMedicationsChange={(updated) => setPatient((prev) => prev ? { ...prev, medications: updated } : prev)}
      />

      <div className="space-y-6">
        <Allergies allergies={patient.allergies} onAllergiesChange={(updated) => setPatient((prev) => prev ? { ...prev, allergies: updated } : prev)} />
        <MedicalHistory medicalHistory={patient.medicalHistory} onMedicalHistoryChange={(updated) => setPatient((prev) => prev ? { ...prev, medicalHistory: updated } : prev)} />
        <ChronicConditions chronicConditions={patient.chronicConditions} onChronicConditionsChange={(updated) => setPatient((prev) => prev ? { ...prev, chronicConditions: updated } : prev)} />
      </div>

      <ReferralSummary referrals={patient.referrals} />

      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSuccess={handlePatientUpdate}
        patient={patient}
      />
    </div>
  )
}
