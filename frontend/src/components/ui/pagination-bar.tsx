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
    <div className="flex items-center justify-between px-6 py-4 border-t border-border">
      <p className="text-xs text-muted-foreground">
        {startItem}–{endItem} de {totalElements}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          className="p-1.5 rounded-lg hover:bg-muted/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>
        {getPageNumbers().map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[32px] h-8 rounded-lg text-xs font-medium transition-colors ${
              p === page
                ? 'bg-foreground text-background'
                : 'text-muted-foreground hover:bg-muted/30'
            }`}
          >
            {p + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages - 1}
          className="p-1.5 rounded-lg hover:bg-muted/30 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}