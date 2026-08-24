import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuthStore } from '../stores';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const validationErrors = useAuthStore((state) => state.validationErrors);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const refreshUser = useAuthStore((state) => state.fetchCurrentUser);
  const clearError = useAuthStore((state) => state.clearError);
  const hasStartedInitialization = useRef(false);
  const [isInitializing, setIsInitializing] = useState(Boolean(token));

  useEffect(() => {
    if (hasStartedInitialization.current) {
      return;
    }

    hasStartedInitialization.current = true;

    if (!token) {
      return;
    }

    void refreshUser()
      .catch(() => {
        clearError();
      })
      .finally(() => {
        setIsInitializing(false);
      });
  }, [clearError, refreshUser, token]);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      isAdmin: user?.role === 'admin',
      isUser: user?.role === 'user',
      isInitializing,
      isLoading,
      error,
      validationErrors,
      login,
      register,
      logout,
      refreshUser,
      clearError,
    }),
    [
      clearError,
      error,
      isInitializing,
      isLoading,
      login,
      logout,
      refreshUser,
      register,
      token,
      user,
      validationErrors,
    ],
  );

  if (isInitializing) {
    return (
      <div
        className='flex min-h-screen items-center justify-center'
        role='status'
        aria-live='polite'
      >
        Checking your session...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
