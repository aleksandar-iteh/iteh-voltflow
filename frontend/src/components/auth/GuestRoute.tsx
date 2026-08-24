import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context';

export function GuestRoute() {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  }

  return <Outlet />;
}
