<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFeeStructureRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:100',
            'amount' => 'sometimes|numeric|min:0',
            'grade_level' => 'sometimes|string|max:50',
            'school_id' => 'sometimes|exists:schools,id',
            'academic_calendar_id' => 'sometimes|exists:academic_calendars,id',
        ];
    }
}
