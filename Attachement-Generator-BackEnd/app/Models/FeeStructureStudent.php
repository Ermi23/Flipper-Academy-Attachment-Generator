<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeStructureStudent extends Model
{
    /** @use HasFactory<\Database\Factories\FeeStructureStudentFactory> */
    use HasFactory;

    // Fillable attributes
    protected $fillable = [
        'fee_structure_id',
        'student_id',
        'quantity',
        'total_amount',
    ];

    // Relationships
    public function feeStructure()
    {
        return $this->belongsTo(FeeStructure::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
