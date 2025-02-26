<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeeStructureStudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'fee_structure_id' => $this->fee_structure_id,
            'fee_structure' => new FeeStructureResource($this->whenLoaded('feeStructure')),
            'student_id' => $this->student_id,
            'student' => new StudentResource($this->whenLoaded('student')),
            'quantity' => $this->quantity,
            'total_amount' => (float) $this->total_amount, // Ensure it's a float
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
