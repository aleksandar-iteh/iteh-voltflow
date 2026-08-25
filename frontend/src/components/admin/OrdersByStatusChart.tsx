import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { OrderStatus, OrdersByStatusDatum } from '../../types/models';

const STATUS_DETAILS: Record<
  OrderStatus,
  { label: string; color: string }
> = {
  pending: { label: 'Pending', color: '#f59e0b' },
  processing: { label: 'Processing', color: '#0ea5e9' },
  shipped: { label: 'Shipped', color: '#6366f1' },
  delivered: { label: 'Delivered', color: '#0d9488' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
};

export function OrdersByStatusChart({
  data,
}: {
  data: OrdersByStatusDatum[];
}) {
  const chartData = data.map((datum) => ({
    ...datum,
    label: STATUS_DETAILS[datum.status].label,
    color: STATUS_DETAILS[datum.status].color,
  }));
  const total = chartData.reduce((sum, datum) => sum + datum.count, 0);

  return (
    <article className='min-w-0 rounded-2xl border border-teal-100 bg-white p-5 shadow-sm sm:p-6'>
      <div>
        <h3 className='text-lg font-bold text-teal-950'>Orders by status</h3>
        <p className='mt-1 text-sm text-slate-500'>Current distribution of all orders</p>
      </div>

      {total > 0 ? (
        <>
          <div
            className='relative mt-4 h-72 w-full'
            role='img'
            aria-label={`Donut chart showing ${total} orders grouped by status`}
          >
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart accessibilityLayer>
                <Pie
                  data={chartData}
                  dataKey='count'
                  nameKey='label'
                  cx='50%'
                  cy='50%'
                  innerRadius={62}
                  outerRadius={98}
                  paddingAngle={2}
                  stroke='white'
                  strokeWidth={3}
                >
                  {chartData.map((datum) => (
                    <Cell key={datum.status} fill={datum.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [Number(value), 'Orders']}
                  contentStyle={{
                    borderColor: '#ccfbf1',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgb(15 118 110 / 0.12)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center'>
              <span className='text-3xl font-bold text-teal-950'>{total}</span>
              <span className='text-xs font-semibold uppercase tracking-wide text-slate-500'>
                Orders
              </span>
            </div>
          </div>

          <ul className='mt-2 grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3'>
            {chartData.map((datum) => (
              <li key={datum.status} className='flex min-w-0 items-center gap-2'>
                <span
                  className='h-2.5 w-2.5 shrink-0 rounded-full'
                  style={{ backgroundColor: datum.color }}
                  aria-hidden='true'
                />
                <span className='truncate text-slate-600'>{datum.label}</span>
                <span className='ml-auto font-bold text-teal-950'>{datum.count}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ChartEmptyState message='No orders are available for this chart yet.' />
      )}
    </article>
  );
}

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className='mt-5 flex h-72 items-center justify-center rounded-xl border border-dashed border-teal-200 bg-teal-50 px-6 text-center'>
      <p className='text-sm font-semibold text-teal-800'>{message}</p>
    </div>
  );
}
