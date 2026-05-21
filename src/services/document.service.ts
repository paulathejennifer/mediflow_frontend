import apiClient from '@/lib/axios'
import { Document, UploadDocumentRequest } from '@/types/document'

export const documentService = {
  uploadDocument: async (data: UploadDocumentRequest): Promise<Document> => {
    const formData = new FormData()
    formData.append('file', data.file)
    formData.append('referral_id', data.referral_id.toString())
    if (data.document_type) {
      formData.append('document_type', data.document_type)
    }

    const response = await apiClient.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  getDocumentsByReferral: async (referralId: number): Promise<Document[]> => {
    const response = await apiClient.get(`/documents/referral/${referralId}`)
    return response.data
  },

  getDocumentById: async (documentId: number): Promise<Document> => {
    const response = await apiClient.get(`/documents/${documentId}`)
    return response.data
  },

  extractTextFromDocument: async (documentId: number): Promise<Document> => {
    const response = await apiClient.post(`/documents/${documentId}/extract`)
    return response.data
  },
}
