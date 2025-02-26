<?php

use Illuminate\Support\Facades\Route;

// Root endpoint for debugging
Route::get('/', function () {
    return response()->json(['message' => 'Invalid Route, please check it again'], 200);
});
