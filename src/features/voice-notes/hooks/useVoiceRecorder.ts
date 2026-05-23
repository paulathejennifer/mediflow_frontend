import { useState, useRef, useCallback } from 'react'

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        chunksRef.current = []
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setIsPaused(false)
      setDuration(0)
      setAudioBlob(null)
      setAudioUrl(null)
      setTranscription(null)

      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

    } catch (err) {
      setError('Failed to access microphone')
      console.error('Failed to start recording:', err)
    }
  }, [])

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const transcribeAudio = useCallback(async () => {
    if (!audioBlob) return

    try {
      setIsTranscribing(true)
      setError(null)
      // Simulate API call for transcription
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTranscription('This is a simulated transcription of the recorded audio.')
    } catch (err) {
      setError('Failed to transcribe audio')
      console.error('Failed to transcribe:', err)
    } finally {
      setIsTranscribing(false)
    }
  }, [audioBlob])

  const reset = useCallback(() => {
    setAudioBlob(null)
    setAudioUrl(null)
    setTranscription(null)
    setDuration(0)
    setError(null)
  }, [])

  return {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    audioUrl,
    transcription,
    isTranscribing,
    error,
    formatTime,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    transcribeAudio,
    reset
  }
}
