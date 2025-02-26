<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSchoolRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'phone_number_1' => 'required|string|max:20',
            'phone_number_2' => 'nullable|string|max:20',
            'company_image' => 'nullable|string|max:255',
            'company_website' => 'nullable|url|max:255',
            'tin' => 'nullable|string|max:20',
        ];
    }
}
