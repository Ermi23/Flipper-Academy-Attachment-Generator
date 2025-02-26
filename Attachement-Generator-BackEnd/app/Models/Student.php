<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use HasFactory;

    // Fillable attributes
    protected $fillable = [
        'school_number',
        'first_name',
        'father_name',
        'last_name',
        'grade_level',
        'parent_name',
        'parent_email',
        'parent_phone_number',
        'student_address',
        'school_id',
    ];

    // Relationships
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function feeStructures()
    {
        return $this->belongsToMany(FeeStructure::class, 'fee_structure_students')
            ->withPivot('quantity', 'total_amount')
            ->withTimestamps();
    }
}
