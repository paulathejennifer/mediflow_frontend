export interface Referral {
  id: string
  patientId: string
  patient: string
  condition: string
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'accepted' | 'completed' | 'in_progress' | 'rejected' | 'cancelled' | 'draft'
  receivingFacility: string
  date: string
  reason?: string
  clinicalNotes?: string
  referringClinician?: {
    name: string
    department: string
    facility: string
  }
  attachments?: {
    documents: Document[]
    voiceNotes: VoiceNote[]
  }
  timeline?: TimelineEvent[]
  aiAnalysis?: AIAnalysis
}

export interface Document {
  id: string
  name: string
  size: number
  uploader: string
  aiStatus: 'completed' | 'pending'
  type: string
}

export interface VoiceNote {
  id: string
  name: string
  duration: string
  uploader: string
  aiStatus: 'completed' | 'pending'
  createdAt: string
}

export interface TimelineEvent {
  id: string
  action: 'created' | 'submitted' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'updated'
  description: string
  timestamp: string
  user: string
}

export interface AIAnalysis {
  summary: string
  key_findings: string[]
  risks: string[]
  missing_info: string[]
  recommendations: string[]
  completeness_score: number
  urgency_level: 'High' | 'Medium' | 'Low'
}

export const mockReferralsData: Referral[] = [
  {
    id: 'REF-001',
    patientId: '1',
    patient: 'John Doe',
    condition: 'Suspected cardiac arrhythmia',
    priority: 'high',
    status: 'pending',
    receivingFacility: 'National Cardiology Center',
    date: '2026-05-11T22:59:00',
    reason: 'Suspected cardiac arrhythmia requiring specialist evaluation',
    clinicalNotes: `Patient presents with recurring palpitations over the past 3 months, increasing in frequency. 

Episodes occur at rest and during exertion. Associated symptoms include shortness of breath and occasional chest discomfort.

Physical examination reveals irregular pulse. ECG shows intermittent atrial fibrillation.

Current medications include Metformin 500mg BD for diabetes management.

Requesting cardiology evaluation for further assessment and management recommendations.`,
    referringClinician: {
      name: 'Dr. Sarah Johnson',
      department: 'Internal Medicine',
      facility: 'Central Hospital Lagos'
    },
    attachments: {
      documents: [
        {
          id: 'doc1',
          name: 'ECG_Report.pdf',
          size: 239.3,
          uploader: 'Dr. Sarah Johnson',
          aiStatus: 'completed',
          type: 'pdf'
        },
        {
          id: 'doc2',
          name: 'Lab_Results.pdf',
          size: 175.8,
          uploader: 'Dr. Sarah Johnson',
          aiStatus: 'completed',
          type: 'pdf'
        }
      ],
      voiceNotes: []
    },
    timeline: [
      {
        id: 'event1',
        action: 'created',
        description: 'Referral created and submitted for review',
        timestamp: '2026-05-11T22:59:00',
        user: 'Dr. Sarah Johnson'
      },
      {
        id: 'event2',
        action: 'submitted',
        description: 'Referral sent to National Cardiology Center',
        timestamp: '2026-05-11T23:04:00',
        user: 'Dr. Sarah Johnson'
      }
    ],
    aiAnalysis: {
      summary: 'Male patient, 38 years old, with history of hypertension and Type 2 diabetes. Presenting with cardiac arrhythmia symptoms including palpitations, shortness of breath, and chest discomfort. ECG confirms intermittent atrial fibrillation. Current medications include Metformin for diabetes management.',
      key_findings: [
        'Recurring palpitations over 3 months',
        'Episodes at rest and exertion',
        'Shortness of breath and chest discomfort',
        'Irregular pulse on examination',
        'ECG shows intermittent atrial fibrillation',
        'Metformin 500mg for diabetes'
      ],
      risks: [
        'Diabetes',
        'Hypertension',
        'Family History of Heart Disease'
      ],
      missing_info: [
        'Recent blood pressure readings',
        'Complete lipid panel results',
        'Weight and BMI data'
      ],
      recommendations: [
        'Add recent vital signs including blood pressure and heart rate',
        'Include echocardiogram results if available',
        'Document smoking and alcohol history',
        'Specify duration of diabetes and hypertension'
      ],
      completeness_score: 7,
      urgency_level: 'High'
    }
  },
  {
    id: 'REF-002',
    patientId: '2',
    patient: 'Jane Smith',
    condition: 'Stroke Symptoms',
    priority: 'high',
    status: 'accepted',
    receivingFacility: 'Regional Medical Center',
    date: '2026-05-10T14:30:00'
  },
  {
    id: 'REF-003',
    patientId: '3',
    patient: 'Michael Johnson',
    condition: 'Pneumonia',
    priority: 'medium',
    status: 'completed',
    receivingFacility: 'Community Health Clinic',
    date: '2026-05-09T09:15:00'
  }
]
