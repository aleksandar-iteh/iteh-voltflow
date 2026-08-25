import { create } from 'zustand';
import { adminOverviewApi } from '../api/adminOverviewApi';
import type { AdminOverviewData } from '../types/models';
import { toStoreError } from './storeError';

interface AdminOverviewStore {
  overview: AdminOverviewData | null;
  isLoading: boolean;
  error: string | null;
  fetchOverview: () => Promise<AdminOverviewData>;
}

export const useAdminOverviewStore = create<AdminOverviewStore>((set) => ({
  overview: null,
  isLoading: false,
  error: null,

  fetchOverview: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await adminOverviewApi.get();
      set({ overview: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: toStoreError(error).error, isLoading: false });
      throw error;
    }
  },
}));
