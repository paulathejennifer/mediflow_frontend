// src/hooks/useAskAI.ts
import { useState } from 'react';
import { analyticsService } from '@/features/analytics/services/analytics.service';
import { ConversationMessage } from '@/features/analytics/types/analytics.types';
import { toast } from 'sonner';

export function useAskAI() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await analyticsService.askQuestion(text);

      const assistantMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.conversational_summary,
        timestamp: new Date(),
        metadata: {
          generatedSql: data.generated_sql,
          rawData: data.raw_data,
        },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      toast.error('Could not process your analytics inquiry at this time.');
      
      const errorMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `Error: ${error.response?.data?.detail || 'Failed to fetch insights from database engine.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => setMessages([]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearConversation,
  };
}