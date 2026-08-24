import { create } from 'zustand';
import { authApi } from '../api/authApi';
import {
  clearAuthSession,
  getStoredToken,
  getStoredUser,
  storeAuthenticatedUser,
  storeAuthSession,
} from '../lib/authStorage';
import { ApiError } from '../lib/api';
import type { ValidationErrors } from '../types/api';
import type { LoginPayload, RegisterPayload, User } from '../types/models';
import { toStoreError } from './storeError';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  validationErrors: ValidationErrors;
  register: (payload: RegisterPayload) => Promise<User>;
  login: (payload: LoginPayload) => Promise<User>;
  fetchCurrentUser: () => Promise<User | null>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const initialToken = getStoredToken();
const initialUser = initialToken ? getStoredUser() : null;

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  isLoading: false,
  error: null,
  validationErrors: {},

  register: async (payload) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await authApi.register(payload);
      storeAuthSession(response.access_token, response.data);
      set({
        user: response.data,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({ ...toStoreError(error), isLoading: false });
      throw error;
    }
  },

  login: async (payload) => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await authApi.login(payload);
      storeAuthSession(response.access_token, response.data);
      set({
        user: response.data,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({ ...toStoreError(error), isLoading: false });
      throw error;
    }
  },

  fetchCurrentUser: async () => {
    if (!get().token) {
      return null;
    }

    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      const response = await authApi.currentUser();
      storeAuthenticatedUser(response.data);
      set({ user: response.data, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession();
        set({ user: null, token: null, isAuthenticated: false });
      }

      set({ ...toStoreError(error), isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null, validationErrors: {} });

    try {
      if (get().token) {
        await authApi.logout();
      }
    } catch (error) {
      set(toStoreError(error));
      throw error;
    } finally {
      clearAuthSession();
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null, validationErrors: {} }),
}));
