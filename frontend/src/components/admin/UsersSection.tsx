import { useEffect, useRef } from 'react';
import { useAdminUserStore } from '../../stores';
import type { AdminUser } from '../../types/models';
import { AdminSectionShell } from './AdminSectionShell';

const USERS_PER_PAGE = 10;

export function UsersSection() {
  const users = useAdminUserStore((state) => state.users);
  const pagination = useAdminUserStore((state) => state.pagination);
  const isLoading = useAdminUserStore((state) => state.isLoading);
  const error = useAdminUserStore((state) => state.error);
  const fetchUsers = useAdminUserStore((state) => state.fetchUsers);
  const hasRequestedUsers = useRef(false);

  useEffect(() => {
    if (hasRequestedUsers.current) {
      return;
    }

    hasRequestedUsers.current = true;
    void fetchUsers({ page: 1, per_page: USERS_PER_PAGE }).catch(() => undefined);
  }, [fetchUsers]);

  const handlePageChange = (page: number) => {
    if (isLoading || page < 1 || (pagination && page > pagination.last_page)) {
      return;
    }

    void fetchUsers({ page, per_page: USERS_PER_PAGE }).catch(() => undefined);
  };

  return (
    <AdminSectionShell
      section='users'
      title='Users'
      description='Review registered customers and their basic account information.'
      icon={<UsersIcon />}
    >
      <div className='mt-8'>
        {error && (
          <div
            className='rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700'
            role='alert'
          >
            <p className='font-bold'>We could not load the users.</p>
            <p className='mt-1 text-sm'>{error}</p>
            <button
              type='button'
              onClick={() =>
                void fetchUsers({ page: 1, per_page: USERS_PER_PAGE }).catch(
                  () => undefined,
                )
              }
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
              <h3 className='text-lg font-bold text-teal-950'>Registered users</h3>
              <p className='text-sm text-slate-600'>
                Showing {pagination.from ?? 0}&ndash;{pagination.to ?? 0} of{' '}
                {pagination.total} users
              </p>
            </div>

            {users.length > 0 ? (
              <div className='overflow-x-auto rounded-2xl border border-teal-100'>
                <table className='w-full min-w-2xl border-collapse text-left'>
                  <thead className='bg-teal-50 text-xs font-bold uppercase tracking-wider text-teal-800'>
                    <tr>
                      <th scope='col' className='px-5 py-4'>User</th>
                      <th scope='col' className='px-5 py-4'>Role</th>
                      <th scope='col' className='px-5 py-4'>Joined</th>
                      <th scope='col' className='px-5 py-4 text-right'>Orders</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-teal-100 bg-white'>
                    {users.map((user) => (
                      <UserRow key={user.id} user={user} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='rounded-2xl border border-dashed border-teal-200 bg-teal-50 px-6 py-12 text-center'>
                <p className='text-sm font-semibold text-teal-800'>
                  No registered users were found.
                </p>
              </div>
            )}

            <UserPagination
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

function UserRow({ user }: { user: AdminUser }) {
  return (
    <tr className='transition hover:bg-teal-50/60'>
      <th scope='row' className='px-5 py-4 font-normal'>
        <div className='flex items-center gap-3'>
          <span
            className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white'
            aria-hidden='true'
          >
            {userInitial(user.name)}
          </span>
          <div className='min-w-0'>
            <p className='max-w-64 truncate text-sm font-bold text-teal-950'>
              {user.name}
            </p>
            <p className='mt-0.5 max-w-64 truncate text-xs text-slate-500'>
              {user.email}
            </p>
          </div>
        </div>
      </th>
      <td className='whitespace-nowrap px-5 py-4'>
        <span
          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${
            user.role === 'admin'
              ? 'border-violet-200 bg-violet-50 text-violet-700'
              : 'border-teal-200 bg-teal-50 text-teal-700'
          }`}
        >
          {user.role}
        </span>
      </td>
      <td className='whitespace-nowrap px-5 py-4 text-sm text-slate-600'>
        {formatDate(user.created_at)}
      </td>
      <td className='whitespace-nowrap px-5 py-4 text-right'>
        <span className='inline-flex min-w-10 justify-center rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-bold text-teal-950'>
          {user.orders_count}
        </span>
      </td>
    </tr>
  );
}

function UserPagination({
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
      className='mt-5 flex items-center justify-between gap-4'
      aria-label='User pagination'
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

function UsersIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <circle cx='9' cy='8' r='4' />
      <path strokeLinecap='round' strokeLinejoin='round' d='M2.5 21a6.5 6.5 0 0 1 13 0M16 5.5a3.5 3.5 0 0 1 0 7M17.5 15a5.5 5.5 0 0 1 4 6' />
    </svg>
  );
}
