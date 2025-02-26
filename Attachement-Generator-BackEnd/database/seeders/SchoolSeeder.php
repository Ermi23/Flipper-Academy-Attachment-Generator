<?php

namespace Database\Seeders;

use App\Models\School;
use Illuminate\Database\Seeder;

class SchoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        School::create([
            'name' => 'Greenwood High School',
            'address' => '123 Elm Street, Springfield, IL 62704',
            'contact_email' => 'info@greenwoodhigh.edu',
            'phone_number_1' => '251-923-456744',
            'phone_number_2' => '251-987-654333',
            'company_image' => 'greenwood_high_logo.png',
            'company_website' => 'https://www.greenwoodhigh.edu',
            'tin' => '12-3456789',
        ]);
    }
}
