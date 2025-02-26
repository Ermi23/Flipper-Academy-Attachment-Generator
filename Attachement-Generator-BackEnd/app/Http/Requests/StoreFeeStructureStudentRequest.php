<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFeeStructureStudentRequest extends FormRequest
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
            'fee_structure_id' => 'required|exists:fee_structures,id',
            'student_id' => 'required|exists:students,id',
            'quantity' => 'required|integer|min:1',
            'receipt_id' => 'required|exists:receipts,id',
            // 'total_amount' => 'nullable|numeric|min:0',
        ];
    }
}
