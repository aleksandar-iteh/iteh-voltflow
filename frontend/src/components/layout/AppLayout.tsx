import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { ScrollToTop } from './ScrollToTop';

export function AppLayout() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const isAdminDestination =
    location.pathname === '/admin' || location.pathname.startsWith('/order/');

  if (isAdmin && !isAdminDestination) {
    return <Navigate to='/admin' replace />;
  }

  return (
    <div className='flex min-h-screen flex-col bg-teal-50'>
      <ScrollToTop />
      <Navbar />
      <main
        id='main-content'
        className='mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 lg:py-12'
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
