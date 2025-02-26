<?php

namespace App\Http\Controllers;

use App\Models\Vat;
use App\Models\Receipt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\FeeStructureStudent;
use App\Http\Resources\ReceiptResource;
use Illuminate\Database\QueryException;
use App\Http\Requests\StoreReceiptRequest;
use App\Http\Requests\UpdateReceiptRequest;

class ReceiptController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $Receipt = Receipt::when($search, function ($query, $search) {
            return $query->where(function ($query) use ($search) {
                $query->where('receipt_no', 'like', "%{$search}%");
            });
        })
            ->latest()
            ->paginate($perPage);

        return ReceiptResource::collection($Receipt);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReceiptRequest $request)
    {
        // Find the VAT with status = 1
        $vat = Vat::where('status', 1)->first();

        if (!$vat) {
            return response()->json(['error' => 'No active VAT found.'], 400);
        }

        // Check for unused receipts and delete them
        $unusedReceipts = Receipt::doesntHave('receiptFees')->get();
        foreach ($unusedReceipts as $unusedReceipt) {
            $unusedReceipt->delete();
        }

        // Create a new Receipt instance
        $receipt = new Receipt();

        // Set the VAT ID
        $receipt->vat_id = $vat->id;

        // Save the receipt
        $receipt->save();

        return new ReceiptResource($receipt);
    }

    /**
     * Display the specified resource.
     */
    public function show(Receipt $receipt)
    {
        return new ReceiptResource($receipt);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReceiptRequest $request, Receipt $receipt)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Receipt $receipt)
    {
        try {
            DB::transaction(function () use ($receipt) {
                // Get all receipt fees related to this receipt
                $receiptFees = $receipt->receiptFees()->get();

                foreach ($receiptFees as $receiptFee) {
                    // Delete related FeeStructureStudent records
                    FeeStructureStudent::where('id', $receiptFee->fee_structure_students_id)->delete();
                }

                // Now delete all receipt fees
                $receipt->receiptFees()->delete();

                // Finally, delete the receipt itself
                $receipt->delete();
            });

            return response()->json(['message' => 'Receipt No deleted successfully']);
        } catch (QueryException $exception) {
            if ($exception->getCode() == 23000) {
                return response()->json([
                    'message' => 'This data cannot be deleted because it is linked to other data in the system. Please remove those links before deleting this data.'
                ], 403);
            }
            throw $exception;
        }
    }
}
