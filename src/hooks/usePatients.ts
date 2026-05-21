import { useState, useEffect } from 'react'
import { patientService } from '@/services/patient.service'

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

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const fetchPatients = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await patientService.getPatients()
      const transformedData = data.map((patient: any) => ({
        id: patient.id,
        name: `${patient.first_name} ${patient.last_name}`,
        email: patient.email,
        phone: patient.phone,
        mrn: patient.identifiers?.[0]?.mrn || '',
        location: patient.identifiers?.[0]?.facility_name || '',
        status: 'active' as const,
        gender: patient.gender,
        age: calculateAge(patient.date_of_birth),
        referrals: 0,
        lastVisit: patient.updated_at,
        registrationDate: patient.created_at
      }))
      setPatients(transformedData)
    } catch (error) {
      console.error('Failed to fetch patients:', error)
      setError('Failed to load patients')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  return { patients, isLoading, error, refetch: fetchPatients }
}
