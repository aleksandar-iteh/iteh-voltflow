import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatPrice } from '../../lib/formatters';
import type { RevenueOverTimeDatum } from '../../types/models';

export function RevenueTrendChart({
  data,
}: {
  data: RevenueOverTimeDatum[];
}) {
  const totalRevenue = data.reduce((sum, datum) => sum + datum.revenue, 0);
  const totalOrders = data.reduce((sum, datum) => sum + datum.orders, 0);

  return (
    <article className='min-w-0 rounded-2xl border border-teal-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <h3 className='text-lg font-bold text-teal-950'>Revenue trend</h3>
          <p className='mt-1 text-sm text-slate-500'>Last 14 days · cancelled orders excluded</p>
        </div>
        <div className='sm:text-right'>
          <p className='text-xl font-bold text-teal-700'>{formatPrice(totalRevenue)}</p>
          <p className='mt-0.5 text-xs text-slate-500'>Across {totalOrders} orders</p>
        </div>
      </div>

      {totalRevenue > 0 ? (
        <div
          className='mt-6 h-80 w-full'
          role='img'
          aria-label={`Area chart showing ${formatPrice(totalRevenue)} revenue during the last 14 days`}
        >
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={data}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              accessibilityLayer
            >
              <defs>
                <linearGradient id='adminRevenueGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor='#0d9488' stopOpacity={0.35} />
                  <stop offset='95%' stopColor='#0d9488' stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke='#ccfbf1' strokeDasharray='4 4' vertical={false} />
              <XAxis
                dataKey='label'
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickMargin={10}
                interval='preserveStartEnd'
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={compactCurrency}
                width={58}
              />
              <Tooltip
                formatter={(value) => [formatPrice(Number(value)), 'Revenue']}
                labelFormatter={(label) => String(label)}
                contentStyle={{
                  borderColor: '#ccfbf1',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgb(15 118 110 / 0.12)',
                }}
              />
              <Area
                type='monotone'
                dataKey='revenue'
                stroke='#0d9488'
                strokeWidth={3}
                fill='url(#adminRevenueGradient)'
                activeDot={{ r: 5, fill: '#0d9488', stroke: 'white', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className='mt-6 flex h-80 items-center justify-center rounded-xl border border-dashed border-teal-200 bg-teal-50 px-6 text-center'>
          <p className='text-sm font-semibold text-teal-800'>
            No non-cancelled order revenue is available for this period.
          </p>
        </div>
      )}
    </article>
  );
}

function compactCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}
