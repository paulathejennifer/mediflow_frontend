'use client'

import { useState, useMemo } from 'react'

interface UsePaginationProps {
  totalItems: number
  initialItemsPerPage?: number
  initialPage?: number
}

interface UsePaginationReturn {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  paginatedItems: <T>(items: T[]) => T[]
  setCurrentPage: (page: number) => void
  setItemsPerPage: (itemsPerPage: number) => void
  resetPagination: () => void
  startIndex: number
  endIndex: number
}

export function usePagination({
  totalItems,
  initialItemsPerPage = 10,
  initialPage = 1
}: UsePaginationProps): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)

  const totalPages = useMemo(() => {
    return Math.ceil(totalItems / itemsPerPage) || 1
  }, [totalItems, itemsPerPage])

  const startIndex = useMemo(() => {
    return (currentPage - 1) * itemsPerPage
  }, [currentPage, itemsPerPage])

  const endIndex = useMemo(() => {
    return Math.min(startIndex + itemsPerPage, totalItems)
  }, [startIndex, itemsPerPage, totalItems])

  const paginatedItems = useMemo(() => {
    return <T>(items: T[]): T[] => {
      return items.slice(startIndex, endIndex)
    }
  }, [startIndex, endIndex])

  const resetPagination = () => {
    setCurrentPage(1)
    setItemsPerPage(initialItemsPerPage)
  }

  // Reset to page 1 if current page exceeds total pages (e.g., after filtering)
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1)
  }

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedItems,
    setCurrentPage,
    setItemsPerPage,
    resetPagination,
    startIndex,
    endIndex
  }
}
