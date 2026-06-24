import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationBarProps {
  page: number;
  totalPages: number;
  totalElements: number;
  size: number;
  onPageChange: (page: number) => void;
}

export function PaginationBar({ page, totalPages, totalElements, size, onPageChange }: PaginationBarProps) {
  if (totalPages <= 1) return null;

  const startItem = page * size + 1;
  const endItem = Math.min((page + 1) * size, totalElements);

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(0, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible);
    if (end - start < maxVisible) {
      start = Math.max(0, end - maxVisible);
    }
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-6 border-t border-border gap-4 sm:gap-0">
      <p className="text-xs text-muted-foreground font-medium">
        Mostrando {startItem}–{endItem} de {totalElements}
      </p>
      <div className="inline-flex items-center gap-1.5 p-1 bg-muted/40 backdrop-blur-md rounded-full border border-border/60 shadow-sm">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-background transition-all disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>
        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-full text-sm font-semibold transition-all ${
              p === page
                ? 'bg-foreground text-background shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-background'
            }`}
          >
            {p + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-background transition-all disabled:opacity-30 disabled:pointer-events-none"
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}