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
        Schema::create('fee_structure_students', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->foreignId('fee_structure_id')->constrained()->onDelete('cascade'); // Foreign key to fee_structures table
            $table->foreignId('student_id')->constrained()->onDelete('cascade'); // Foreign key to students table
            $table->integer('quantity')->default(1); // Quantity of the fee item (e.g., 2 uniforms)
            $table->decimal('total_amount', 10, 2); // Total amount for the fee item (amount * quantity)
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_structure_students');
    }
};
