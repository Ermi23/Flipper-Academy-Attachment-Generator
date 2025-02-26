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
        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('name'); // Fee name (e.g., Tuition Fee, Uniform Fee)
            $table->decimal('amount', 10, 2); // Fee amount
            $table->string('grade_level'); // Grade level (e.g., Grade 5)
            $table->foreignId('school_id')->constrained()->onDelete('cascade'); // Foreign key to schools table
            $table->foreignId('academic_calendar_id')->constrained()->onDelete('cascade'); // Foreign key to academic_calendars table
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_structures');
    }
};
