"use client"
import React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-black px-3 text-xs font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-black disabled:hover:text-white"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
      </button>
      
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-2 py-2 text-white/35">...</span>
            ) : (
              <button
                onClick={() => onPageChange(page as number)}
                className={`h-10 min-w-10 rounded-xl px-3 text-sm font-black transition-colors ${
                  currentPage === page
                    ? 'bg-white text-black'
                    : 'bg-black text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-black px-3 text-xs font-black uppercase tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-black disabled:hover:text-white"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  )
}

export default Pagination
