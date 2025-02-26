<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeStructure extends Model
{
    /** @use HasFactory<\Database\Factories\FeeStructureFactory> */
    use HasFactory;

    // Fillable attributes
    protected $fillable = [
        'name',
        'amount',
        'grade_level',
        'school_id',
        'academic_calendar_id',
    ];

    // Relationships
    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function academicCalendar()
    {
        return $this->belongsTo(AcademicCalendar::class);
    }

    public function students()
    {
        return $this->belongsToMany(Student::class, 'fee_structure_students')
            ->withPivot('quantity', 'total_amount')
            ->withTimestamps();
    }
}
