import apiClient from '@/lib/axios'
import { AIProcessingStatus } from '@/types/ai'

export interface ReferralSummary {
  id: number
  patient_name: string
  from_facility_name: string
  to_facility_name: string
  status: string
  priority: string
  reason_for_referral?: string
  created_at: string
}

export interface Referral {
  id: number
  patient_id: number
  from_facility_id: number
  to_facility_id: number
  created_by: number
  priority: 'low' | 'medium' | 'high' | 'emergency'
  status: 'draft' | 'submitted' | 'accepted' | 'in_transit' | 'received' | 'completed' | 'rejected'
  reason_for_referral: string
  clinical_notes: string
  ai_summary: string | null
  ai_status: AIProcessingStatus
  notes: string | null
  created_at: string
  updated_at: string
  patient?: {
    id: number
    first_name: string
    last_name: string
    date_of_birth: string
    gender: string
  }
  from_facility?: {
    id: number
    name: string
    facility_code: string
  }
  to_facility?: {
    id: number
    name: string
    facility_code: string
  }
  creator?: {
    id: number
    first_name: string
    last_name: string
  }
  documents?: ReferralDocument[]
  voice_notes?: VoiceNote[]
}

export interface ReferralDocument {
  id: number
  file_name: string
  file_type: string
  file_size: number
  referral_id: number
  created_at: string
}

export interface VoiceNote {
  id: number
  audio_file_name: string
  duration_seconds: number
  transcript: string
  status: string
  referral_id: number
  created_at: string
}

export interface CreateReferralRequest {
  patient_id: number
  to_facility_id: number
  priority: 'low' | 'medium' | 'high' | 'emergency'
  reason_for_referral: string
  clinical_notes: string
}

export interface UpdateReferralRequest {
  priority?: 'low' | 'medium' | 'high' | 'emergency'
  clinical_notes?: string
  notes?: string
}

export const referralService = {
  createReferral: async (data: CreateReferralRequest): Promise<Referral> => {
    const response = await apiClient.post('referrals/', data)
    return response.data
  },

  getReferrals: async (params?: {
    skip?: number
    limit?: number
    status?: string
    priority?: string
    patient_id?: number
  }): Promise<ReferralSummary[]> => {
    const response = await apiClient.get('referrals/', { params })
    return response.data
  },

  getReferralById: async (referralId: number): Promise<Referral> => {
    const response = await apiClient.get(`referrals/${referralId}/`)
    return response.data
  },

  updateReferral: async (
    referralId: number,
    data: UpdateReferralRequest
  ): Promise<Referral> => {
    const response = await apiClient.put(`referrals/${referralId}/`, data)
    return response.data
  },

  submitReferral: async (referralId: number): Promise<{ message: string }> => {
    const response = await apiClient.post(`referrals/${referralId}/submit/`)
    return response.data
  },

  acceptReferral: async (referralId: number): Promise<Referral> => {
    const response = await apiClient.post(`referrals/${referralId}/accept/`)
    return response.data
  },

  rejectReferral: async (referralId: number): Promise<Referral> => {
    const response = await apiClient.post(`referrals/${referralId}/reject/`)
    return response.data
  },

  completeReferral: async (referralId: number): Promise<Referral> => {
    const response = await apiClient.post(`referrals/${referralId}/complete/`)
    return response.data
  },

  refreshAISummary: async (referralId: number): Promise<any> => {
    const response = await apiClient.post(`ai/referral/${referralId}/summarize`)
    return response.data
  }
}
