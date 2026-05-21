export interface AISummaryResponse {
  summary: string
  key_findings: string[]
  risks: string[]
  missing_info: string[]
  recommendations: string[]
  completeness_score: number
  urgency_level: string
}

export interface AIStatusResponse {
  text_ai: {
    provider: string
    model: string
    is_configured: boolean
    capabilities?: string[]
  }
  speech_ai: {
    provider: string
    model: string
    is_configured: boolean
  }
  document_ai: {
    provider: string
    model: string
    is_configured: boolean
    tesseract_available?: boolean
  }
}

export type AIProcessingStatus = 'processing' | 'completed' | 'failed' | null
