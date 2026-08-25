import { useCallback, useEffect, useRef } from 'react';
import { useOrderStore } from '../../stores';
import { AdminOrderPagination } from './AdminOrderPagination';
import { AdminOrderTable } from './AdminOrderTable';
import { AdminSectionShell } from './AdminSectionShell';

const ORDERS_PER_PAGE = 10;

export function OrdersSection() {
  const orders = useOrderStore((state) => state.orders);
  const pagination = useOrderStore((state) => state.pagination);
  const isLoading = useOrderStore((state) => state.isLoading);
  const error = useOrderStore((state) => state.error);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const hasRequestedOrders = useRef(false);

  const fetchAdminOrders = useCallback(
    (page: number) =>
      fetchOrders({
        status: undefined,
        user_id: undefined,
        sort_by: 'created_at',
        sort_direction: 'desc',
        per_page: ORDERS_PER_PAGE,
        page,
      }),
    [fetchOrders],
  );

  useEffect(() => {
    if (hasRequestedOrders.current) {
      return;
    }

    hasRequestedOrders.current = true;
    void fetchAdminOrders(1).catch(() => undefined);
  }, [fetchAdminOrders]);

  const handlePageChange = (page: number) => {
    if (isLoading || page < 1 || (pagination && page > pagination.last_page)) {
      return;
    }

    void fetchAdminOrders(page).catch(() => undefined);
  };

  return (
    <AdminSectionShell
      section='orders'
      title='Orders'
      description='View customer orders and manage their progress through the fulfilment process.'
      icon={<OrdersIcon />}
    >
      <div className='mt-8'>
        {error && (
          <div
            className='rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700'
            role='alert'
          >
            <p className='font-bold'>We could not load the orders.</p>
            <p className='mt-1 text-sm'>{error}</p>
            <button
              type='button'
              onClick={() => void fetchAdminOrders(1).catch(() => undefined)}
              disabled={isLoading}
              className='mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-60'
            >
              Try again
            </button>
          </div>
        )}

        {!error && pagination && (
          <>
            <div className='mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
              <h3 className='text-lg font-bold text-teal-950'>Customer orders</h3>
              <p className='text-sm text-slate-600'>
                Showing {pagination.from ?? 0}&ndash;{pagination.to ?? 0} of{' '}
                {pagination.total} orders
              </p>
            </div>

            {orders.length > 0 ? (
              <AdminOrderTable orders={orders} />
            ) : (
              <div className='rounded-2xl border border-dashed border-teal-200 bg-teal-50 px-6 py-12 text-center'>
                <h3 className='text-lg font-bold text-teal-950'>No orders yet</h3>
                <p className='mt-2 text-sm text-slate-600'>
                  Customer orders will appear here as soon as they are placed.
                </p>
              </div>
            )}

            <AdminOrderPagination
              currentPage={pagination.current_page}
              lastPage={pagination.last_page}
              disabled={isLoading}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {!error && !pagination && <div className='min-h-40' aria-busy='true' />}
      </div>
    </AdminSectionShell>
  );
}

function OrdersIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='m4 7 8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7M12 11v10' />
    </svg>
  );
}
