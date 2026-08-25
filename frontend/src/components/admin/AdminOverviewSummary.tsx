import { formatPrice } from '../../lib/formatters';
import type { AdminOverviewSummary as OverviewSummary } from '../../types/models';

export function AdminOverviewSummary({
  summary,
}: {
  summary: OverviewSummary;
}) {
  const cards = [
    {
      label: 'Customers',
      value: summary.customers.toLocaleString('en-US'),
      note: 'Registered user accounts',
      icon: <UsersIcon />,
    },
    {
      label: 'Products',
      value: summary.products.toLocaleString('en-US'),
      note: 'Products in the catalogue',
      icon: <ProductsIcon />,
    },
    {
      label: 'Orders',
      value: summary.orders.toLocaleString('en-US'),
      note: 'All customer orders',
      icon: <OrdersIcon />,
    },
    {
      label: 'Revenue',
      value: formatPrice(summary.revenue),
      note: 'Excluding cancelled orders',
      icon: <RevenueIcon />,
    },
  ];

  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {cards.map((card) => (
        <article
          key={card.label}
          className='rounded-2xl border border-teal-100 bg-white p-5 shadow-sm'
        >
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='text-sm font-semibold text-slate-500'>{card.label}</p>
              <p className='mt-2 text-2xl font-bold text-teal-950'>{card.value}</p>
            </div>
            <span className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700'>
              {card.icon}
            </span>
          </div>
          <p className='mt-4 text-xs leading-5 text-slate-500'>{card.note}</p>
        </article>
      ))}
    </div>
  );
}

function UsersIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <circle cx='9' cy='8' r='4' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M2.5 21a6.5 6.5 0 0 1 13 0M16 5.5a3.5 3.5 0 0 1 0 7M17.5 15a5.5 5.5 0 0 1 4 6' />
    </svg>
  );
}

function ProductsIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <circle cx='6' cy='18' r='2' />
      <circle cx='18' cy='18' r='2' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18h10L13 5h4M13 5h5M9 18l2-8h3' />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='m4 7 8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7M12 11v10' />
    </svg>
  );
}

function RevenueIcon() {
  return (
    <svg className='h-5 w-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <circle cx='12' cy='12' r='9' />
      <path strokeLinecap='round' d='M15 8.5c-.7-.7-1.7-1-3-1-1.7 0-3 .8-3 2s1.3 1.8 3 2c1.7.2 3 1 3 2.3s-1.3 2.2-3 2.2c-1.2 0-2.3-.4-3-1.2M12 5.5v13' />
    </svg>
  );
}
