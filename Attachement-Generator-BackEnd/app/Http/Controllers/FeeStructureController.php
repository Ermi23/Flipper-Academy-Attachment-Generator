<?php

namespace App\Http\Controllers;

use App\Models\FeeStructure;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;
use App\Http\Resources\FeeStructureResource;
use App\Http\Requests\StoreFeeStructureRequest;
use App\Http\Requests\UpdateFeeStructureRequest;

class FeeStructureController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $feeStructures = FeeStructure::when($search, function ($query, $search) {
            return $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        })
            ->latest()
            ->paginate($perPage);

        // Load the relationships
        $feeStructures->load(['school', 'academicCalendar']);

        return FeeStructureResource::collection($feeStructures);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFeeStructureRequest $request)
    {
        $feeStructure = FeeStructure::create($request->all());
        // Load the relationships
        $feeStructure->load(['school', 'academicCalendar']);
        return new FeeStructureResource($feeStructure);
    }

    /**
     * Display the specified resource.
     */
    public function show(FeeStructure $feeStructure)
    {
        // Load the relationships
        $feeStructure->load(['school', 'academicCalendar']);
        return new FeeStructureResource($feeStructure);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFeeStructureRequest $request, FeeStructure $feeStructure)
    {
        $feeStructure->update($request->all());
        // Load the relationships
        $feeStructure->load(['school', 'academicCalendar']);
        return new FeeStructureResource($feeStructure);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FeeStructure $feeStructure)
    {
        try {
            $feeStructure->delete();
            return response()->json(['message' => 'Fee type deleted successfully']);
        } catch (QueryException $exception) {
            if ($exception->getCode() == 23000) {
                return response()->json(['message' => 'This data cannot be deleted because it is linked to other data in the system. Please remove those links before deleting this data.'], 403);
            }
            throw $exception;
        }
    }
}
