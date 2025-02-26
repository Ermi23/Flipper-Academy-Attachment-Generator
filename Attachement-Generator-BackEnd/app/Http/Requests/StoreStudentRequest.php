<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStudentRequest extends FormRequest
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
            'school_number' => 'required|string|max:50|unique:students,school_number',
            'first_name' => 'required|string|max:100',
            'father_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'grade_level' => 'required|string|max:50',
            'parent_name' => 'required|string|max:255',
            'parent_email' => 'nullable|email|max:255',
            'parent_phone_number' => 'required|string|max:20',
            'student_address' => 'nullable|string|max:255',
            'school_id' => 'required|exists:schools,id',
        ];
    }
}
