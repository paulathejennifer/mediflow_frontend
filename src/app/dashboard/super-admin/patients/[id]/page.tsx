'use client'

import { useParams } from 'next/navigation'
import { PatientProfile } from '@/components/patients/patient-profile'

export default function PatientProfilePage() {
  const params = useParams()
  const patientId = params.id as string

  return (
    <div className="p-6">
      <PatientProfile patientId={patientId} />
    </div>
  )
}
