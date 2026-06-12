import apiClient from '@/lib/axios'
import { VoiceNote, UploadVoiceNoteRequest } from '@/types/voice-note'

export interface VoiceNoteSummary {
  id: number
  audio_file_name: string
  duration_seconds: number
  status: string
  created_at: string
  uploader_name: string
}

export const voiceNoteService = {
  uploadVoiceNote: async (data: UploadVoiceNoteRequest): Promise<VoiceNote> => {
    const formData = new FormData()
    formData.append('file', data.audio_file)

    const response = await apiClient.post(
      `/voice-notes/upload?referral_id=${data.referral_id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  getFacilityVoiceNotes: async (): Promise<VoiceNoteSummary[]> => {
    const response = await apiClient.get('/voice-notes/facility')
    return response.data
  },

  getVoiceNotesByReferral: async (referralId: number): Promise<VoiceNote[]> => {
    const response = await apiClient.get(`/voice-notes/referral/${referralId}`)
    return response.data
  },

  getVoiceNoteById: async (voiceNoteId: number): Promise<VoiceNote> => {
    const response = await apiClient.get(`/voice-notes/${voiceNoteId}`)
    return response.data
  },

  transcribeVoiceNote: async (voiceNoteId: number): Promise<VoiceNote> => {
    const response = await apiClient.post(`/voice-notes/${voiceNoteId}/transcribe`)
    return response.data
  },

  transcribeRawAudio: async (file: File): Promise<{ transcript: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/voice-notes/transcribe-raw', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }
}
