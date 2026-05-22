'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, FileText, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { DocumentUpload } from '@/components/documents/document-upload'
import { DocumentList } from '@/components/documents/document-list'
import { DocumentViewerModal } from '@/components/documents/document-viewer-modal'
import { documentService } from '@/services/document.service'
import { toast } from '@/lib/toast'

// Fallback mock data when API returns empty (dev only)
const mockDocuments = [
  {
    id: '1',
    name: 'Blood Test Results - John Doe.pdf',
    size: 245760,
    uploaded_at: '2024-01-15T10:30:00Z',
    mime_type: 'application/pdf',
    document_type: 'lab_result' as const,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: '2',
    name: 'MRI Scan - Knee Joint.jpg',
    size: 1048576,
    uploaded_at: '2024-01-14T14:20:00Z',
    mime_type: 'image/jpeg',
    document_type: 'imaging' as const,
    url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
  },
  {
    id: '3',
    name: 'Prescription - Amoxicillin.pdf',
    size: 81920,
    uploaded_at: '2024-01-13T09:15:00Z',
    mime_type: 'application/pdf',
    document_type: 'prescription' as const,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: '4',
    name: 'Referral Letter - Cardiology.pdf',
    size: 163840,
    uploaded_at: '2024-01-12T16:45:00Z',
    mime_type: 'application/pdf',
    document_type: 'referral_letter' as const,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: '5',
    name: 'Consent Form - Surgery.pdf',
    size: 122880,
    uploaded_at: '2024-01-11T11:00:00Z',
    mime_type: 'application/pdf',
    document_type: 'consent_form' as const,
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    id: '6',
    name: 'X-Ray - Chest PA.jpg',
    size: 786432,
    uploaded_at: '2024-01-10T13:30:00Z',
    mime_type: 'image/jpeg',
    document_type: 'imaging' as const,
    url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800',
  },
]

export function SharedDocumentsPage() {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [documents, setDocuments] = useState<typeof mockDocuments>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState<any>(null)
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await documentService.getFacilityDocuments()
      setDocuments(
        data.map((doc) => ({
          id: String(doc.id),
          name: doc.file_name,
          size: doc.file_size,
          uploaded_at: doc.created_at,
          mime_type: doc.file_type.includes('image') ? 'image/jpeg' : 'application/pdf',
          document_type: doc.file_type as typeof mockDocuments[0]['document_type'],
          url: '',
        }))
      )
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      toast.error('Failed to load documents')
      setDocuments([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const handleView = (doc: any) => {
    setSelectedDocument(doc)
    setIsViewerOpen(true)
  }

  const handleDownload = (doc: any) => {
    // Implement download functionality
    alert(`Downloading: ${doc.name}`)
  }

  const handleDelete = (doc: any) => {
    setDocuments(prev => prev.filter(d => d.id !== doc.id))
    // Implement delete functionality
  }

  const handleUploadComplete = () => {
    toast.info('Upload documents from a referral (Create Referral or Referral Details).')
    setIsUploadDialogOpen(false)
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

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewerModal
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false)
            setSelectedDocument(null)
          }}
          doc={selectedDocument}
        />
      )}
    </div>
  )
}
