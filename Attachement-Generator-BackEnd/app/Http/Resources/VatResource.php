<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VatResource extends JsonResource
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
            'percentage' => $this->percentage,
            'status' => $this->status === 1 ? "Active" : "Inactive", // Use strict comparison
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
