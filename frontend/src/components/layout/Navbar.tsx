import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context';
import { useCartStore } from '../../stores';

interface NavigationItem {
  label: string;
  to: string;
  end?: boolean;
}

const publicNavigation: NavigationItem[] = [
  { label: 'Home', to: '/', end: true },
  { label: 'Products', to: '/products' },
];

const userNavigation: NavigationItem[] = [
  ...publicNavigation,
  { label: 'Cart', to: '/cart' },
];

export function Navbar() {
  const { user, isAuthenticated, isAdmin, isLoading, logout } = useAuth();
  const cartItemCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  );
  const navigate = useNavigate();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigationItems = isAdmin
    ? []
    : isAuthenticated
      ? userNavigation
      : publicNavigation;
  const brandDestination = isAdmin ? '/admin' : '/';

  useEffect(() => {
    const closeProfileMenu = (event: PointerEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    const closeMenusWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeProfileMenu);
    document.addEventListener('keydown', closeMenusWithEscape);

    return () => {
      document.removeEventListener('pointerdown', closeProfileMenu);
      document.removeEventListener('keydown', closeMenusWithEscape);
    };
  }, []);

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  };

  const handleLogout = async () => {
    closeMenus();
    await logout().catch(() => undefined);
    navigate('/', { replace: true });
  };

  return (
    <header className='sticky top-0 z-40 border-b border-teal-100 bg-white shadow-sm'>
      <a
        href='#main-content'
        className='sr-only z-50 rounded-md bg-teal-700 px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4'
      >
        Skip to main content
      </a>

      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8'>
        <Link
          to={brandDestination}
          onClick={closeMenus}
          className='flex shrink-0 items-center gap-3 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2'
          aria-label='VoltFlow home'
        >
          <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-xl font-bold text-white shadow-sm'>
            V
          </span>
          <span>
            <span className='block text-lg font-bold leading-none text-teal-950'>
              VoltFlow
            </span>
            <span className='mt-1 hidden text-xs font-medium text-teal-600 sm:block'>
              Electric mobility
            </span>
          </span>
        </Link>

        <nav className='hidden items-center gap-1 md:flex' aria-label='Main navigation'>
          {navigationItems.map((item) => (
            <NavigationLink
              key={item.to}
              item={item}
              onClick={closeMenus}
              badge={item.to === '/cart' ? cartItemCount : undefined}
            />
          ))}
        </nav>

        <div className='hidden min-w-40 justify-end md:flex'>
          {isAuthenticated && user ? (
            <div className='relative' ref={profileMenuRef}>
              <button
                type='button'
                onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
                className='flex items-center gap-3 rounded-xl border border-teal-100 bg-white px-2 py-1.5 text-left transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2'
                aria-expanded={isProfileMenuOpen}
                aria-haspopup='menu'
              >
                <UserAvatar name={user.name} />
                <span className='hidden max-w-32 lg:block'>
                  <span className='block truncate text-sm font-semibold text-teal-950'>
                    {user.name}
                  </span>
                  <span className='block text-xs capitalize text-teal-600'>
                    {user.role}
                  </span>
                </span>
                <ChevronIcon isOpen={isProfileMenuOpen} />
              </button>

              {isProfileMenuOpen && (
                <div
                  className='absolute right-0 mt-2 w-72 overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-xl'
                  role='menu'
                >
                  <ProfileSummary name={user.name} email={user.email} role={user.role} />
                  <div className='space-y-1 p-2'>
                    {user.role === 'user' && (
                      <Link
                        to='/profile'
                        onClick={closeMenus}
                        className='block rounded-xl px-3 py-2.5 text-sm font-medium text-teal-950 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600'
                        role='menuitem'
                      >
                        View profile
                      </Link>
                    )}
                    <button
                      type='button'
                      onClick={() => void handleLogout()}
                      disabled={isLoading}
                      className='w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60'
                      role='menuitem'
                    >
                      {isLoading ? 'Signing out...' : 'Logout'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='flex items-center gap-2'>
              <Link
                to='/login'
                className='rounded-lg px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600'
              >
                Login
              </Link>
              <Link
                to='/register'
                className='rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2'
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          type='button'
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          className='inline-flex h-10 w-10 items-center justify-center rounded-lg text-teal-800 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 md:hidden'
          aria-controls='mobile-navigation'
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          <MenuIcon isOpen={isMobileMenuOpen} />
        </button>
      </div>

      <div
        id='mobile-navigation'
        className={isMobileMenuOpen ? 'border-t border-teal-100 bg-white md:hidden' : 'hidden'}
      >
        <nav
          className='mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6'
          aria-label='Mobile navigation'
        >
          {navigationItems.map((item) => (
            <NavigationLink
              key={item.to}
              item={item}
              onClick={closeMenus}
              badge={item.to === '/cart' ? cartItemCount : undefined}
              mobile
            />
          ))}

          {isAuthenticated && user ? (
            <div className='mt-3 border-t border-teal-100 pt-4'>
              <ProfileSummary name={user.name} email={user.email} role={user.role} />
              <div className='mt-2 grid gap-2'>
                {user.role === 'user' && (
                  <Link
                    to='/profile'
                    onClick={closeMenus}
                    className='rounded-xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800 transition hover:bg-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600'
                  >
                    View profile
                  </Link>
                )}
                <button
                  type='button'
                  onClick={() => void handleLogout()}
                  disabled={isLoading}
                  className='rounded-xl border border-red-100 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:cursor-not-allowed disabled:opacity-60'
                >
                  {isLoading ? 'Signing out...' : 'Logout'}
                </button>
              </div>
            </div>
          ) : (
            <div className='mt-3 grid grid-cols-2 gap-3 border-t border-teal-100 pt-4'>
              <Link
                to='/login'
                onClick={closeMenus}
                className='rounded-xl border border-teal-200 px-4 py-3 text-center text-sm font-semibold text-teal-700 transition hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600'
              >
                Login
              </Link>
              <Link
                to='/register'
                onClick={closeMenus}
                className='rounded-xl bg-teal-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600'
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

function NavigationLink({
  item,
  mobile = false,
  badge,
  onClick,
}: {
  item: NavigationItem;
  mobile?: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        [
          mobile ? 'block rounded-xl px-4 py-3 text-base font-semibold' : 'rounded-lg px-3 py-2 text-sm font-semibold',
          'transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600',
          isActive
            ? 'bg-teal-100 text-teal-800'
            : 'text-teal-950 hover:bg-teal-50 hover:text-teal-700',
        ].join(' ')
      }
    >
      <span className='inline-flex items-center gap-2'>
        {item.label}
        {badge !== undefined && badge > 0 && (
          <span
            className='inline-flex min-w-5 items-center justify-center rounded-full bg-teal-600 px-1.5 py-0.5 text-xs font-bold text-white'
            aria-label={`${badge} cart items`}
          >
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </span>
    </NavLink>
  );
}

function ProfileSummary({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: string;
}) {
  return (
    <div className='flex items-center gap-3 bg-teal-50 p-4'>
      <UserAvatar name={name} large />
      <div className='min-w-0'>
        <p className='truncate text-sm font-bold text-teal-950'>{name}</p>
        <p className='truncate text-xs text-teal-700'>{email}</p>
        <span className='mt-1 inline-flex rounded-full bg-white px-2 py-0.5 text-xs font-semibold capitalize text-teal-700 ring-1 ring-teal-200'>
          {role}
        </span>
      </div>
    </div>
  );
}

function UserAvatar({ name, large = false }: { name: string; large?: boolean }) {
  const initial = name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <span
      className={`${large ? 'h-11 w-11 text-base' : 'h-9 w-9 text-sm'} flex shrink-0 items-center justify-center rounded-full bg-teal-600 font-bold text-white`}
      aria-hidden='true'
    >
      {initial}
    </span>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`h-4 w-4 text-teal-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      viewBox='0 0 20 20'
      fill='currentColor'
      aria-hidden='true'
    >
      <path
        fillRule='evenodd'
        d='M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z'
        clipRule='evenodd'
      />
    </svg>
  );
}

function MenuIcon({ isOpen }: { isOpen: boolean }) {
  return isOpen ? (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18 18 6M6 6l12 12' />
    </svg>
  ) : (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' aria-hidden='true'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16M4 18h16' />
    </svg>
  );
}
