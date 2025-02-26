<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'id' => 1,
            'name' => 'Habteyes Asfaw',
            'email' => 'habteyes.asfaw@hst-et.com',
            'password' => Hash::make('Password.01'),
        ]);

        User::factory()->create([
            'id' => 2,
            'name' => 'Ermias Tadesser',
            'email' => 'ermias.tadesse@hst-et.com',
            'password' => Hash::make('Password.01'),
        ]);

        // Call the individual seeders
        $this->call([
            SchoolSeeder::class,
            // TaskSeeder::class,
            // TaskListShareSeeder::class,
        ]);
    }
}
