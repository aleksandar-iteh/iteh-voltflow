import { create } from 'zustand';
import { adminUserApi } from '../api/adminUserApi';
import type { AdminUserQuery } from '../api/adminUserApi';
import type { PaginationMeta } from '../types/api';
import type { AdminUser } from '../types/models';
import { toStoreError } from './storeError';

interface AdminUserStore {
  users: AdminUser[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  fetchUsers: (query?: AdminUserQuery) => Promise<AdminUser[]>;
  clearError: () => void;
}

export const useAdminUserStore = create<AdminUserStore>((set) => ({
  users: [],
  pagination: null,
  isLoading: false,
  error: null,

  fetchUsers: async (query = {}) => {
    set({ isLoading: true, error: null });

    try {
      const response = await adminUserApi.list(query);
      set({
        users: response.data,
        pagination: response.meta,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({ error: toStoreError(error).error, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
