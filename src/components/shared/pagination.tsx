'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  className?: string
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  className = ''
}: PaginationProps) {
  const [itemsPerPageOptions] = useState([5, 10, 20, 50, 100])

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const handleItemsPerPageChange = (newItemsPerPage: string) => {
    const items = parseInt(newItemsPerPage)
    onItemsPerPageChange(items)
    // Reset to first page when changing items per page
    onPageChange(1)
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-900/60 backdrop-blur-md border border-border rounded-lg ${className}`}>
      {/* Page Info and Items Per Page */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Page Info */}
        <div className="text-sm text-muted-foreground">
          Showing {startItem}-{endItem} of {totalItems} items
        </div>
        
        {/* Items Per Page */}
        <div className="flex items-center gap-2">
          <label htmlFor="items-per-page" className="text-sm text-muted-foreground">
            Items per page:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(e.target.value)}
            className="px-2 py-1 text-sm bg-gray-800 text-gray-300 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {itemsPerPageOptions.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-4">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="h-8 px-3 text-xs bg-gray-800/50 border-gray-700 text-muted-foreground hover:bg-gray-700 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-3 w-3 mr-1" />
          Previous
        </Button>

        {/* Page Info */}
        <div className="text-sm text-foreground font-medium">
          Page {currentPage} of {totalPages}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="h-8 px-3 text-xs bg-gray-800/50 border-gray-700 text-muted-foreground hover:bg-gray-700 hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  )
}
