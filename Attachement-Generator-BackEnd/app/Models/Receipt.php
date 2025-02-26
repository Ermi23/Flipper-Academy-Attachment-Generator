<?php

namespace App\Models;

use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Receipt extends Model
{
    /** @use HasFactory<\Database\Factories\ReceiptFactory> */
    use HasFactory;

    protected $fillable = ['vat_id'];

    // Accessor to format receipt_no as an 8-character alphanumeric string
    public function getFormattedReceiptNoAttribute()
    {
        return strtoupper($this->receipt_no);
    }

    public static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Generate a unique 8-character alphanumeric string
            $model->receipt_no = strtoupper(Str::random(8));
        });
    }

    public function receiptFees()
    {
        return $this->hasMany(ReceiptFee::class);
    }

    public function vat()
    {
        return $this->belongsTo(Vat::class);
    }
}
