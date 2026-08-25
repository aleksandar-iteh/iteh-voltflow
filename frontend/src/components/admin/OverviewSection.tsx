import { lazy, Suspense, useEffect, useRef } from 'react';
import { useAdminOverviewStore, useLoadingStore } from '../../stores';
import { AdminOverviewSummary } from './AdminOverviewSummary';
import { AdminSectionShell } from './AdminSectionShell';

const OrdersByStatusChart = lazy(() =>
  import('./OrdersByStatusChart').then((module) => ({
    default: module.OrdersByStatusChart,
  })),
);
const RevenueTrendChart = lazy(() =>
  import('./RevenueTrendChart').then((module) => ({
    default: module.RevenueTrendChart,
  })),
);

export function OverviewSection() {
  const overview = useAdminOverviewStore((state) => state.overview);
  const isLoading = useAdminOverviewStore((state) => state.isLoading);
  const error = useAdminOverviewStore((state) => state.error);
  const fetchOverview = useAdminOverviewStore((state) => state.fetchOverview);
  const hasRequestedOverview = useRef(false);

  useEffect(() => {
    if (hasRequestedOverview.current) {
      return;
    }

    hasRequestedOverview.current = true;
    void fetchOverview().catch(() => undefined);
  }, [fetchOverview]);

  return (
    <AdminSectionShell
      section='overview'
      title='Overview'
      description='A central place for the most important VoltFlow store information and activity.'
      icon={<OverviewIcon />}
    >
      <div className='mt-8'>
        {error && (
          <div
            className='rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700'
            role='alert'
          >
            <p className='font-bold'>We could not load the dashboard statistics.</p>
            <p className='mt-1 text-sm'>{error}</p>
            <button
              type='button'
              onClick={() => void fetchOverview().catch(() => undefined)}
              disabled={isLoading}
              className='mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-60'
            >
              Try again
            </button>
          </div>
        )}

        {!error && overview && (
          <>
            <AdminOverviewSummary summary={overview.summary} />
            <Suspense fallback={<ChartLoadingFallback />}>
              <div className='mt-6 grid gap-6 lg:grid-cols-3'>
                <RevenueTrendChart data={overview.revenue_over_time} />
                <OrdersByStatusChart data={overview.orders_by_status} />
              </div>
            </Suspense>
          </>
        )}

        {!error && !overview && <div className='min-h-80' aria-busy='true' />}
      </div>
    </AdminSectionShell>
  );
}

function ChartLoadingFallback() {
  const startLoading = useLoadingStore((state) => state.startLoading);
  const stopLoading = useLoadingStore((state) => state.stopLoading);

  useEffect(() => {
    startLoading();

    return stopLoading;
  }, [startLoading, stopLoading]);

  return <div className='min-h-80' aria-busy='true' />;
}

function OverviewIcon() {
  return (
    <svg className='h-6 w-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
      <rect x='3' y='3' width='7' height='7' rx='1.5' />
      <rect x='14' y='3' width='7' height='7' rx='1.5' />
      <rect x='3' y='14' width='7' height='7' rx='1.5' />
      <rect x='14' y='14' width='7' height='7' rx='1.5' />
    </svg>
  );
}
