<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReceiptFee extends Model
{
    /** @use HasFactory<\Database\Factories\ReceiptFeeFactory> */
    use HasFactory;

    protected $table = 'receipt_fees';

    protected $fillable = [
        'receipt_id',
        'fee_structure_students_id',
    ];

    public function receipt()
    {
        return $this->belongsTo(Receipt::class);
    }

    public function feeStructureStudent()
    {
        return $this->belongsTo(FeeStructureStudent::class);
    }
}
