'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { VoiceRecorder } from '@/components/voice-notes/voice-recorder'
import { VoiceNoteList } from '@/components/voice-notes/voice-note-list'

export function SharedVoiceNotesPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-0">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Voice Notes
        </h1>
        <p className="text-sm text-muted-foreground">
          Record and transcribe clinical notes using AI
        </p>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="record" className="w-full">
        <TabsList className="bg-black p-1 rounded-lg gap-1">
          <TabsTrigger 
            value="record" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-gray-800 data-[state=active]:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            Record
          </TabsTrigger>
          <TabsTrigger 
            value="library" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md data-[state=active]:bg-gray-800 data-[state=active]:text-white"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            Library
          </TabsTrigger>
        </TabsList>

        {/* Record Tab */}
        <TabsContent value="record" className="mt-4">
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
        <TabsContent value="library" className="mt-4">
          <VoiceNoteList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
