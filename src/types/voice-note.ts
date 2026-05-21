export interface VoiceNote {
  id: number
  audio_file_name: string
  duration_seconds: number
  transcript: string
  processed_transcript?: string
  ai_summary?: string
  status: 'uploaded' | 'processing' | 'transcribed' | 'failed'
  referral_id: number
  created_at: string
}

export interface UploadVoiceNoteRequest {
  audio_file: File
  referral_id: number
}
