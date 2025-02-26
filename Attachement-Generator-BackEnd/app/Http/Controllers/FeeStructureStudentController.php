<?php

namespace App\Http\Controllers;

use App\Models\Receipt;
use App\Models\ReceiptFee;
use App\Models\FeeStructure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\FeeStructureStudent;
use App\Http\Resources\FeeStructureStudentResource;
use App\Http\Requests\StoreFeeStructureStudentRequest;
use App\Http\Requests\UpdateFeeStructureStudentRequest;

class FeeStructureStudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $feeStructureStudents = FeeStructureStudent::when($search, function ($query, $search) {
            return $query->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        })
            ->latest()
            ->paginate($perPage);

        // Load the relationships
        $feeStructureStudents->load(['feeStructure', 'student']);

        return FeeStructureStudentResource::collection($feeStructureStudents);
    }

    public function indexByReceipt(Request $request, Receipt $receipt_id)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $receipt = Receipt::findOrFail($receipt_id->id);

        $receiptfee = ReceiptFee::where('receipt_id', $receipt->id)->get();

        // Query the FeeStructureStudent and paginate the results
        $feeStructureStudents = FeeStructureStudent::whereIn('id', $receiptfee->pluck('fee_structure_students_id'))
            ->when($search, function ($query, $search) {
                return $query->where(function ($query) use ($search) {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->get(); // Fetch the data

        $feeStructureStudents->load(['feeStructure', 'student']); // Now load relationships


        return FeeStructureStudentResource::collection($feeStructureStudents);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFeeStructureStudentRequest $request)
    {
        // Start a database transaction
        return DB::transaction(function () use ($request) {
            // Find the fee structure by ID
            $feeStructure = FeeStructure::findOrFail($request->fee_structure_id);

            // Calculate the total amount
            $totalAmount = $request->quantity * $feeStructure->amount;

            // Create the FeeStructureStudent with the calculated amount
            $feeStructureStudent = FeeStructureStudent::create(array_merge($request->all(), [
                'total_amount' => $totalAmount, // Save the calculated total amount
            ]));

            // Create a record in the ReceiptFee model directly
            ReceiptFee::create([
                'receipt_id' => $request->receipt_id, // Ensure this is the correct ID
                'fee_structure_students_id' => $feeStructureStudent->id,
            ]);

            // Load the relationships
            $feeStructureStudent->load(['feeStructure', 'student']);

            // Return the resource for the created FeeStructureStudent
            return new FeeStructureStudentResource($feeStructureStudent);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(FeeStructureStudent $feeStructureStudent)
    {
        // Load the relationships
        $feeStructureStudent->load(['feeStructure', 'student']);
        return new FeeStructureStudentResource($feeStructureStudent);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateFeeStructureStudentRequest $request, FeeStructureStudent $feeStructureStudent)
    {
        // Find the fee structure by ID
        $feeStructure = FeeStructure::findOrFail($request->fee_structure_id);

        // Calculate the total amount
        $totalAmount = $request->quantity * $feeStructure->amount;

        // Update the FeeStructureStudent with the calculated amount
        $feeStructureStudent->update([
            'quantity' => $request->quantity, // Update quantity if needed
            'total_amount' => $totalAmount
        ]);

        // Load the relationships
        $feeStructureStudent->load(['feeStructure', 'student']);

        return new FeeStructureStudentResource($feeStructureStudent);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FeeStructureStudent $feeStructureStudent)
    {
        $feeStructureStudent->delete();
        return response()->json([
            'message' => 'The record deleted successfully',
        ], 200);
    }
}
