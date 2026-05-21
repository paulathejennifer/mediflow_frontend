import apiClient from '@/lib/axios'
import { VoiceNote, UploadVoiceNoteRequest } from '@/types/voice-note'

export const voiceNoteService = {
  uploadVoiceNote: async (data: UploadVoiceNoteRequest): Promise<VoiceNote> => {
    const formData = new FormData()
    formData.append('audio_file', data.audio_file)
    formData.append('referral_id', data.referral_id.toString())

    const response = await apiClient.post('/voice-notes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
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
}
