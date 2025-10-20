"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const pages = []

    // Always show first 3 pages
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
      pages.push(i)
    }

    // Add current page if it's not in the first 3
    if (currentPage > 3 && currentPage <= totalPages) {
      pages.push(currentPage)
    }

    return pages
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 p-0 border-pink-200 text-pink-500 hover:bg-pink-50"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Page numbers */}
      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 p-0 ${
            currentPage === page
              ? "bg-pink-500 hover:bg-pink-600 text-white border-pink-500"
              : "border-gray-200 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {page}
        </Button>
      ))}

      {/* Dots if there are more pages */}
      {totalPages > 4 && <span className="px-2 text-gray-400">.....</span>}

      {/* Last page number */}
      {totalPages > 4 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          className="w-12 h-10 p-0 border-gray-200 text-gray-700 hover:bg-gray-50"
        >
          {totalPages}
        </Button>
      )}

      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 p-0 border-pink-200 text-pink-500 hover:bg-pink-50"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
