import { AdminSectionShell } from './AdminSectionShell';

export function OrdersSection() {
  return (
    <AdminSectionShell
      section='orders'
      title='Orders'
      description='View customer orders and manage their progress through the fulfilment process.'
      icon={<OrdersIcon />}
    />
  );
}

function OrdersIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' d='m4 7 8-4 8 4-8 4-8-4Zm0 0v10l8 4 8-4V7M12 11v10' />
    </svg>
  );
}
