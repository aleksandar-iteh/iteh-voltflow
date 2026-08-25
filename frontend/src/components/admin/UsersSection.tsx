import { AdminSectionShell } from './AdminSectionShell';

export function UsersSection() {
  return (
    <AdminSectionShell
      section='users'
      title='Users'
      description='Review registered customers and their basic account information.'
      icon={<UsersIcon />}
    />
  );
}

function UsersIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <circle cx='9' cy='8' r='4' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M2.5 21a6.5 6.5 0 0 1 13 0M16 5.5a3.5 3.5 0 0 1 0 7M17.5 15a5.5 5.5 0 0 1 4 6' />
    </svg>
  );
}
