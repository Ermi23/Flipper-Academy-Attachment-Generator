<?php

namespace App\Http\Controllers;

use App\Models\Vat;
use Illuminate\Http\Request;
use App\Http\Resources\VatResource;
use App\Http\Requests\StoreVatRequest;
use App\Http\Requests\UpdateVatRequest;
use Illuminate\Database\QueryException;

class VatController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $Vats = Vat::when($search, function ($query, $search) {
            return $query->where(function ($query) use ($search) {
                $query->where('percentage', 'like', "%{$search}%");
            });
        })
            ->latest()
            ->paginate($perPage);

        return VatResource::collection($Vats);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVatRequest $request)
    {
        // Set status to 1 for the new record
        $data = $request->validated(); // Use validated data
        $data['status'] = 1;

        // Update existing records with status = 1 to status = 0
        Vat::where('status', 1)->update(['status' => 0]);

        // Create the new VAT record
        $vat = Vat::create($data);

        return new VatResource($vat);
    }

    /**
     * Display the specified resource.
     */
    public function show(Vat $vat)
    {
        return new VatResource($vat);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVatRequest $request, Vat $vat)
    {
        // Get the validated data
        $data = $request->validated();

        if ($data['status'] == 1) {
            // Update existing records with status = 1 to status = 0
            Vat::where('status', 1)->update(['status' => 0]);
        }

        // Update the VAT record, including the status
        $vat->update($data);

        return new VatResource($vat);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vat $vat)
    {
        try {
            $vat->delete();
            return response()->json(['message' => 'Vat deleted successfully']);
        } catch (QueryException $exception) {
            if ($exception->getCode() == 23000) {
                return response()->json(['message' => 'This data cannot be deleted because it is linked to other data in the system. Please remove those links before deleting this data.'], 403);
            }
            throw $exception;
        }
    }
}
