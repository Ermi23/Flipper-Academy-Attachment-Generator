<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateFeeStructureStudentRequest extends FormRequest
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
            'fee_structure_id' => 'sometimes|exists:fee_structures,id',
            'student_id' => 'sometimes|exists:students,id',
            'quantity' => 'sometimes|integer|min:1',
            'total_amount' => 'sometimes|numeric|min:0',
        ];
    }
}
