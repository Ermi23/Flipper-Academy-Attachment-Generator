<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VatController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\ReceiptController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\FeeStructureController;
use App\Http\Controllers\AcademicCalendarController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\FeeStructureStudentController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

// Public Routes (No Authentication Required)

// Register a new user
Route::post('/register', [RegisteredUserController::class, 'store']);

// Log in and get an API token
Route::post('/login', [AuthenticatedSessionController::class, 'store']);

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);

// API Routes
Route::middleware(['auth:sanctum'])->group(function () {

    // Fetch authenticated user details
    Route::apiResource('users', UserController::class);

    // School Routes
    Route::apiResource('schools', SchoolController::class);

    // Student Routes
    Route::apiResource('students', StudentController::class);
    Route::get('students-dropdown', [StudentController::class, 'DropDownIndex']);
    // Route to download the template
    Route::get('students-template', [StudentController::class, 'downloadTemplate']);

    // Route to import student data
    Route::post('/students/import', [StudentController::class, 'import']);

    // Academic Calendar Routes
    Route::apiResource('academic-calendars', AcademicCalendarController::class);

    // Fee Structure Routes
    Route::apiResource('fee-structures', FeeStructureController::class);

    // Fee Structure Student Routes
    Route::apiResource('fee-structure-students', FeeStructureStudentController::class);
    Route::get('/fee-structure-students-by-receipt/{receipt_id}', [FeeStructureStudentController::class, 'indexByReceipt']);

    // Vat Routes
    Route::apiResource('vats', VatController::class);

    // Reciept Routes
    Route::apiResource('receipts', ReceiptController::class);
});
