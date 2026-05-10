'use client'

import { useState } from 'react'
import { PatientHeader } from './_components/patient-header'
import { PatientDetails } from './_components/patient-details'
import { MedicationsList } from './_components/medications-list'
import { ActivityCards } from './_components/activity-cards'
import { MedicalHistory } from './_components/medical-history'
import { ChronicConditions } from './_components/chronic-conditions'
import { Allergies } from './_components/allergies'
import { ReferralSummary } from './_components/referral-summary'
import { EditPatientModal } from '@/components/modals/edit-patient-modal'

interface ReferralData {
  id: string
  condition: string
  to: string
  date: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'completed' | 'in-progress'
}

interface PatientData {
  id: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email?: string
  phone?: string
  emergencyContact?: string
  emergencyPhone?: string
  lastVisit: string
  allergies: string[]
  medications: string[]
  medicalHistory: string[]
  chronicConditions: string[]
  referrals: ReferralData[]
  profileImage?: string
}

interface PatientProfileProps {
  patientId: string
}

const mockPatientData: Record<string, PatientData> = {
  '1': {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    email: 'john.doe@email.com',
    phone: '+254 712 345 678',
    emergencyContact: 'Jane Doe',
    emergencyPhone: '+254 712 345 679',
    lastVisit: '2024-05-08',
    allergies: ['Penicillin', 'Shellfish'],
    medications: ['Lisinopril 10mg', 'Metformin 500mg', 'Aspirin 81mg'],
    medicalHistory: [
      '2020: Diagnosed with Type 2 Diabetes',
      '2019: Hypertension diagnosis',
      '2018: Appendectomy',
      '2015: Knee surgery'
    ],
    chronicConditions: ['Type 2 Diabetes', 'Hypertension'],
    referrals: [
      {
        id: '1',
        condition: 'Chest pain',
        to: 'Kenyatta National Hospital',
        date: '2024-05-08',
        priority: 'high',
        status: 'pending'
      },
      {
        id: '2',
        condition: 'Cardiology consultation',
        to: 'MTRH',
        date: '2024-05-06',
        priority: 'medium',
        status: 'completed'
      },
      {
        id: '3',
        condition: 'Orthopedic review',
        to: 'Nairobi Hospital',
        date: '2024-04-28',
        priority: 'low',
        status: 'completed'
      }
    ]
  },
  '2': {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1990-03-22',
    gender: 'Female',
    email: 'jane.smith@email.com',
    phone: '+254 723 456 789',
    emergencyContact: 'Bob Smith',
    emergencyPhone: '+254 723 456 790',
    lastVisit: '2024-05-10',
    allergies: ['Peanuts', 'Latex'],
    medications: ['Albuterol inhaler', 'Loratadine 10mg'],
    medicalHistory: [
      '2022: Asthma diagnosis',
      '2021: Allergic reaction treatment',
      '2019: Sports injury'
    ],
    chronicConditions: ['Asthma'],
    referrals: [
      {
        id: '4',
        condition: 'Asthma exacerbation',
        to: 'MTRH',
        date: '2024-05-10',
        priority: 'medium',
        status: 'in-progress'
      }
    ]
  },
  '3': {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    dateOfBirth: '1978-11-30',
    gender: 'Male',
    email: 'michael.johnson@email.com',
    phone: '+254 734 567 890',
    emergencyContact: 'Sarah Johnson',
    emergencyPhone: '+254 734 567 891',
    lastVisit: '2024-05-05',
    allergies: ['None'],
    medications: ['Atorvastatin 20mg', 'Losartan 50mg'],
    medicalHistory: [
      '2021: Heart attack',
      '2020: High cholesterol diagnosis',
      '2018: Stent placement'
    ],
    chronicConditions: ['Coronary artery disease', 'High cholesterol'],
    referrals: [
      {
        id: '5',
        condition: 'Cardiac follow-up',
        to: 'Kenyatta National Hospital',
        date: '2024-05-05',
        priority: 'high',
        status: 'completed'
      }
    ]
  },
  '4': {
    id: '4',
    firstName: 'Emily',
    lastName: 'Williams',
    dateOfBirth: '1995-08-18',
    gender: 'Female',
    email: 'emily.williams@email.com',
    phone: '+254 745 678 901',
    emergencyContact: 'David Williams',
    emergencyPhone: '+254 745 678 902',
    lastVisit: '2024-05-09',
    allergies: ['None'],
    medications: ['Folic acid 400mcg', 'Prenatal vitamins'],
    medicalHistory: [
      '2023: Pregnancy confirmed',
      '2022: Regular check-ups',
      '2021: Vaccination updates'
    ],
    chronicConditions: ['None'],
    referrals: [
      {
        id: '6',
        condition: 'Prenatal care',
        to: 'Nairobi Hospital',
        date: '2024-05-09',
        priority: 'low',
        status: 'completed'
      }
    ]
  }
}

export function PatientProfile({ patientId }: PatientProfileProps) {
  const [patient, setPatient] = useState<PatientData | null>(
    mockPatientData[patientId] || null
  )
  
  const [medications, setMedications] = useState<string[]>(patient?.medications || [])
  const [allergies, setAllergies] = useState<string[]>(patient?.allergies || [])
  const [medicalHistory, setMedicalHistory] = useState<string[]>(patient?.medicalHistory || [])
  const [chronicConditions, setChronicConditions] = useState<string[]>(patient?.chronicConditions || [])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleEditPatient = () => {
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
  }

  const handlePatientUpdate = (updatedPatient: any) => {
    // Update the patient data in state
    // In a real app, this would update the backend
    console.log('Patient updated:', updatedPatient)
    setPatient(updatedPatient)
    setIsEditModalOpen(false)
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

      <ActivityCards />

      <MedicationsList
        medications={medications}
        onMedicationsChange={setMedications}
      />

      <div className="space-y-6">
        <Allergies allergies={allergies} onAllergiesChange={setAllergies} />
        <MedicalHistory medicalHistory={medicalHistory} onMedicalHistoryChange={setMedicalHistory} />
        <ChronicConditions chronicConditions={chronicConditions} onChronicConditionsChange={setChronicConditions} />
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
