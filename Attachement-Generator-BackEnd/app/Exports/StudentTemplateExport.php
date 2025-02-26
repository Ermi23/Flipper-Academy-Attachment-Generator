<?php

namespace App\Exports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromCollection;

class StudentTemplateExport implements FromCollection
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Student::all();
    }
    public function headings(): array
    {
        return [
            'school_number',
            'first_name',
            'father_name',
            'last_name',
            'grade_level',
            'parent_name',
            'parent_email',
            'parent_phone_number',
            'student_address',
        ];
    }
}
