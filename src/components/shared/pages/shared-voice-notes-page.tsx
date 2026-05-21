'use client'

import { Mic, List } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { VoiceRecorder } from '@/components/voice-notes/voice-recorder'
import { VoiceNoteList } from '@/components/voice-notes/voice-note-list'

export function SharedVoiceNotesPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Voice Notes
        </h1>
        <p className="text-sm text-muted-foreground">
          Record and transcribe clinical notes using AI
        </p>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="record" className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-gray-800 p-1 text-muted-foreground">
          <TabsTrigger
            value="record"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            <Mic className="h-4 w-4" />
            Record
          </TabsTrigger>
          <TabsTrigger
            value="library"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            <List className="h-4 w-4" />
            Library
          </TabsTrigger>
        </TabsList>

        {/* Record Tab */}
        <TabsContent value="record" className="mt-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <VoiceRecorder />
            
            {/* Tips Box */}
            <Card className="border rounded-lg bg-gray-900">
              <CardContent className="p-4 space-y-2">
                <h3 className="text-sm font-medium mb-2 text-foreground">Tips for better transcription</h3>
                <ul className="flex flex-col space-y-1 text-sm text-muted-foreground">
                  <li>• Speak clearly and at a moderate pace</li>
                  <li>• Minimize background noise when recording</li>
                  <li>• State patient information at the beginning</li>
                  <li>• Use standard medical terminology</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Library Tab */}
        <TabsContent value="library" className="mt-6">
          <VoiceNoteList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
