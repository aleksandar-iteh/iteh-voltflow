import { createContext } from 'react';
import type { ValidationErrors } from '../types/api';
import type { LoginPayload, RegisterPayload, User } from '../types/models';

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  isInitializing: boolean;
  isLoading: boolean;
  error: string | null;
  validationErrors: ValidationErrors;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
