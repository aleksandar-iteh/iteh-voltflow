import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';
import type { UserRole } from '../../types/models';

interface ProtectedRouteProps {
  allowedRoles?: readonly UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  }

  return <Outlet />;
}
