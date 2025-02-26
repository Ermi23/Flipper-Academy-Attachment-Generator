<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AcademicCalendar;
use Illuminate\Database\QueryException;
use App\Http\Resources\AcademicCalendarResource;
use App\Http\Requests\StoreAcademicCalendarRequest;
use App\Http\Requests\UpdateAcademicCalendarRequest;

class AcademicCalendarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $calendars = AcademicCalendar::when($search, function ($query, $search) {
            return $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        })
            ->latest()
            ->paginate($perPage);
        return AcademicCalendarResource::collection($calendars);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAcademicCalendarRequest $request)
    {
        $calendar = AcademicCalendar::create($request->all());
        return new AcademicCalendarResource($calendar);
    }

    /**
     * Display the specified resource.
     */
    public function show(AcademicCalendar $academicCalendar)
    {
        return new AcademicCalendarResource($academicCalendar);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAcademicCalendarRequest $request, AcademicCalendar $academicCalendar)
    {
        $academicCalendar->update($request->all());
        return new AcademicCalendarResource($academicCalendar);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AcademicCalendar $academicCalendar)
    {
        try {
            $academicCalendar->delete();
            return response()->json(['message' => 'Academic calendar deleted successfully']);
        } catch (QueryException $exception) {
            if ($exception->getCode() == 23000) {
                return response()->json(['message' => 'This data cannot be deleted because it is linked to other data in the system. Please remove those links before deleting this data.'], 403);
            }
            throw $exception;
        }
    }
}
