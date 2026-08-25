<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminOverviewController extends Controller
{
    private const TREND_DAYS = 14;

    /**
     * Display the aggregated admin dashboard data.
     */
    public function show(Request $request): JsonResponse
    {
        abort_unless(
            $request->user()?->role === User::ROLE_ADMIN,
            403,
            'Only administrators can view dashboard statistics.'
        );

        $statusCounts = Order::query()
            ->select('status', DB::raw('COUNT(*) as aggregate'))
            ->groupBy('status')
            ->pluck('aggregate', 'status');

        $startDate = CarbonImmutable::today()->subDays(self::TREND_DAYS - 1);
        $dailyRows = Order::query()
            ->where('created_at', '>=', $startDate->startOfDay())
            ->where('status', '!=', Order::STATUS_CANCELLED)
            ->selectRaw(
                'DATE(created_at) as order_date, COUNT(*) as orders_count, COALESCE(SUM(total_price), 0) as revenue'
            )
            ->groupBy('order_date')
            ->orderBy('order_date')
            ->get()
            ->keyBy('order_date');

        $revenueOverTime = collect(range(0, self::TREND_DAYS - 1))
            ->map(function (int $offset) use ($startDate, $dailyRows): array {
                $date = $startDate->addDays($offset);
                $row = $dailyRows->get($date->toDateString());

                return [
                    'date' => $date->toDateString(),
                    'label' => $date->format('d M'),
                    'orders' => (int) ($row?->orders_count ?? 0),
                    'revenue' => round((float) ($row?->revenue ?? 0), 2),
                ];
            });

        return response()->json([
            'data' => [
                'summary' => [
                    'customers' => User::query()
                        ->where('role', User::ROLE_USER)
                        ->count(),
                    'products' => Product::query()->count(),
                    'orders' => Order::query()->count(),
                    'revenue' => round((float) Order::query()
                        ->where('status', '!=', Order::STATUS_CANCELLED)
                        ->sum('total_price'), 2),
                ],
                'orders_by_status' => collect(Order::STATUSES)
                    ->map(fn (string $status): array => [
                        'status' => $status,
                        'count' => (int) ($statusCounts->get($status) ?? 0),
                    ])
                    ->values(),
                'revenue_over_time' => $revenueOverTime,
            ],
        ]);
    }
}
