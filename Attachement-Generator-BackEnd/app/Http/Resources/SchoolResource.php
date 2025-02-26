<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SchoolResource extends JsonResource
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
            'name' => $this->name,
            'address' => $this->address,
            'contact_email' => $this->contact_email,
            'phone_number_1' => $this->phone_number_1,
            'phone_number_2' => $this->phone_number_2,
            'company_image' => $this->company_image,
            'company_website' => $this->company_website,
            'tin' => $this->tin,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'students' => StudentResource::collection($this->whenLoaded('students')),
            'fee_structures' => FeeStructureResource::collection($this->whenLoaded('feeStructures')),
        ];
    }
}
