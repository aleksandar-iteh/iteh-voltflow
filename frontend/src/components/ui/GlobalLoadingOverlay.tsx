import { useLoadingStore } from '../../stores';

export function GlobalLoadingOverlay() {
  const isLoading = useLoadingStore((state) => state.isLoading);

  if (!isLoading) {
    return null;
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-teal-950/40 px-4 backdrop-blur-sm'
      role='status'
      aria-live='polite'
      aria-busy='true'
      aria-label='Loading content'
    >
      <div className='flex min-w-40 flex-col items-center rounded-2xl bg-white px-8 py-7 shadow-2xl'>
        <span
          className='h-12 w-12 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600 motion-reduce:animate-none'
          aria-hidden='true'
        />
        <p className='mt-4 text-sm font-semibold text-teal-950'>Loading...</p>
        <span className='sr-only'>Please wait while the requested content loads.</span>
      </div>
    </div>
  );
}
