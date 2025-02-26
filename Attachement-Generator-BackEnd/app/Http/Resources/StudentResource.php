<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
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
            'school_number' => $this->school_number,
            'first_name' => $this->first_name,
            'father_name' => $this->father_name,
            'last_name' => $this->last_name,
            'grade_level' => $this->grade_level,
            'parent_name' => $this->parent_name,
            'parent_email' => $this->parent_email,
            'parent_phone_number' => $this->parent_phone_number,
            'student_address' => $this->student_address,
            'school_id' => $this->school_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'school' => new SchoolResource($this->whenLoaded('school')),
            'fee_structures' => FeeStructureResource::collection($this->whenLoaded('feeStructures')),
        ];
    }
}
