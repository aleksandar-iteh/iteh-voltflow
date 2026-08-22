<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public const DEMO_ORDERS = [
        [
            'user_email' => 'marko.petrovic@example.com',
            'status' => Order::STATUS_DELIVERED,
            'shipping_address' => 'Bulevar kralja Aleksandra 73, Beograd',
            'items' => [
                'Xiaomi Electric Scooter 4 Pro (2nd Gen)' => 1,
            ],
        ],
        [
            'user_email' => 'ana.jovanovic@example.com',
            'status' => Order::STATUS_PROCESSING,
            'shipping_address' => 'Bulevar oslobođenja 45, Novi Sad',
            'items' => [
                'Segway Ninebot MAX G2 E' => 1,
                'Pure Flex' => 1,
            ],
        ],
        [
            'user_email' => 'nikola.ilic@example.com',
            'status' => Order::STATUS_SHIPPED,
            'shipping_address' => 'Obrenovićeva 18, Niš',
            'items' => [
                'NIU KQi3 Max' => 1,
            ],
        ],
    ];

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (self::DEMO_ORDERS as $orderData) {
            $user = User::query()
                ->where('email', $orderData['user_email'])
                ->firstOrFail();

            $totalPrice = 0;

            foreach ($orderData['items'] as $productName => $quantity) {
                $product = Product::query()
                    ->where('name', $productName)
                    ->firstOrFail();

                $totalPrice += (float) $product->price * $quantity;
            }

            Order::query()->updateOrCreate(
                [
                    'user_id' => $user->id,
                    'shipping_address' => $orderData['shipping_address'],
                ],
                [
                    'total_price' => round($totalPrice, 2),
                    'status' => $orderData['status'],
                ]
            );
        }
    }
}
