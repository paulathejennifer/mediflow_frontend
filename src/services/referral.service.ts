export interface Referral {
  id: string
  patient: string
  condition: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'accepted' | 'completed'
  receivingFacility: string
  date: string
}

export const mockReferralsData: Referral[] = [
  {
    id: 'REF-001',
    patient: 'John Smith',
    condition: 'Acute Myocardial Infarction',
    priority: 'high',
    status: 'pending',
    receivingFacility: 'City General Hospital',
    date: '2024-01-15'
  },
  {
    id: 'REF-002',
    patient: 'Sarah Johnson',
    condition: 'Stroke Symptoms',
    priority: 'high',
    status: 'accepted',
    receivingFacility: 'Regional Medical Center',
    date: '2024-01-15'
  },
  {
    id: 'REF-003',
    patient: 'Michael Brown',
    condition: 'Pneumonia',
    priority: 'medium',
    status: 'completed',
    receivingFacility: 'Community Health Clinic',
    date: '2024-01-14'
  },
  {
    id: 'REF-004',
    patient: 'Emily Davis',
    condition: 'Fractured Hip',
    priority: 'medium',
    status: 'pending',
    receivingFacility: 'Orthopedic Specialty Hospital',
    date: '2024-01-15'
  },
  {
    id: 'REF-005',
    patient: 'Robert Wilson',
    condition: 'Diabetic Emergency',
    priority: 'high',
    status: 'accepted',
    receivingFacility: 'City General Hospital',
    date: '2024-01-14'
  },
  {
    id: 'REF-006',
    patient: 'Lisa Anderson',
    condition: 'Chest Pain',
    priority: 'medium',
    status: 'completed',
    receivingFacility: 'Heart Care Center',
    date: '2024-01-13'
  },
  {
    id: 'REF-007',
    patient: 'James Taylor',
    condition: 'Respiratory Distress',
    priority: 'high',
    status: 'pending',
    receivingFacility: 'Regional Medical Center',
    date: '2024-01-15'
  },
  {
    id: 'REF-008',
    patient: 'Maria Garcia',
    condition: 'Abdominal Pain',
    priority: 'low',
    status: 'accepted',
    receivingFacility: 'Community Health Clinic',
    date: '2024-01-14'
  },
  {
    id: 'REF-009',
    patient: 'David Martinez',
    condition: 'Head Injury',
    priority: 'high',
    status: 'completed',
    receivingFacility: 'Trauma Center',
    date: '2024-01-13'
  },
  {
    id: 'REF-010',
    patient: 'Jennifer White',
    condition: 'Asthma Attack',
    priority: 'medium',
    status: 'pending',
    receivingFacility: 'City General Hospital',
    date: '2024-01-15'
  }
]
