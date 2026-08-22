<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'VoltFlow Administrator',
                'email' => 'admin@voltflow.rs',
                'password' => Hash::make('password'),
                'role' => User::ROLE_ADMIN,
            ],
            [
                'name' => 'Marko Petrović',
                'email' => 'marko.petrovic@example.com',
                'password' => Hash::make('password'),
                'role' => User::ROLE_USER,
            ],
            [
                'name' => 'Ana Jovanović',
                'email' => 'ana.jovanovic@example.com',
                'password' => Hash::make('password'),
                'role' => User::ROLE_USER,
            ],
            [
                'name' => 'Nikola Ilić',
                'email' => 'nikola.ilic@example.com',
                'password' => Hash::make('password'),
                'role' => User::ROLE_USER,
            ],
        ];

        foreach ($users as $user) {
            User::query()->updateOrCreate(
                ['email' => $user['email']],
                $user
            );
        }
    }
}
