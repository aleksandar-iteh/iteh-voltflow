import { create } from 'zustand';

interface LoadingStore {
  activeOperations: number;
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  resetLoading: () => void;
}

export const useLoadingStore = create<LoadingStore>((set) => ({
  activeOperations: 0,
  isLoading: false,

  startLoading: () =>
    set((state) => ({
      activeOperations: state.activeOperations + 1,
      isLoading: true,
    })),

  stopLoading: () =>
    set((state) => {
      const activeOperations = Math.max(0, state.activeOperations - 1);

      return {
        activeOperations,
        isLoading: activeOperations > 0,
      };
    }),

  resetLoading: () => set({ activeOperations: 0, isLoading: false }),
}));

export async function withGlobalLoading<T>(
  operation: () => Promise<T>,
): Promise<T> {
  useLoadingStore.getState().startLoading();

  try {
    return await operation();
  } finally {
    useLoadingStore.getState().stopLoading();
  }
}
