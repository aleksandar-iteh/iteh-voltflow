<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class OrderItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (OrderSeeder::DEMO_ORDERS as $orderData) {
            $user = User::query()
                ->where('email', $orderData['user_email'])
                ->firstOrFail();

            $order = Order::query()
                ->where('user_id', $user->id)
                ->where('shipping_address', $orderData['shipping_address'])
                ->firstOrFail();

            foreach ($orderData['items'] as $productName => $quantity) {
                $product = Product::query()
                    ->where('name', $productName)
                    ->firstOrFail();

                OrderItem::query()->updateOrCreate(
                    [
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                    ],
                    [
                        'quantity' => $quantity,
                        'unit_price' => $product->price,
                    ]
                );
            }
        }
    }
}
