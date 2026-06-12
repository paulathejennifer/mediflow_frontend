'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Mic, Pause, Play, Square, Trash2, Save, Loader2 } from 'lucide-react'
import { useVoiceRecorder } from '@/features/voice-notes/hooks/useVoiceRecorder'
import { voiceNoteService } from '@/features/voice-notes/services/voice-note.service'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

interface VoiceRecorderProps {
  onRecordingComplete?: (file: File) => void
  isStandalone?: boolean
  referralIdOverride?: number | null
}

export function VoiceRecorder({ onRecordingComplete, isStandalone = false, referralIdOverride }: VoiceRecorderProps) {
  const params = useParams()
  const referralId = referralIdOverride || (params?.id ? Number(params.id) : null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [editedTranscription, setEditedTranscription] = useState<string>('')
  const [isEditingTranscription, setIsEditingTranscription] = useState(false)
  
  const {
    isRecording,
    isPaused,
    duration,
    audioBlob,
    audioUrl,
    transcription,
    error,
    formatTime,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    reset
  } = useVoiceRecorder()

  // Save and transcribe
  const saveAndTranscribe = async () => {
    console.log('Attempting save and transcribe. ReferralId:', referralId, 'AudioBlob:', !!audioBlob)
    
    if (!audioBlob) {
      toast.error('Please record audio first')
      return
    }

    if (!audioBlob || (!referralId && !onRecordingComplete)) {
      toast.error('Cannot save: Referral ID not found. Please save the referral first.')
      return
    }

    setIsProcessing(true)
    try {
      const audioFile = new File([audioBlob], `recording_${Date.now()}.webm`, { type: 'audio/webm' })

      // If in creation flow, use the raw transcription preview endpoint
      if (onRecordingComplete) {
        const result = await voiceNoteService.transcribeRawAudio(audioFile)
        if (result.transcript) {
          setEditedTranscription(result.transcript)
          setIsEditingTranscription(true)
          toast.success('Transcription complete - Please review')
        }
        return
      }

      // 1. Upload the voice note
      const voiceNote = await voiceNoteService.uploadVoiceNote({
        referral_id: referralId,
        audio_file: new File([audioBlob], 'recording.webm', { type: 'audio/webm' })
      })

      // 2. Trigger real transcription
      const result = await voiceNoteService.transcribeVoiceNote(voiceNote.id)
      
      if (result.transcript) {
        setEditedTranscription(result.transcript)
        setIsEditingTranscription(true)
        toast.success('Transcription complete')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to process audio')
    } finally {
      setIsProcessing(false)
    }
  }

  // Discard recording
  const discardRecording = () => {
    reset()
  }

  // Confirm transcription
  const confirmTranscription = () => {
    if (onRecordingComplete && audioBlob) {
       const file = new File([audioBlob], `recording_${Date.now()}.webm`, { type: 'audio/webm' })
       // Pass both the file and the finalized transcript
       onRecordingComplete(file)
       toast.success('Approved recording attached')
    }
    setIsEditingTranscription(false)
  }

  // Cancel transcription edit
  const cancelTranscriptionEdit = () => {
    setEditedTranscription(transcription || '')
    setIsEditingTranscription(false)
  }

  return (
    <TooltipProvider>
      <Card className="border rounded-lg bg-gray-900">
        <CardContent className="p-6 flex flex-col items-center gap-6">
        {/* Recording Indicator Circle */}
        <div className="relative h-24 w-24">
          <div className={`h-24 w-24 rounded-full flex items-center justify-center transition-all ${
            isRecording && !isPaused 
              ? 'bg-destructive/10 animate-pulse' 
              : 'bg-muted'
          }`}>
            <Mic className={`h-10 w-10 transition-colors ${
              isRecording && !isPaused ? 'text-destructive' : 'text-muted-foreground'
            }`} />
          </div>
          
          {/* Recording indicator dot */}
          {isRecording && !isPaused && (
            <div className="absolute -top-1 -right-1 h-4 w-4">
              <div className="h-full w-full rounded-full bg-destructive opacity-75 animate-ping" />
              <div className="relative h-4 w-4 rounded-full bg-destructive" />
            </div>
          )}
        </div>

        {/* Timer Display */}
        <div className="text-3xl font-mono font-semibold tabular-nums text-foreground">
          {formatTime(duration)}
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          {!isRecording && !audioBlob && (
            <Button size="lg" className="gap-2 bg-primary/90 hover:bg-primary/80" onClick={startRecording}>
              <Mic className="h-5 w-5" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 text-foreground"
                    onClick={isPaused ? resumeRecording : pauseRecording}
                  >
                    {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
                    <span className="sr-only">{isPaused ? 'Resume' : 'Pause'}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{isPaused ? 'Resume' : 'Pause'}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-12 w-12"
                    onClick={stopRecording}
                  >
                    <Square className="h-5 w-5" />
                    <span className="sr-only">Stop</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Stop</p>
                </TooltipContent>
              </Tooltip>
            </>
          )}

          {audioBlob && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-12 w-12 text-foreground"
                    onClick={discardRecording}
                  >
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Discard</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Discard</p>
                </TooltipContent>
              </Tooltip>
              
              <Button 
                size="lg" 
                className="gap-2 bg-primary/90 hover:bg-primary/80"
                disabled={isProcessing}
                onClick={saveAndTranscribe}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Transcribing...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5" />
                    Save & Transcribe
                  </>
                )}
              </Button>
            </>
          )}
        </div>

        {/* Audio Preview */}
        {audioUrl && (
          <audio 
            controls 
            src={audioUrl} 
            className="w-full max-w-md"
          />
        )}

        {/* Transcription Display */}
        {(transcription || editedTranscription) && (
          <div className="w-full max-w-lg border rounded-lg bg-gray-900 p-4 space-y-4 transition-all duration-300 border-primary/40 shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)] hover:-translate-y-1">
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Transcription
            </label>
            {isEditingTranscription ? (
              <textarea
                value={editedTranscription}
                onChange={(e) => setEditedTranscription(e.target.value)}
                className="w-full min-h-[120px] p-3 bg-transparent border-none text-sm text-foreground focus:outline-none resize-y"
                placeholder="Edit transcription..."
              />
            ) : (
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {editedTranscription || transcription}
              </p>
            )}
            {isEditingTranscription && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-primary/90 hover:bg-primary/80"
                  onClick={confirmTranscription}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-foreground"
                  onClick={cancelTranscriptionEdit}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
    </TooltipProvider>
  )
}
