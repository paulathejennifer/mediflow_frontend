'use client'

import { useState } from 'react'
import { Plus, FileText, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DocumentUpload } from '@/components/documents/document-upload'
import { DocumentList } from '@/components/documents/document-list'

// Mock data for documents
const mockDocuments = [
  {
    id: '1',
    name: 'Blood Test Results - John Doe.pdf',
    size: 245760,
    uploaded_at: '2024-01-15T10:30:00Z',
    mime_type: 'application/pdf',
    document_type: 'lab_result' as const,
  },
  {
    id: '2',
    name: 'MRI Scan - Knee Joint.jpg',
    size: 1048576,
    uploaded_at: '2024-01-14T14:20:00Z',
    mime_type: 'image/jpeg',
    document_type: 'imaging' as const,
  },
  {
    id: '3',
    name: 'Prescription - Amoxicillin.pdf',
    size: 81920,
    uploaded_at: '2024-01-13T09:15:00Z',
    mime_type: 'application/pdf',
    document_type: 'prescription' as const,
  },
  {
    id: '4',
    name: 'Referral Letter - Cardiology.pdf',
    size: 163840,
    uploaded_at: '2024-01-12T16:45:00Z',
    mime_type: 'application/pdf',
    document_type: 'referral_letter' as const,
  },
  {
    id: '5',
    name: 'Consent Form - Surgery.pdf',
    size: 122880,
    uploaded_at: '2024-01-11T11:00:00Z',
    mime_type: 'application/pdf',
    document_type: 'consent_form' as const,
  },
  {
    id: '6',
    name: 'X-Ray - Chest PA.jpg',
    size: 786432,
    uploaded_at: '2024-01-10T13:30:00Z',
    mime_type: 'image/jpeg',
    document_type: 'imaging' as const,
  },
]

export function SharedDocumentsPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [documents, setDocuments] = useState(mockDocuments)
  const [isLoading, setIsLoading] = useState(false)

  const handleView = (doc: any) => {
    console.log('View document:', doc)
    // Implement view functionality
  }

  const handleDownload = (doc: any) => {
    console.log('Download document:', doc)
    // Implement download functionality
  }

  const handleDelete = (doc: any) => {
    console.log('Delete document:', doc)
    setDocuments(prev => prev.filter(d => d.id !== doc.id))
    // Implement delete functionality
  }

  const handleUploadComplete = (files: File[]) => {
    console.log('Upload complete:', files)
    setIsUploadDialogOpen(false)
    // Implement upload completion logic
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Page Header with Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Documents
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage patient documents, lab results, and medical records
          </p>
        </div>

        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 h-10 bg-primary/90 hover:bg-primary/80">
              <Plus className="h-4 w-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle>Upload Documents</DialogTitle>
              <DialogDescription>
                Upload medical documents, lab results, or imaging files
              </DialogDescription>
            </DialogHeader>
            <DocumentUpload onUploadComplete={handleUploadComplete} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabbled Interface */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-gray-800 p-1 text-muted-foreground">
          <TabsTrigger
            value="all"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            <FileText className="h-4 w-4" />
            All Documents
          </TabsTrigger>
          <TabsTrigger
            value="recent"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md data-[state=active]:bg-gray-700 data-[state=active]:text-white data-[state=active]:shadow-sm"
          >
            <Upload className="h-4 w-4" />
            Recent Uploads
          </TabsTrigger>
        </TabsList>

        {/* All Documents Tab */}
        <TabsContent value="all" className="mt-6">
          <DocumentList
            documents={documents}
            isLoading={isLoading}
            onView={handleView}
            onDownload={handleDownload}
            onDelete={handleDelete}
            userRole="facility-admin"
          />
        </TabsContent>

        {/* Recent Uploads Tab */}
        <TabsContent value="recent" className="mt-6">
          <DocumentList
            documents={documents.slice(0, 3)}
            isLoading={isLoading}
            onView={handleView}
            onDownload={handleDownload}
            onDelete={handleDelete}
            userRole="facility-admin"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
