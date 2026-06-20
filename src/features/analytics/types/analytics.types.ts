// src/features/super-admin/types/analytics.types.ts

export interface AskAIQueryRequest {
  user_question: string;
}

export interface AskAIQueryResponse {
  generated_sql: string;
  raw_data: Record<string, any>[];
  conversational_summary: string;
}

export interface ReferralIntelligenceResponse {
  extracted_reason: string;
  specialty: string;
  urgency_score: 'High' | 'Medium' | 'Low';
  keywords: string[];
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    generatedSql?: string;
    rawData?: Record<string, any>[];
  };
}