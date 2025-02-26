<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    /** @use HasFactory<\Database\Factories\SchoolFactory> */
    use HasFactory;

    // Fillable attributes
    protected $fillable = [
        'name',
        'address',
        'contact_email',
        'phone_number_1',
        'phone_number_2',
        'company_image',
        'company_website',
        'tin',
    ];

    // Relationships
    public function students()
    {
        return $this->hasMany(Student::class);
    }

    public function feeStructures()
    {
        return $this->hasMany(FeeStructure::class);
    }
}
