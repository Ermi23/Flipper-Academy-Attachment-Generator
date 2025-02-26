<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\LoginRequest;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    // public function store(LoginRequest $request): Response
    // {
    //     $request->authenticate();

    //     $request->session()->regenerate();

    //     return response()->noContent();
    // }

    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $user = $request->user();

        // Generate token
        $token = $user->createToken('API Token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    // public function store(Request $request)
    // {
    //     // Validate user credentials
    //     if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
    //         $user = Auth::user();

    //         // Create a new API token for the user
    //         $token = $user->createToken('YourAppName')->plainTextToken;

    //         return response()->json([
    //             'message' => 'Successfully logged in',
    //             'token' => $token,
    //         ]);
    //     }

    //     return response()->json(['message' => 'Invalid credentials'], 401);
    // }

    // public function store(LoginRequest $request)
    // {
    //     // Attempt authentication
    //     $request->authenticate();

    //     // Create a Sanctum token for the authenticated user
    //     $user = Auth::user();
    //     $token = $user->createToken('API Token')->plainTextToken;

    //     // Return the token and user details in the response
    //     return response()->json([
    //         'message' => 'Login successful',
    //         'token' => $token,
    //         'user' => $user, // Optional: Remove if you don't want to include user details
    //     ], 200);
    // }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): Response
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return response()->noContent();
    }
}
