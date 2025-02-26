<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicCalendar extends Model
{
    /** @use HasFactory<\Database\Factories\AcademicCalendarFactory> */
    use HasFactory;

    // Fillable attributes
    protected $fillable = [
        'year',
        'term',
        'description',
    ];

    // Relationships
    public function feeStructures()
    {
        return $this->hasMany(FeeStructure::class);
    }
}
