<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );

        // assign role (idempotent)
        $admin->syncRoles('Admin');
    }
}
