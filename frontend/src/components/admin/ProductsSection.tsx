import { AdminSectionShell } from './AdminSectionShell';

export function ProductsSection() {
  return (
    <AdminSectionShell
      section='products'
      title='Products'
      description='Manage the electric scooter catalogue, product details, pricing, stock, and images.'
      icon={<ProductsIcon />}
    />
  );
}

function ProductsIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <circle cx='6' cy='18' r='2' />
      <circle cx='18' cy='18' r='2' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M6 18h10L13 5h4M13 5h5M9 18l2-8h3' />
    </svg>
  );
}
