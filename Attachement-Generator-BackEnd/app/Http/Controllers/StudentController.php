<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use App\Imports\StudentsImport;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Resources\StudentResource;
use Illuminate\Database\QueryException;
use App\Http\Requests\StoreStudentRequest;
use App\Http\Requests\UpdateStudentRequest;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $students = Student::with('school')
            ->when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('school_number', 'like', "%{$search}%")
                        ->orWhere('school_number', 'like', "%{$search}%")
                        ->orWhere('school_number', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($perPage);
        return StudentResource::collection($students);
    }

    public function DropDownIndex(Request $request)
    {
        $students = Student::all();

        return StudentResource::collection($students);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStudentRequest $request)
    {
        $student = Student::create($request->all());
        $student->load('school');
        return new StudentResource($student);
    }

    /**
     * Display the specified resource.
     */
    public function show(Student $student)
    {
        $student->load('school');
        return new StudentResource($student);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStudentRequest $request, Student $student)
    {
        $student->update($request->all());
        return new StudentResource($student);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Student $student)
    {
        try {
            $student->delete();
            return response()->json(['message' => 'Student deleted successfully']);
        } catch (QueryException $exception) {
            if ($exception->getCode() == 23000) {
                return response()->json(['message' => 'This data cannot be deleted because it is linked to other data in the system. Please remove those links before deleting this data.'], 403);
            }
            throw $exception;
        }
    }

    // Download the template
    public function downloadTemplate()
    {
        $filePath = storage_path('app/public/student_template.xlsx');
        return response()->download($filePath, 'student_template.xlsx');
    }

    // Import student data
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:xlsx,xls',
        ]);

        Excel::import(new StudentsImport, $request->file('file'));

        return response()->json(['message' => 'Students imported successfully'], 200);
    }
}
