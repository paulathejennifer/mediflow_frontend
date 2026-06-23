import { useState, useEffect, useCallback } from 'react'
import { patientService } from '../services/patient.service'

export interface UIPatient {
  id: number
  name: string
  email: string
  phone: string
  mrn: string
  location: string
  status: 'active' | 'inactive' | 'pending'
  gender: 'male' | 'female' | 'other'
  age: number
  referrals: number
  lastVisit: string
  registrationDate: string
}

export const usePatients = () => {
  const [patients, setPatients] = useState<UIPatient[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const calculateAge = (dateOfBirth: string | null | undefined): number => {
    if (!dateOfBirth) return 0

    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    
    if (isNaN(birthDate.getTime())) return 0

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return Math.max(0, age) // Prevent negative ages
  }

  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const data = await patientService.getPatients()

      const transformedData: UIPatient[] = data.map((patient: any) => ({
        id: patient.id,
        name: `${patient.first_name || ''} ${patient.last_name || ''}`.trim(),
        email: patient.email || '',
        phone: patient.phone || '',
        mrn: patient.identifiers?.[0]?.mrn || 'N/A',
        location: patient.identifiers?.[0]?.facility_name || patient.location || '',
        status: (patient.status as 'active' | 'inactive' | 'pending') || 'active',
        gender: patient.gender || 'other',
        age: calculateAge(patient.date_of_birth),
        referrals: patient.referrals_count || 0,
        lastVisit: patient.updated_at || patient.created_at || '',
        registrationDate: patient.created_at || '',
      }))

      setPatients(transformedData)
    } catch (err: any) {
      console.error('Failed to fetch patients:', err)
      setError(err?.message || 'Failed to load patients')
      setPatients([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  return {
    patients,
    isLoading,
    error,
    refetch: fetchPatients,
  }
}