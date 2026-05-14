'use client'

import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Search, FileText, ImageIcon, File, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ActionDropdown } from '@/components/shared/ui/action-dropdown'

interface Document {
  id: string
  name: string
  size: number
  uploaded_at: string
  mime_type: string
  document_type: 'lab_result' | 'imaging' | 'prescription' | 'referral_letter' | 'consent_form' | 'other'
}

interface DocumentListProps {
  documents?: Document[]
  isLoading?: boolean
  onView?: (doc: Document) => void
  onDownload?: (doc: Document) => void
  onDelete?: (doc: Document) => void
  userRole?: 'super-admin' | 'facility-admin' | 'clinician'
}

const documentTypeColors = {
  lab_result: 'bg-green-500/10 text-green-400',
  imaging: 'bg-orange-500/10 text-orange-400',
  prescription: 'bg-blue-500/10 text-blue-400',
  referral_letter: 'bg-red-500/10 text-red-400',
  consent_form: 'bg-teal-500/10 text-teal-400',
  other: 'bg-gray-500/10 text-gray-400',
}

export function DocumentList({
  documents = [],
  isLoading = false,
  onView,
  onDownload,
  onDelete,
  userRole = 'facility-admin',
}: DocumentListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.id.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesType = typeFilter === 'all' || doc.document_type === typeFilter
      
      return matchesSearch && matchesType
    })
  }, [documents, searchQuery, typeFilter])

  const getFileIcon = (mime_type: string) => {
    if (mime_type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-muted-foreground" />
    } else if (mime_type === 'application/pdf') {
      return <FileText className="h-5 w-5 text-muted-foreground" />
    } else {
      return <File className="h-5 w-5 text-muted-foreground" />
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border rounded-lg bg-gray-900 border-gray-700">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-gray-800 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-800 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-gray-800 animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6">
      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Search Input */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-gray-900 border-gray-700"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] h-10 bg-gray-900 border-gray-700 text-foreground">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-foreground">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="lab_result">Lab Results</SelectItem>
              <SelectItem value="imaging">Imaging</SelectItem>
              <SelectItem value="prescription">Prescriptions</SelectItem>
              <SelectItem value="referral_letter">Referral Letters</SelectItem>
              <SelectItem value="consent_form">Consent Forms</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <Card className="border rounded-lg bg-gray-900 border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <FileText className="h-12 w-12 text-muted-foreground/50" />
            <div className="text-center">
              <h3 className="text-lg font-medium mt-4 text-foreground">No documents found</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || typeFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Upload documents to get started'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Documents Grid */}
      {filteredDocuments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <Card
              key={doc.id}
              className="border rounded-lg bg-gray-900 border-gray-700 group hover:shadow-md transition-shadow cursor-default"
            >
              <CardContent className="p-5 flex items-start gap-4">
                {/* File Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 p-2.5 shrink-0">
                  {getFileIcon(doc.mime_type)}
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 min-w-0">
                  {/* Header Line */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                      <p className="text-sm font-medium truncate text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(doc.size)} • {format(new Date(doc.uploaded_at), 'MMM d, yyyy')}
                      </p>
                    </div>

                    {/* Actions Dropdown */}
                    <ActionDropdown
                      type="referral"
                      userRole={userRole}
                      onViewDetails={() => onView?.(doc)}
                    />
                  </div>

                  {/* Type Badge */}
                  <Badge
                    variant="secondary"
                    className={`mt-3 px-2 py-0.5 text-xs font-medium rounded hover:bg-transparent ${
                      documentTypeColors[doc.document_type]
                    }`}
                  >
                    {doc.document_type.replace('_', ' ')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
