import React from 'react';
import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
  pageRoute?: string; // e.g. "/products?page="
}

export function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange, pageRoute }: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  if (pageRoute) {
    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <Link
          href={currentPage > 1 ? `${pageRoute}${currentPage - 1}` : '#'}
          className={`px-4 py-2 border border-stone-200 rounded-lg text-sm font-bold ${currentPage === 1 ? 'text-stone-400 cursor-not-allowed pointer-events-none opacity-50' : 'text-stone-600 hover:bg-stone-50'} transition-all`}
        >
          Previous
        </Link>
        
        <div className="flex gap-1">
          {pages.map(page => (
            <Link
              key={page}
              href={`${pageRoute}${page}`}
              className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold transition-all ${
                currentPage === page 
                  ? 'bg-orange-600 text-white shadow-md' 
                  : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {page}
            </Link>
          ))}
        </div>

        <Link
          href={currentPage < totalPages ? `${pageRoute}${currentPage + 1}` : '#'}
          className={`px-4 py-2 border border-stone-200 rounded-lg text-sm font-bold ${currentPage === totalPages ? 'text-stone-400 cursor-not-allowed pointer-events-none opacity-50' : 'text-stone-600 hover:bg-stone-50'} transition-all`}
        >
          Next
        </Link>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Previous
      </button>
      
      <div className="flex gap-1">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange?.(page)}
            className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
              currentPage === page 
                ? 'bg-orange-600 text-white shadow-md' 
                : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        Next
      </button>
    </div>
  );
}