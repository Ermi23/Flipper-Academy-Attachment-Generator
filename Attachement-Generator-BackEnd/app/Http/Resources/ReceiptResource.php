<?php

namespace App\Http\Resources;

use DateTime;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceiptResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $createdAt = new DateTime($this->created_at);
        $formattedDate = $createdAt->format('F j, Y, g:i a'); // Example: February 24, 2025, 6:31 pm
        return [
            'id' => $this->id,
            'receipt_no' => $this->receipt_no,
            'vat_id' => $this->vat_id,
            'vat' => new VatResource($this->vat), // Include the related VAT resource
            'receipt_Fees' => new ReceiptFeesResource($this->receipt_Fees), // Include the related VAT resource
            'created_at' => $formattedDate,
            'updated_at' => $this->updated_at,
        ];
    }
}
