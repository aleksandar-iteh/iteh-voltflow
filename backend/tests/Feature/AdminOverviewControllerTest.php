<?php

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

afterEach(function (): void {
    CarbonImmutable::setTestNow();
});

it('returns aggregated dashboard statistics to an administrator', function (): void {
    CarbonImmutable::setTestNow('2026-08-25 12:00:00');

    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $customer = User::factory()->create(['role' => User::ROLE_USER]);
    Product::factory()->count(2)->create();

    Order::factory()->for($customer)->create([
        'status' => Order::STATUS_DELIVERED,
        'total_price' => 100,
        'created_at' => CarbonImmutable::now()->subDay(),
        'updated_at' => CarbonImmutable::now()->subDay(),
    ]);
    Order::factory()->for($customer)->create([
        'status' => Order::STATUS_CANCELLED,
        'total_price' => 50,
        'created_at' => CarbonImmutable::now(),
        'updated_at' => CarbonImmutable::now(),
    ]);

    Sanctum::actingAs($admin);

    $this->getJson('/api/admin/overview')
        ->assertOk()
        ->assertJsonPath('data.summary.customers', 1)
        ->assertJsonPath('data.summary.products', 2)
        ->assertJsonPath('data.summary.orders', 2)
        ->assertJsonPath('data.summary.revenue', 100)
        ->assertJsonPath('data.orders_by_status.3.status', Order::STATUS_DELIVERED)
        ->assertJsonPath('data.orders_by_status.3.count', 1)
        ->assertJsonPath('data.orders_by_status.4.status', Order::STATUS_CANCELLED)
        ->assertJsonPath('data.orders_by_status.4.count', 1)
        ->assertJsonPath('data.revenue_over_time.12.date', '2026-08-24')
        ->assertJsonPath('data.revenue_over_time.12.orders', 1)
        ->assertJsonPath('data.revenue_over_time.12.revenue', 100);
});

it('prevents a regular user from viewing dashboard statistics', function (): void {
    $customer = User::factory()->create(['role' => User::ROLE_USER]);

    Sanctum::actingAs($customer);

    $this->getJson('/api/admin/overview')
        ->assertForbidden()
        ->assertJsonPath(
            'message',
            'Only administrators can view dashboard statistics.'
        );
});
