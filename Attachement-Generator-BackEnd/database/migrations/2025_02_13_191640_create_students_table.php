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
        Schema::create('students', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('school_number')->unique(); // Unique student ID within the school
            $table->string('first_name'); // Student's first name
            $table->string('father_name'); // Student's father's name
            $table->string('last_name'); // Student's last name
            $table->string('grade_level'); // Grade level (e.g., Grade 5)
            $table->string('parent_name'); // Parent or guardian's name
            $table->string('parent_email')->nullable(); // Parent or guardian's email
            $table->string('parent_phone_number')->nullable();; // Parent or guardian's phone number
            $table->string('student_address')->nullable(); // Student's address
            $table->foreignId('school_id')->constrained()->onDelete('cascade'); // Foreign key to schools table
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
