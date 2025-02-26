<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schools', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('name'); // School name
            $table->string('address'); // School address
            $table->string('contact_email')->nullable(); // School contact email
            $table->string('phone_number_1'); // Primary phone number
            $table->string('phone_number_2')->nullable(); // Secondary phone number
            $table->string('company_image')->nullable(); // Logo or image of the school
            $table->string('company_website')->nullable(); // School website URL
            $table->string('tin')->nullable(); // Tax Identification Number (TIN)
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};
