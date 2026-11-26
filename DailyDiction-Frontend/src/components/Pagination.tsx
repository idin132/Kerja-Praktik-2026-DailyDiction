"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

/**
 * Scrollable pagination bar with fixed Previous/Next controls so long page lists
 * never overflow off-screen or become unreachable.
 */
export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "pt-8",
}: PaginationProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const activeButton = activeButtonRef.current;
    if (!container || !activeButton) return;

    const targetLeft =
      activeButton.offsetLeft -
      container.clientWidth / 2 +
      activeButton.clientWidth / 2;

    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: "smooth",
    });
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex w-full items-center justify-center gap-2 font-mono text-xs ${className}`}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-dark-border bg-dark-card text-text-muted transition-all hover:border-[#FFD700] hover:text-[#FFD700] disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Previous Page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <div
        ref={scrollContainerRef}
        className="relative flex min-w-0 items-center gap-2 overflow-x-auto py-1.5 px-1 [scrollbar-width:thin] [scrollbar-color:#262a36_transparent]"
      >
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
          const isActive = currentPage === pageNum;
          return (
            <button
              key={pageNum}
              type="button"
              ref={isActive ? activeButtonRef : null}
              onClick={() => onPageChange(pageNum)}
              aria-current={isActive ? "page" : undefined}
              className={`h-9 min-w-[36px] shrink-0 px-3 rounded-xl font-bold transition-all ${
                isActive
                  ? "bg-[#FFD700] text-black shadow-[0_0_15px_rgba(255,215,0,0.4)]"
                  : "border border-dark-border bg-dark-card text-text-muted hover:border-[#FFD700] hover:text-text-primary"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-dark-border bg-dark-card text-text-muted transition-all hover:border-[#FFD700] hover:text-[#FFD700] disabled:opacity-30 disabled:pointer-events-none"
        aria-label="Next Page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
