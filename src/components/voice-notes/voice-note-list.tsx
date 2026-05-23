'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  Search, 
  Mic, 
  Play, 
  Pause, 
  Clock, 
  User, 
  FileText, 
  Trash2, 
  MoreVertical,
  Loader2
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { voiceNoteService } from '@/features/voice-notes/services/voice-note.service'
import { toast } from '@/lib/toast'

interface VoiceNote {
  id: string
  title: string
  duration: number
  recorded_at: string
  patient_id?: string
  transcription_status: 'pending' | 'processing' | 'completed' | 'failed'
  transcription?: string
}

// Mock data for voice notes
const mockVoiceNotes: VoiceNote[] = [
  {
    id: '1',
    title: 'Voice Note',
    duration: 125,
    recorded_at: '2024-01-15T14:30:00',
    patient_id: 'patient_123',
    transcription_status: 'completed',
    transcription: 'Patient reports experiencing chest pain and shortness of breath for the past two days. Symptoms worsen during physical activity.'
  },
  {
    id: '2',
    title: 'Voice Note',
    duration: 89,
    recorded_at: '2024-01-14T10:15:00',
    transcription_status: 'processing',
  },
  {
    id: '3',
    title: 'Voice Note',
    duration: 210,
    recorded_at: '2024-01-13T16:45:00',
    patient_id: 'patient_456',
    transcription_status: 'completed',
    transcription: 'Follow-up appointment for hypertension management. Patient reports good adherence to medication regimen.'
  },
]

export function VoiceNoteList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [notes, setNotes] = useState<VoiceNote[]>([])

  const fetchVoiceNotes = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await voiceNoteService.getFacilityVoiceNotes()
      setNotes(
        data.map((vn) => ({
          id: String(vn.id),
          title: vn.audio_file_name,
          duration: vn.duration_seconds,
          recorded_at: vn.created_at,
          transcription_status:
            vn.status === 'transcribed'
              ? 'completed'
              : vn.status === 'processing'
                ? 'processing'
                : 'pending',
        }))
      )
    } catch (error) {
      console.error('Failed to fetch voice notes:', error)
      toast.error('Failed to load voice notes')
      setNotes([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVoiceNotes()
  }, [fetchVoiceNotes])

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      note.transcription?.toLowerCase().includes(query) ||
      note.patient_id?.toLowerCase().includes(query)
    )
  })

  // Format duration as M:SS
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  // Toggle play/pause
  const togglePlay = (noteId: string) => {
    setPlayingId(playingId === noteId ? null : noteId)
  }

  // Delete note
  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId))
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning hover:bg-warning/10'
      case 'processing':
        return 'bg-primary/10 text-primary hover:bg-primary/10'
      case 'completed':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/10'
      case 'failed':
        return 'bg-destructive/10 text-destructive hover:bg-destructive/10'
      default:
        return 'bg-muted text-muted-foreground hover:bg-muted'
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search voice notes..."
          className="pl-9 h-10 border rounded-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-gray-900">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-muted" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/4 rounded bg-muted" />
                  <div className="h-3 w-3/4 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredNotes.length === 0 && (
        <Card className="bg-gray-900">
          <CardContent className="py-12 flex flex-col items-center justify-center space-y-4">
            <Mic className="h-12 w-12 text-muted-foreground/50" />
            <div className="text-center">
              <h3 className="text-lg font-medium mt-4">
                {searchQuery ? 'No voice notes found' : 'No voice notes found'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try adjusting your search' : 'Record voice notes to get started'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Voice Notes List */}
      {!isLoading && filteredNotes.length > 0 && (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <Card 
              key={note.id} 
              className="border rounded-lg bg-gray-930 group transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_12px_30px_-12px_hsl(var(--primary)/0.35)] hover:-translate-y-1"
            >
              <CardContent className="p-4 flex items-start gap-4">
                {/* Play Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full shrink-0 text-foreground"
                      onClick={() => togglePlay(note.id)}
                    >
                      {playingId === note.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{playingId === note.id ? 'Pause' : 'Resume'}</p>
                  </TooltipContent>
                </Tooltip>

                {/* Content Section */}
                <div className="flex flex-col flex-1 min-w-0 space-y-2">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Voice Note</span>
                        <Badge variant="secondary" className={`text-xs px-2 py-0.5 hover:opacity-100 ${getStatusColor(note.transcription_status)}`}>
                          {note.transcription_status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDuration(note.duration)}
                        </div>
                        <span>{formatDate(note.recorded_at)}</span>
                        {note.patient_id && (
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Patient linked
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          View Transcription
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Transcription Preview */}
                  {note.transcription && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {note.transcription}
                    </p>
                  )}

                  {/* Transcription Processing State */}
                  {note.transcription_status === 'processing' && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Transcribing...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
    </TooltipProvider>
  )
}
