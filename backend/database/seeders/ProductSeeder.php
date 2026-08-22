<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Xiaomi Electric Scooter 4 Pro (2nd Gen)',
                'description' => 'A powerful urban electric scooter with up to 1000 W of maximum power, a range of up to 60 km, a top speed of 25 km/h, and wide 10-inch tubeless tires.',
                'price' => 699.99,
                'stock_quantity' => 12,
                'image_url' => 'https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-electric-scooter-4-pro-2nd-gen/PC/66dd84e7a74fc964901a1ab9eac5714c.png',
            ],
            [
                'name' => 'Segway Ninebot MAX G2 E',
                'description' => 'A comfortable long-range electric scooter with up to 70 km of range, 900 W of maximum power, front and rear suspension, traction control, and integrated turn indicators.',
                'price' => 899.99,
                'stock_quantity' => 8,
                'image_url' => 'https://s7ap1.scene7.com/is/image/ninebotstage/assets_segway_cdn_com_Product-Pictures__product_full_MAX-G2-1?dpr=on%2C3&fmt=png-alpha&network=on',
            ],
            [
                'name' => 'NIU KQi3 Max',
                'description' => 'A premium urban electric scooter with up to 900 W of maximum motor power, approximately 65 km of range, dual disc brakes, and 9.5-inch self-healing tires.',
                'price' => 999.00,
                'stock_quantity' => 6,
                'image_url' => 'https://shop.niu.com/cdn/shop/files/KQi3_Max.png?v=1773998080&width=1600',
            ],
            [
                'name' => 'Pure Flex',
                'description' => 'An ultra-compact folding electric scooter with a natural forward-facing riding position, up to 52 km of range, 924 W of maximum power, and active steering stabilization.',
                'price' => 899.00,
                'stock_quantity' => 5,
                'image_url' => 'https://www.pureelectric.com/cdn/shop/files/pure-scooter-flex-1238469009.jpg?v=1778803399&width=3840',
            ],
            [
                'name' => 'INOKIM OXO 2026',
                'description' => 'A high-performance electric scooter with dual 1000 W motors, up to 110 km of range, adjustable dual suspension, and front and rear hydraulic disc brakes.',
                'price' => 3499.00,
                'stock_quantity' => 3,
                'image_url' => 'https://inokim.com/cdn/shop/files/carbon_01_d41db245-891a-4963-9d03-15ebaf02147a_819x.jpg?v=1742141079',
            ],
        ];

        foreach ($products as $product) {
            Product::query()->updateOrCreate(
                ['name' => $product['name']],
                $product
            );
        }
    }
}
