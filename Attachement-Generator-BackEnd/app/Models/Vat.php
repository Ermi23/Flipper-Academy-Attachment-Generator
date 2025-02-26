<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vat extends Model
{
    /** @use HasFactory<\Database\Factories\VatFactory> */
    use HasFactory;

    protected $fillable = [
        'percentage',
        'status',
    ];

    public function receipts()
    {
        return $this->hasMany(Receipt::class);
    }
}
