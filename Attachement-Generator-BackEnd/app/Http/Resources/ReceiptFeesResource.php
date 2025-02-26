<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReceiptFeesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'receipt_id' => $this->receipt_id,
            'receipt' => new ReceiptResource($this->whenLoaded('receipt')), // Include the related VAT resource
            'fee_structure_student_id' => $this->fee_structure_student_id,
            'Student_Fees' => new FeeStructureStudentResource($this->whenLoaded('feeStructureStudent')),
            'updated_at' => $this->updated_at,
        ];
    }
}
