import type { PaginationMeta } from '../../types/api';

interface ProductPaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

export function ProductPagination({
  pagination,
  onPageChange,
  disabled = false,
}: ProductPaginationProps) {
  if (pagination.last_page <= 1) {
    return null;
  }

  const pages = visiblePages(pagination.current_page, pagination.last_page);

  return (
    <nav
      className='mt-10 flex flex-wrap items-center justify-center gap-2'
      aria-label='Product pagination'
    >
      <PaginationButton
        label='Previous'
        disabled={disabled || pagination.current_page === 1}
        onClick={() => onPageChange(pagination.current_page - 1)}
      />

      {pages.map((page) =>
        typeof page === 'number' ? (
          <button
            key={page}
            type='button'
            onClick={() => onPageChange(page)}
            disabled={disabled}
            aria-current={page === pagination.current_page ? 'page' : undefined}
            className={`h-10 min-w-10 rounded-lg px-3 text-sm font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50 ${
              page === pagination.current_page
                ? 'bg-teal-600 text-white'
                : 'border border-teal-100 bg-white text-teal-800 hover:bg-teal-50'
            }`}
          >
            {page}
          </button>
        ) : (
          <span key={page} className='px-1 text-slate-500' aria-hidden='true'>
            &hellip;
          </span>
        ),
      )}

      <PaginationButton
        label='Next'
        disabled={disabled || pagination.current_page === pagination.last_page}
        onClick={() => onPageChange(pagination.current_page + 1)}
      />
    </nav>
  );
}

function PaginationButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type='button'
      onClick={onClick}
      disabled={disabled}
      className='rounded-lg border border-teal-200 bg-white px-4 py-2.5 text-sm font-bold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50'
    >
      {label}
    </button>
  );
}

function visiblePages(currentPage: number, lastPage: number): PageItem[] {
  if (lastPage <= 7) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  const pages: PageItem[] = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(lastPage - 1, currentPage + 1);

  if (start > 2) {
    pages.push('ellipsis-start');
  }

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  if (end < lastPage - 1) {
    pages.push('ellipsis-end');
  }

  pages.push(lastPage);

  return pages;
}
