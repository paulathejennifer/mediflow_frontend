import { useState, useEffect, useCallback } from 'react'
import { referralService } from '@/features/referrals/services/referral.service'
import { voiceNoteService } from '@/features/voice-notes/services/voice-note.service'
import { documentService } from '@/features/documents/services/document.service'
import { AIProcessingStatus } from '@/types/ai'

interface UseAIStatusOptions {
  pollInterval?: number
  maxAttempts?: number
  onSuccess?: () => void
  onError?: () => void
}

export function useReferralAIStatus(
  referralId: number | null,
  options: UseAIStatusOptions = {}
) {
  const { pollInterval = 2000, maxAttempts = 15, onSuccess, onError } = options
  const [aiStatus, setAiStatus] = useState<AIProcessingStatus>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const pollAIStatus = useCallback(async () => {
    if (!referralId || attempts >= maxAttempts) {
      setIsPolling(false)
      if (attempts >= maxAttempts && aiStatus === 'processing') {
        onError?.()
      }
      return
    }

    try {
      const referral = await referralService.getReferralById(referralId)
      setAiStatus(referral.ai_status as AIProcessingStatus)

      if (referral.ai_status === 'completed') {
        setIsPolling(false)
        onSuccess?.()
      } else if (referral.ai_status === 'failed') {
        setIsPolling(false)
        onError?.()
      } else if (referral.ai_status === 'processing') {
        setAttempts(prev => prev + 1)
      } else {
        // AI not triggered yet
        setIsPolling(false)
      }
    } catch (error) {
      console.error('Error polling AI status:', error)
      setIsPolling(false)
      onError?.()
    }
  }, [referralId, attempts, maxAttempts, aiStatus, onSuccess, onError])

  useEffect(() => {
    if (isPolling && referralId) {
      const interval = setInterval(pollAIStatus, pollInterval)
      return () => clearInterval(interval)
    }
  }, [isPolling, pollAIStatus, referralId, pollInterval])

  const startPolling = useCallback(() => {
    setAttempts(0)
    setIsPolling(true)
  }, [])

  const stopPolling = useCallback(() => {
    setIsPolling(false)
  }, [])

  return {
    aiStatus,
    isPolling,
    startPolling,
    stopPolling,
  }
}

export function useVoiceNoteAIStatus(
  voiceNoteId: number | null,
  options: UseAIStatusOptions = {}
) {
  const { pollInterval = 2000, maxAttempts = 15, onSuccess, onError } = options
  const [status, setStatus] = useState<'uploaded' | 'processing' | 'transcribed' | 'failed'>('uploaded')
  const [isPolling, setIsPolling] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const pollStatus = useCallback(async () => {
    if (!voiceNoteId || attempts >= maxAttempts) {
      setIsPolling(false)
      if (attempts >= maxAttempts && status === 'processing') {
        onError?.()
      }
      return
    }

    try {
      const voiceNotes = await voiceNoteService.getVoiceNotesByReferral(voiceNoteId)
      const voiceNote = voiceNotes.find(vn => vn.id === voiceNoteId)
      
      if (voiceNote) {
        setStatus(voiceNote.status as any)

        if (voiceNote.status === 'transcribed') {
          setIsPolling(false)
          onSuccess?.()
        } else if (voiceNote.status === 'failed') {
          setIsPolling(false)
          onError?.()
        } else if (voiceNote.status === 'processing') {
          setAttempts(prev => prev + 1)
        }
      }
    } catch (error) {
      console.error('Error polling voice note status:', error)
      setIsPolling(false)
      onError?.()
    }
  }, [voiceNoteId, attempts, maxAttempts, status, onSuccess, onError])

  useEffect(() => {
    if (isPolling && voiceNoteId) {
      const interval = setInterval(pollStatus, pollInterval)
      return () => clearInterval(interval)
    }
  }, [isPolling, pollStatus, voiceNoteId, pollInterval])

  const startPolling = useCallback(() => {
    setAttempts(0)
    setIsPolling(true)
  }, [])

  const stopPolling = useCallback(() => {
    setIsPolling(false)
  }, [])

  return {
    status,
    isPolling,
    startPolling,
    stopPolling,
  }
}

export function useDocumentAIStatus(
  referralId: number | null,
  options: UseAIStatusOptions = {}
) {
  const { pollInterval = 2000, maxAttempts = 15, onSuccess, onError } = options
  const [isProcessed, setIsProcessed] = useState(false)
  const [isPolling, setIsPolling] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const pollStatus = useCallback(async () => {
    if (!referralId || attempts >= maxAttempts) {
      setIsPolling(false)
      if (attempts >= maxAttempts && !isProcessed) {
        onError?.()
      }
      return
    }

    try {
      const documents = await documentService.getDocumentsByReferral(referralId)
      const allProcessed = documents.every(doc => doc.ai_processed)
      
      setIsProcessed(allProcessed)

      if (allProcessed) {
        setIsPolling(false)
        onSuccess?.()
      } else {
        setAttempts(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error polling document status:', error)
      setIsPolling(false)
      onError?.()
    }
  }, [referralId, attempts, maxAttempts, isProcessed, onSuccess, onError])

  useEffect(() => {
    if (isPolling && referralId) {
      const interval = setInterval(pollStatus, pollInterval)
      return () => clearInterval(interval)
    }
  }, [isPolling, pollStatus, referralId, pollInterval])

  const startPolling = useCallback(() => {
    setAttempts(0)
    setIsPolling(true)
  }, [])

  const stopPolling = useCallback(() => {
    setIsPolling(false)
  }, [])

  return {
    isProcessed,
    isPolling,
    startPolling,
    stopPolling,
  }
}
