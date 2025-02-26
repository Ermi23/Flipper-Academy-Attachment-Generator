<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeeStructureRequest extends FormRequest
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
            'name' => 'required|string|max:100',
            'amount' => 'required|numeric|min:0',
            'grade_level' => 'required|string|max:50',
            'school_id' => 'required|exists:schools,id',
            'academic_calendar_id' => 'required|exists:academic_calendars,id',
        ];
    }
}
