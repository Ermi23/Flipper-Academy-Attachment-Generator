<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\Request;
use App\Http\Resources\SchoolResource;
use Illuminate\Database\QueryException;
use App\Http\Requests\StoreSchoolRequest;
use App\Http\Requests\UpdateSchoolRequest;

class SchoolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $schools = School::when($search, function ($query, $search) {
            return $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        })
            ->latest()
            ->paginate($perPage);

        return SchoolResource::collection($schools);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSchoolRequest $request)
    {
        $school = School::create($request->all());
        return new SchoolResource($school);
    }

    /**
     * Display the specified resource.
     */
    public function show(School $school)
    {
        return new SchoolResource($school);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSchoolRequest $request, School $school)
    {
        $school->update($request->all());
        return new SchoolResource($school);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(School $school)
    {
        try {
            $school->delete();
            return response()->json(['message' => 'School deleted successfully']);
        } catch (QueryException $exception) {
            if ($exception->getCode() == 23000) {
                return response()->json(['message' => 'This data cannot be deleted because it is linked to other data in the system. Please remove those links before deleting this data.'], 403);
            }
            throw $exception;
        }
    }
}
