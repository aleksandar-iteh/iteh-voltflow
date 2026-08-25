<?php

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

it('allows an administrator to list users with their order counts', function (): void {
    $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);
    $customer = User::factory()->create(['role' => User::ROLE_USER]);

    Order::factory()->count(2)->for($customer)->create();

    Sanctum::actingAs($admin);

    $this->getJson('/api/admin/users')
        ->assertOk()
        ->assertJsonFragment([
            'id' => $customer->id,
            'orders_count' => 2,
        ]);
});

it('prevents a regular user from listing users', function (): void {
    $customer = User::factory()->create(['role' => User::ROLE_USER]);

    Sanctum::actingAs($customer);

    $this->getJson('/api/admin/users')
        ->assertForbidden()
        ->assertJsonPath('message', 'Only administrators can view users.');
});
