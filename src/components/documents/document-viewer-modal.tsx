'use client'

import { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'

interface DocumentViewerModalProps {
  isOpen: boolean
  onClose: () => void
  doc: {
    id: string
    name: string
    url?: string
    mime_type: string
  }
}

export function DocumentViewerModal({ isOpen, onClose, doc }: DocumentViewerModalProps) {
  const [zoom, setZoom] = useState(100)
  const [isDicomLoaded, setIsDicomLoaded] = useState(false)
  const [cornerstoneLibraries, setCornerstoneLibraries] = useState<any>(null)
  const dicomCanvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Dynamically import cornerstone libraries only on client side
    const loadCornerstone = async () => {
      try {
        const cornerstone = await import('cornerstone-core')
        const cornerstoneWADOImageLoader = await import('cornerstone-wado-image-loader')
        const cornerstoneTools = await import('cornerstone-tools')
        const cornerstoneMath = await import('cornerstone-math')

        // Initialize cornerstone
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone
        cornerstoneTools.external.cornerstone = cornerstone
        cornerstoneTools.external.cornerstoneMath = cornerstoneMath

        // Configure WADO Image Loader
        cornerstoneWADOImageLoader.webWorkerManager.initialize({
          maxWebWorkers: 4,
          startWebWorkersOnDemand: true,
        })

        // Initialize cornerstone tools
        cornerstoneTools.init()

        setCornerstoneLibraries({
          cornerstone,
          cornerstoneWADOImageLoader,
          cornerstoneTools,
          cornerstoneMath,
        })
      } catch (error) {
      }
    }

    loadCornerstone()

    return () => {
      // Cleanup
      if (dicomCanvasRef.current && cornerstoneLibraries) {
        const element = dicomCanvasRef.current.querySelector('canvas')?.parentElement
        if (element) {
          cornerstoneLibraries.cornerstone.disable(element)
        }
      }
    }
  }, [])

  useEffect(() => {
    if (isOpen && doc.mime_type === 'application/dicom' && doc.url && dicomCanvasRef.current) {
      loadDicomImage()
    }
  }, [isOpen, doc])

  const loadDicomImage = async () => {
    if (!dicomCanvasRef.current || !doc.url || !cornerstoneLibraries) return

    const element = dicomCanvasRef.current
    const { cornerstone, cornerstoneTools } = cornerstoneLibraries

    try {
      // Enable the element for cornerstone
      await cornerstone.enable(element)

      // Load and display the DICOM image
      const image = await cornerstone.loadImage(doc.url)
      cornerstone.displayImage(element, image)

      // Enable basic tools
      const ZoomTool = cornerstoneTools.ZoomTool
      const PanTool = cornerstoneTools.PanTool
      const RotateTool = cornerstoneTools.RotateTool

      cornerstoneTools.addTool(ZoomTool)
      cornerstoneTools.addTool(PanTool)
      cornerstoneTools.addTool(RotateTool)

      cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 1 })
      cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 })
      cornerstoneTools.setToolActive('Rotate', { mouseButtonMask: 4 })

      setIsDicomLoaded(true)
    } catch (error) {
      setIsDicomLoaded(false)
    }
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50))
  const handleResetZoom = () => setZoom(100)

  const handleDownload = () => {
    if (doc.url) {
      const link = window.document.createElement('a')
      link.href = doc.url
      link.download = doc.name
      window.document.body.appendChild(link)
      link.click()
      window.document.body.removeChild(link)
    }
  }

  const renderContent = () => {
    if (!doc.url) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>No file URL available</p>
        </div>
      )
    }

    if (doc.mime_type === 'application/dicom') {
      return (
        <div className="flex items-center justify-center h-full overflow-auto">
          <div
            ref={dicomCanvasRef}
            className="w-full h-full bg-black"
            style={{ minHeight: '400px' }}
          />
          {!isDicomLoaded && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <p>Loading DICOM image...</p>
            </div>
          )}
        </div>
      )
    }

    if (doc.mime_type === 'application/pdf') {
      return (
        <iframe
          src={doc.url}
          className="w-full h-full border-0"
          title={doc.name}
        />
      )
    }

    if (doc.mime_type.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center h-full overflow-auto">
          <img
            src={doc.url}
            alt={doc.name}
            className="max-w-full max-h-full object-contain"
            style={{ transform: `scale(${zoom / 100})` }}
          />
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        <p>Unsupported file type: {doc.mime_type}</p>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[80vh] bg-gray-900 border-gray-700 flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-lg font-semibold truncate pr-4">
            {doc.name}
          </DialogTitle>
          <div className="flex items-center gap-2">
            {doc.mime_type === 'application/dicom' && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  className="h-8 w-8 hover:bg-gray-800"
                  title="Zoom (Left Click + Drag)"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  className="h-8 w-8 hover:bg-gray-800"
                  title="Zoom Out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleResetZoom}
                  className="h-8 w-8 hover:bg-gray-800"
                  title="Reset View"
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </>
            )}
            {doc.mime_type.startsWith('image/') && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  className="h-8 w-8 hover:bg-gray-800"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-400 w-12 text-center">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  className="h-8 w-8 hover:bg-gray-800"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleResetZoom}
                  className="h-8 w-8 hover:bg-gray-800"
                >
                  <span className="text-xs">Reset</span>
                </Button>
              </>
            )}
            {doc.url && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDownload}
                className="h-8 w-8 hover:bg-gray-800 hover:text-primary"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 hover:bg-gray-800 hover:text-primary"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex-1 overflow-hidden bg-gray-950 rounded-lg">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}
