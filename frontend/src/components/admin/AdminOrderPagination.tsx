interface AdminOrderPaginationProps {
  currentPage: number;
  lastPage: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}

export function AdminOrderPagination({
  currentPage,
  lastPage,
  disabled,
  onPageChange,
}: AdminOrderPaginationProps) {
  if (lastPage <= 1) {
    return null;
  }

  return (
    <nav
      className='mt-5 flex items-center justify-between gap-4'
      aria-label='Order management pagination'
    >
      <button
        type='button'
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage === 1}
        className='rounded-lg border border-teal-200 bg-white px-4 py-2.5 text-sm font-bold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50'
      >
        Previous
      </button>
      <p className='text-sm font-semibold text-slate-600'>
        Page <span className='text-teal-950'>{currentPage}</span> of{' '}
        <span className='text-teal-950'>{lastPage}</span>
      </p>
      <button
        type='button'
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage === lastPage}
        className='rounded-lg border border-teal-200 bg-white px-4 py-2.5 text-sm font-bold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 disabled:cursor-not-allowed disabled:opacity-50'
      >
        Next
      </button>
    </nav>
  );
}
