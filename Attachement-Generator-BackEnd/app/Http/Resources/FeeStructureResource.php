<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeeStructureResource extends JsonResource
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
            'amount' => $this->amount,
            'grade_level' => $this->grade_level,
            'school_id' => $this->school_id,
            'academic_calendar_id' => $this->academic_calendar_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'school' => new SchoolResource($this->whenLoaded('school')),
            'academic_calendar' => new AcademicCalendarResource($this->whenLoaded('academicCalendar')),
        ];
    }
}
