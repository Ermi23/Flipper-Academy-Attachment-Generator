<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStudentRequest extends FormRequest
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
            'school_number' => 'sometimes|string|max:50|unique:students,school_number,' . $this->student->id,
            'first_name' => 'sometimes|string|max:100',
            'father_name' => 'sometimes|string|max:100',
            'last_name' => 'sometimes|string|max:100',
            'grade_level' => 'sometimes|string|max:50',
            'parent_name' => 'sometimes|string|max:255',
            'parent_email' => 'nullable|email|max:255',
            'parent_phone_number' => 'sometimes|string|max:20',
            'student_address' => 'nullable|string|max:255',
            'school_id' => 'sometimes|exists:schools,id',
        ];
    }
}
