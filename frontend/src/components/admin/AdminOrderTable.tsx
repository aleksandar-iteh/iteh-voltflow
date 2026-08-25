import { Link } from 'react-router-dom';
import { formatPrice } from '../../lib/formatters';
import type { Order, OrderStatus } from '../../types/models';

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-800',
  processing: 'border-sky-200 bg-sky-50 text-sky-800',
  shipped: 'border-indigo-200 bg-indigo-50 text-indigo-800',
  delivered: 'border-teal-200 bg-teal-50 text-teal-800',
  cancelled: 'border-red-200 bg-red-50 text-red-700',
};

export function AdminOrderTable({ orders }: { orders: Order[] }) {
  return (
    <div className='max-h-144 overflow-auto rounded-2xl border border-teal-100'>
      <table className='w-full min-w-6xl border-collapse text-left'>
        <thead className='sticky top-0 z-10 bg-teal-50 text-xs font-bold uppercase tracking-wider text-teal-800 shadow-sm'>
          <tr>
            <th scope='col' className='px-5 py-4'>Order</th>
            <th scope='col' className='px-5 py-4'>Customer</th>
            <th scope='col' className='px-5 py-4'>Shipping address</th>
            <th scope='col' className='px-5 py-4'>Items</th>
            <th scope='col' className='px-5 py-4'>Status</th>
            <th scope='col' className='px-5 py-4 text-right'>Total</th>
            <th scope='col' className='px-5 py-4'>Placed</th>
            <th scope='col' className='px-5 py-4 text-right'>Actions</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-teal-100 bg-white'>
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const itemCount =
    order.items?.reduce((total, item) => total + item.quantity, 0) ?? 0;
  const customerName = order.user?.name ?? `User #${order.user_id}`;

  return (
    <tr className='transition hover:bg-teal-50/60'>
      <th scope='row' className='whitespace-nowrap px-5 py-5 font-bold text-teal-950'>
        #{order.id}
      </th>
      <td className='px-5 py-5'>
        <div className='flex items-center gap-3'>
          <span
            className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-xs font-bold text-white'
            aria-hidden='true'
          >
            {userInitial(customerName)}
          </span>
          <div className='min-w-0'>
            <p className='max-w-52 truncate text-sm font-bold text-teal-950'>
              {customerName}
            </p>
            {order.user?.email && (
              <p className='mt-0.5 max-w-52 truncate text-xs text-slate-500'>
                {order.user.email}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className='px-5 py-5'>
        <p className='line-clamp-2 max-w-64 text-sm leading-5 text-slate-600'>
          {order.shipping_address}
        </p>
      </td>
      <td className='whitespace-nowrap px-5 py-5 text-sm font-semibold text-slate-600'>
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
      <td className='whitespace-nowrap px-5 py-5 text-sm text-slate-600'>
        {formatDateTime(order.created_at)}
      </td>
      <td className='whitespace-nowrap px-5 py-5 text-right'>
        <Link
          to={`/order/${order.id}`}
          className='inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2'
          aria-label={`Open order ${order.id}`}
        >
          View &amp; update
          <ArrowIcon />
        </Link>
      </td>
    </tr>
  );
}

function userInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || 'U';
}

function formatDateTime(value: string | null): string {
  if (!value) {
    return 'Not available';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function ArrowIcon() {
  return (
    <svg className='h-3.5 w-3.5' viewBox='0 0 20 20' fill='none' stroke='currentColor' strokeWidth='2' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='m7 4 6 6-6 6' />
    </svg>
  );
}
