export interface Document {
  id: number
  file_name: string
  file_type: string
  file_size: number
  referral_id: number
  extracted_text?: string
  ai_processed?: boolean
  ai_summary?: string
  created_at: string
}

export interface UploadDocumentRequest {
  file: File
  referral_id: number
  document_type?: string
}
