import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import { formatPrice } from '../lib/formatters';
import { useOrderStore } from '../stores';
import type { Order, OrderStatus } from '../types/models';

const ORDERS_PER_PAGE = 10;

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-800',
  processing: 'border-sky-200 bg-sky-50 text-sky-800',
  shipped: 'border-indigo-200 bg-indigo-50 text-indigo-800',
  delivered: 'border-teal-200 bg-teal-50 text-teal-800',
  cancelled: 'border-red-200 bg-red-50 text-red-700',
};

const Profile = () => {
  const { user } = useAuth();
  const orders = useOrderStore((state) => state.orders);
  const pagination = useOrderStore((state) => state.pagination);
  const isLoading = useOrderStore((state) => state.isLoading);
  const error = useOrderStore((state) => state.error);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);
  const clearError = useOrderStore((state) => state.clearError);
  const requestedUserId = useRef<number | null>(null);
  const ordersSectionRef = useRef<HTMLElement>(null);
  const [loadedUserId, setLoadedUserId] = useState<number | null>(null);

  useEffect(() => {
    if (!user || requestedUserId.current === user.id) {
      return clearError;
    }

    requestedUserId.current = user.id;
    let isActive = true;

    void fetchOrders({
      status: undefined,
      user_id: undefined,
      sort_by: 'created_at',
      sort_direction: 'desc',
      per_page: ORDERS_PER_PAGE,
      page: 1,
    })
      .catch(() => undefined)
      .finally(() => {
        if (isActive) {
          setLoadedUserId(user.id);
        }
      });

    return () => {
      isActive = false;
      clearError();
    };
  }, [clearError, fetchOrders, user]);

  if (!user) {
    return null;
  }

  const hasLoadedOrders = loadedUserId === user.id;
  const visibleOrders = hasLoadedOrders
    ? orders.filter((order) => order.user_id === user.id)
    : [];

  const handlePageChange = (page: number) => {
    if (isLoading || page < 1 || (pagination && page > pagination.last_page)) {
      return;
    }

    ordersSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    void fetchOrders({
      status: undefined,
      user_id: undefined,
      sort_by: 'created_at',
      sort_direction: 'desc',
      per_page: ORDERS_PER_PAGE,
      page,
    }).catch(() => undefined);
  };

  const retryOrders = () => {
    void fetchOrders({
      status: undefined,
      user_id: undefined,
      sort_by: 'created_at',
      sort_direction: 'desc',
      per_page: ORDERS_PER_PAGE,
      page: pagination?.current_page ?? 1,
    }).catch(() => undefined);
  };

  return (
    <div>
      <div className='max-w-3xl'>
        <p className='text-sm font-bold uppercase tracking-widest text-teal-600'>
          Your account
        </p>
        <h1 className='mt-3 text-3xl font-bold text-teal-950 sm:text-4xl'>
          Profile
        </h1>
        <p className='mt-4 leading-7 text-slate-600'>
          Review your account details and follow every order you have placed with VoltFlow.
        </p>
      </div>

      <section className='mt-8 overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm'>
        <div className='bg-teal-950 px-6 py-7 text-white sm:px-8'>
          <div className='flex flex-col gap-5 sm:flex-row sm:items-center'>
            <span
              className='flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-teal-600 text-3xl font-bold shadow-sm'
              aria-hidden='true'
            >
              {userInitial(user.name)}
            </span>
            <div className='min-w-0'>
              <h2 className='break-words text-2xl font-bold'>{user.name}</h2>
              <p className='mt-1 break-all text-sm text-teal-100'>{user.email}</p>
              <span className='mt-3 inline-flex rounded-full bg-teal-800 px-3 py-1 text-xs font-bold capitalize text-teal-100'>
                {user.role} account
              </span>
            </div>
          </div>
        </div>

        <dl className='grid sm:grid-cols-2 lg:grid-cols-3'>
          <ProfileDetail
            icon={<UserIcon />}
            label='Full name'
            value={user.name}
          />
          <ProfileDetail
            icon={<EmailIcon />}
            label='Email address'
            value={user.email}
          />
          <ProfileDetail
            icon={<CalendarIcon />}
            label='Member since'
            value={formatDate(user.created_at)}
          />
        </dl>
      </section>

      <section ref={ordersSectionRef} className='mt-10 scroll-mt-24'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <p className='text-sm font-bold uppercase tracking-widest text-teal-600'>
              Purchase history
            </p>
            <h2 className='mt-2 text-2xl font-bold text-teal-950'>Your orders</h2>
          </div>
          {hasLoadedOrders && pagination && !error && (
            <p className='text-sm text-slate-600'>
              Showing {pagination.from ?? 0}&ndash;{pagination.to ?? 0} of{' '}
              {pagination.total} orders
            </p>
          )}
        </div>

        {error && hasLoadedOrders && (
          <div
            className='mt-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700'
            role='alert'
          >
            <p className='font-bold'>We could not load your orders.</p>
            <p className='mt-1 text-sm'>{error}</p>
            <button
              type='button'
              onClick={retryOrders}
              disabled={isLoading}
              className='mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-60'
            >
              Try again
            </button>
          </div>
        )}

        {!error && hasLoadedOrders && visibleOrders.length > 0 && (
          <>
            <div className='mt-5 overflow-x-auto rounded-2xl border border-teal-100 bg-white shadow-sm'>
              <table className='w-full min-w-3xl border-collapse text-left'>
                <thead className='bg-teal-50 text-xs font-bold uppercase tracking-wider text-teal-800'>
                  <tr>
                    <th scope='col' className='px-5 py-4 sm:px-6'>Order</th>
                    <th scope='col' className='px-5 py-4'>Date</th>
                    <th scope='col' className='px-5 py-4'>Items</th>
                    <th scope='col' className='px-5 py-4'>Status</th>
                    <th scope='col' className='px-5 py-4 text-right'>Total</th>
                    <th scope='col' className='px-5 py-4 text-right sm:px-6'>
                      <span className='sr-only'>Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-teal-100'>
                  {visibleOrders.map((order) => (
                    <OrderTableRow key={order.id} order={order} />
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && (
              <OrderPagination
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                disabled={isLoading}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}

        {!error && hasLoadedOrders && visibleOrders.length === 0 && (
          <div className='mt-5 rounded-2xl border border-dashed border-teal-200 bg-white px-6 py-14 text-center'>
            <span className='mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-600'>
              <OrderIcon />
            </span>
            <h3 className='mt-5 text-xl font-bold text-teal-950'>No orders yet</h3>
            <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600'>
              Once you place an order, you will be able to follow its status and open its complete details here.
            </p>
            <Link
              to='/products'
              className='mt-6 inline-flex rounded-xl bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2'
            >
              Browse products
            </Link>
          </div>
        )}

        {!hasLoadedOrders && <div className='min-h-48' aria-busy='true' />}
      </section>
    </div>
  );
};

function ProfileDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className='flex min-w-0 gap-3 border-b border-teal-100 px-6 py-5 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:[&:nth-child(2n)]:border-r lg:last:border-r-0'>
      <span className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700'>
        {icon}
      </span>
      <div className='min-w-0'>
        <dt className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
          {label}
        </dt>
        <dd className='mt-1 break-words text-sm font-bold text-teal-950'>{value}</dd>
      </div>
    </div>
  );
}

function OrderTableRow({ order }: { order: Order }) {
  const itemCount =
    order.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;

  return (
    <tr className='transition hover:bg-teal-50/60'>
      <th scope='row' className='whitespace-nowrap px-5 py-5 font-bold text-teal-950 sm:px-6'>
        #{order.id}
      </th>
      <td className='whitespace-nowrap px-5 py-5 text-sm text-slate-600'>
        {formatDate(order.created_at)}
      </td>
      <td className='whitespace-nowrap px-5 py-5 text-sm text-slate-600'>
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </td>
      <td className='whitespace-nowrap px-5 py-5'>
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${STATUS_STYLES[order.status]}`}
        >
          {order.status}
        </span>
      </td>
      <td className='whitespace-nowrap px-5 py-5 text-right font-bold text-teal-700'>
        {formatPrice(order.total_price)}
      </td>
      <td className='whitespace-nowrap px-5 py-5 text-right sm:px-6'>
        <Link
          to={`/order/${order.id}`}
          className='inline-flex items-center gap-1.5 rounded-lg border border-teal-200 px-3 py-2 text-xs font-bold text-teal-700 transition hover:bg-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600'
          aria-label={`View order ${order.id}`}
        >
          View
          <ArrowIcon />
        </Link>
      </td>
    </tr>
  );
}

function OrderPagination({
  currentPage,
  lastPage,
  disabled,
  onPageChange,
}: {
  currentPage: number;
  lastPage: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
}) {
  if (lastPage <= 1) {
    return null;
  }

  return (
    <nav
      className='mt-6 flex items-center justify-between gap-4'
      aria-label='Order pagination'
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

function userInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || 'U';
}

function formatDate(value: string | null): string {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(date);
}

function UserIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <circle cx='12' cy='8' r='4' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M4.5 21a7.5 7.5 0 0 1 15 0' />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <rect x='3' y='5' width='18' height='14' rx='2' />
      <path strokeLinecap='round' strokeLinejoin='round' d='m4 7 8 6 8-6' />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <rect x='3' y='5' width='18' height='16' rx='2' />
      <path strokeLinecap='round' d='M8 3v4M16 3v4M3 10h18' />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg className='h-8 w-8' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.7' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='M7 3h10l2 4v14H5V7l2-4Z' />
      <path strokeLinecap='round' d='M5 8h14M9 12h6' />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className='h-3.5 w-3.5' viewBox='0 0 20 20' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='m7 4 6 6-6 6' />
    </svg>
  );
}

export default Profile;
