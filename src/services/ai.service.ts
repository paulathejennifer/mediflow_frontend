import apiClient from '@/lib/axios'
import { AISummaryResponse, AIStatusResponse } from '@/types/ai'

export const aiService = {
  generateReferralSummary: async (referralId: number): Promise<AISummaryResponse> => {
    const response = await apiClient.post(`/ai/referral/${referralId}/summarize`)
    return response.data
  },

  getAIStatus: async (): Promise<AIStatusResponse> => {
    const response = await apiClient.get('/ai/status')
    return response.data
  },

  testSummary: async (text: string): Promise<AISummaryResponse> => {
    const response = await apiClient.post('/ai/test-summary', { text })
    return response.data
  },

  testTranscription: async (audioFile: File): Promise<{ transcript: string }> => {
    const formData = new FormData()
    formData.append('audio_file', audioFile)
    const response = await apiClient.post('/ai/test-transcription', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  testDocumentExtraction: async (file: File): Promise<{ extracted_text: string }> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/ai/test-document-extraction', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  healthCheck: async (): Promise<{ status: string }> => {
    const response = await apiClient.get('/ai/health')
    return response.data
  },
}
