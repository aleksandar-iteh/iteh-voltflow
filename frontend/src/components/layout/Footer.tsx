import { Link } from 'react-router-dom';
import { useAuth } from '../../context';

export function Footer() {
  const { isAdmin } = useAuth();
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-teal-950 text-white'>
      <div className='mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:px-8'>
        <div className='max-w-md'>
          <Link
            to={isAdmin ? '/admin' : '/'}
            className='inline-flex items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-300'
          >
            <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-xl font-bold'>
              V
            </span>
            <span className='text-xl font-bold'>VoltFlow</span>
          </Link>
          <p className='mt-4 text-sm leading-6 text-teal-100'>
            Find the electric scooter that fits your city, your commute, and your way of moving.
          </p>
        </div>

        {!isAdmin && (
          <nav className='md:justify-self-end' aria-label='Footer navigation'>
            <p className='text-sm font-semibold uppercase tracking-wider text-teal-300'>
              Explore
            </p>
            <div className='mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm'>
              <Link className='text-teal-100 transition hover:text-white' to='/'>
                Home
              </Link>
              <Link className='text-teal-100 transition hover:text-white' to='/products'>
                Products
              </Link>
            </div>
          </nav>
        )}
      </div>

      <div className='border-t border-teal-800'>
        <div className='mx-auto max-w-7xl px-4 py-5 text-sm text-teal-200 sm:px-6 lg:px-8'>
          &copy; {currentYear} VoltFlow. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
