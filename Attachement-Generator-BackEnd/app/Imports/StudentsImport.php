<?php

namespace App\Imports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class StudentsImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Student([
            'school_number' => $row['school_number'],
            'first_name' => $row['first_name'],
            'father_name' => $row['father_name'],
            'last_name' => $row['last_name'],
            'grade_level' => $row['grade_level'],
            'parent_name' => $row['parent_name'],
            'parent_email' => $row['parent_email'],
            'parent_phone_number' => $row['parent_phone_number'],
            'student_address' => $row['student_address'],
        ]);
    }
}
