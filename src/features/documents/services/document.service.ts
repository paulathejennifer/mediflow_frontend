import apiClient from '@/lib/axios'
import { Document, UploadDocumentRequest } from '@/types/document'

export interface DocumentSummary {
  id: number
  file_name: string
  file_type: string
  file_size: number
  created_at: string
  uploader_name: string
}

export const documentService = {
  uploadDocument: async (data: UploadDocumentRequest): Promise<Document> => {
    const formData = new FormData()
    formData.append('file', data.file)

    const fileType = data.document_type || 'lab_report'
    const response = await apiClient.post(
      `/documents/upload?referral_id=${data.referral_id}&file_type=${fileType}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  getFacilityDocuments: async (): Promise<DocumentSummary[]> => {
    const response = await apiClient.get('/documents/facility')
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

  // Updated for S3 presigned URLs
  getDocumentPreviewUrl: (documentId: number): string => {
    return `/api/documents/${documentId}/view`
  },

  getDocumentDownloadUrl: (documentId: number): string => {
    return `/api/documents/${documentId}/download`
  },
  
  extractTextFromDocument: async (documentId: number): Promise<Document> => {
    const response = await apiClient.post(`/documents/${documentId}/extract`)
    return response.data
  },
}