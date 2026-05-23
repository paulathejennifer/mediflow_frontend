import { Referral as ApiReferral } from '@/features/referrals/services/referral.service'

export interface ReferralTableRow {
  id: string
  patient: string
  condition: string
  priority: 'high' | 'medium' | 'low'
  status: 'draft' | 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'cancelled'
  receivingFacility: string
  date: string
}

export interface ReferralSummaryApi {
  id: number
  patient_name: string
  from_facility_name: string
  to_facility_name: string
  status: string
  priority: string
  created_at: string
}

function mapPriority(priority: string): ReferralTableRow['priority'] {
  if (priority === 'emergency' || priority === 'high') return 'high'
  if (priority === 'low') return 'low'
  return 'medium'
}

function mapStatus(status: string): ReferralTableRow['status'] {
  switch (status) {
    case 'draft':
      return 'draft'
    case 'submitted':
      return 'pending'
    case 'accepted':
      return 'accepted'
    case 'in_transit':
    case 'received':
      return 'in_progress'
    case 'completed':
      return 'completed'
    case 'rejected':
      return 'rejected'
    default:
      return 'pending'
  }
}

export function mapReferralSummaryToTableRow(r: ReferralSummaryApi): ReferralTableRow {
  return {
    id: `REF-${String(r.id).padStart(3, '0')}`,
    patient: r.patient_name,
    condition: `Referral to ${r.to_facility_name}`,
    priority: mapPriority(r.priority),
    status: mapStatus(r.status),
    receivingFacility: r.to_facility_name,
    date: r.created_at,
  }
}

export interface ReferralDetailView {
  id: string
  patientId: string
  patient: string
  condition: string
  priority: string
  status: string
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
    documents: Array<{
      id: string
      name: string
      size: number
      uploader: string
      aiStatus: 'completed' | 'pending'
      type: string
    }>
    voiceNotes: Array<{
      id: string
      name: string
      duration: string
      uploader: string
      aiStatus: 'completed' | 'pending'
      createdAt: string
    }>
  }
  timeline?: Array<{
    id: string
    action: string
    description: string
    timestamp: string
    user: string
  }>
  aiAnalysis?: {
    summary: string
    key_findings: string[]
    risks: string[]
    missing_info: string[]
    recommendations: string[]
    completeness_score: number
    urgency_level: string
  }
}

export function mapApiReferralToDetailView(r: ApiReferral): ReferralDetailView {
  const patientName = r.patient
    ? `${r.patient.first_name} ${r.patient.last_name}`
    : 'Unknown Patient'

  const creatorName = r.creator
    ? `${r.creator.first_name} ${r.creator.last_name}`
    : 'Unknown'

  const timeline = [
    {
      id: 'created',
      action: 'created',
      description: 'Referral created',
      timestamp: r.created_at,
      user: creatorName,
    },
  ]

  if (r.status !== 'draft') {
    timeline.push({
      id: 'status',
      action: r.status === 'submitted' ? 'submitted' : r.status,
      description: `Status: ${r.status.replace('_', ' ')}`,
      timestamp: r.updated_at,
      user: creatorName,
    })
  }

  return {
    id: `REF-${String(r.id).padStart(3, '0')}`,
    patientId: String(r.patient_id),
    patient: patientName,
    condition: r.reason_for_referral,
    priority: r.priority === 'emergency' ? 'high' : r.priority,
    status: mapStatus(r.status),
    receivingFacility: r.to_facility?.name || 'Unknown facility',
    date: r.created_at,
    reason: r.reason_for_referral,
    clinicalNotes: r.clinical_notes,
    referringClinician: {
      name: creatorName,
      department: 'Clinical',
      facility: r.from_facility?.name || 'Referring facility',
    },
    attachments: {
      documents: (r.documents || []).map((doc) => ({
        id: String(doc.id),
        name: doc.file_name,
        size: Math.round(doc.file_size / 1024),
        uploader: creatorName,
        aiStatus: 'pending' as const,
        type: doc.file_type,
      })),
      voiceNotes: (r.voice_notes || []).map((vn) => ({
        id: String(vn.id),
        name: vn.audio_file_name,
        duration: `${Math.floor(vn.duration_seconds / 60)}:${String(vn.duration_seconds % 60).padStart(2, '0')}`,
        uploader: creatorName,
        aiStatus: vn.status === 'transcribed' ? 'completed' as const : 'pending' as const,
        createdAt: vn.created_at,
      })),
    },
    timeline,
    aiAnalysis: r.ai_summary
      ? {
          summary: r.ai_summary,
          key_findings: [],
          risks: [],
          missing_info: [],
          recommendations: [],
          completeness_score: 7,
          urgency_level: r.priority === 'emergency' || r.priority === 'high' ? 'High' : 'Medium',
        }
      : undefined,
  }
}
