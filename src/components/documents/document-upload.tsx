'use client'

import { useState, useCallback } from 'react'
import { Upload, FileText, ImageIcon, File, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface UploadedFile {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'complete' | 'error'
  documentType?: 'lab_result' | 'imaging' | 'prescription' | 'referral_letter' | 'consent_form' | 'other'
}

interface DocumentUploadProps {
  onUploadComplete?: (files: UploadedFile[]) => void
}

export function DocumentUpload({ onUploadComplete }: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragActive, setIsDragActive] = useState(false)
  const [selectedDocumentType, setSelectedDocumentType] = useState<'lab_result' | 'imaging' | 'prescription' | 'referral_letter' | 'consent_form' | 'other'>('other')
  const maxFileSize = 10 * 1024 * 1024 // 10MB

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true)
    } else if (e.type === 'dragleave') {
      setIsDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= maxFileSize
      const isValidType = file.type === 'application/pdf' ||
                         file.type === 'application/msword' ||
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                         file.type.startsWith('image/')
      return isValidSize && isValidType
    })

    const newFiles: UploadedFile[] = validFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: 'uploading',
      documentType: selectedDocumentType
    }))

    setUploadedFiles(prev => [...prev, ...newFiles])

    // Simulate upload progress
    newFiles.forEach(newFile => {
      simulateUpload(newFile.id)
    })
  }

  const simulateUpload = (fileId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setUploadedFiles(prev =>
          prev.map(f => f.id === fileId ? { ...f, progress: 100, status: 'complete' } : f)
        )
      } else {
        setUploadedFiles(prev =>
          prev.map(f => f.id === fileId ? { ...f, progress } : f)
        )
      }
    }, 200)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <ImageIcon className="h-5 w-5 text-muted-foreground" />
    } else if (file.type === 'application/pdf') {
      return <FileText className="h-5 w-5 text-muted-foreground" />
    } else {
      return <File className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="flex flex-col space-y-4">
      {/* Document Type Selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-foreground">Document Type: <span className="text-red-400">*</span></label>
        <Select value={selectedDocumentType} onValueChange={(value: 'lab_result' | 'imaging' | 'prescription' | 'referral_letter' | 'consent_form' | 'other') => setSelectedDocumentType(value)}>
          <SelectTrigger className="w-[200px] h-10 bg-gray-900 border-gray-700 text-foreground">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700 text-foreground">
            <SelectItem value="lab_result">Lab Result</SelectItem>
            <SelectItem value="imaging">Imaging</SelectItem>
            <SelectItem value="prescription">Prescription</SelectItem>
            <SelectItem value="referral_letter">Referral Letter</SelectItem>
            <SelectItem value="consent_form">Consent Form</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          flex flex-col items-center justify-center p-8 rounded-lg border-2 border-dashed cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50 hover:bg-primary/10'
          }
        `}
      >
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,image/*"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 p-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse (max {formatFileSize(maxFileSize)} per file)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports PDF, DOC, DOCX, PNG, JPG
              </p>
            </div>
          </div>
        </label>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="flex flex-col space-y-2">
          {uploadedFiles.map((uploadedFile) => (
            <Card key={uploadedFile.id} className="border rounded-md bg-gray-900 border-gray-700">
              <CardContent className="flex items-center gap-3 p-3">
                {/* File Icon */}
                <div className="flex items-center justify-center p-2 rounded-lg bg-gray-800 shrink-0">
                  {getFileIcon(uploadedFile.file)}
                </div>

                {/* File Info */}
                <div className="flex flex-col flex-1 min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                  {uploadedFile.status === 'uploading' && (
                    <div className="mt-1 h-1 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-200"
                        style={{ width: `${uploadedFile.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeFile(uploadedFile.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </CardContent>
            </Card>
          ))}

          {/* Submit Button */}
          <Button
            className="w-full mt-4 bg-primary/90 hover:bg-primary/80"
            onClick={() => {
              const completedFiles = uploadedFiles.filter(f => f.status === 'complete')
              if (completedFiles.length > 0) {
                onUploadComplete?.(completedFiles)
                setUploadedFiles([])
              }
            }}
            disabled={uploadedFiles.some(f => f.status === 'uploading')}
          >
            {uploadedFiles.some(f => f.status === 'uploading') ? 'Uploading...' : 'Upload Documents'}
          </Button>

          {/* Warning if type not selected */}
          {selectedDocumentType === 'other' && uploadedFiles.length > 0 && (
            <p className="text-xs text-yellow-400 mt-2">
              ⚠️ Please select the correct document type before uploading
            </p>
          )}
        </div>
      )}
    </div>
  )
}



