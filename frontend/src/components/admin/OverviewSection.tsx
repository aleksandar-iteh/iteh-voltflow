import { AdminSectionShell } from './AdminSectionShell';

export function OverviewSection() {
  return (
    <AdminSectionShell
      section='overview'
      title='Overview'
      description='A central place for the most important VoltFlow store information and activity.'
      icon={<OverviewIcon />}
    />
  );
}

function OverviewIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <rect x='3' y='3' width='7' height='7' rx='1.5' />
      <rect x='14' y='3' width='7' height='7' rx='1.5' />
      <rect x='3' y='14' width='7' height='7' rx='1.5' />
      <rect x='14' y='14' width='7' height='7' rx='1.5' />
    </svg>
  );
}
