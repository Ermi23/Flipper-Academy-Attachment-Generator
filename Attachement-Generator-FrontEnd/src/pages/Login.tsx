import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import imageSrc from '../assets/image.png';
import apiClient from '../api/axios';

const formSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string(),
});

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState(''); // State for error message

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(values: { email: string; password: string }) {
        setIsLoading(true); // Start the loading indicator
        setLoginError(''); // Reset the error message
        console.log('Logging in with:', values.email, values.password);

        try {
            // Fetch the CSRF cookie (required by Laravel Sanctum)
            await apiClient.get('/sanctum/csrf-cookie');

            // Send the login request
            const response = await apiClient.post('/login', {
                email: values.email,
                password: values.password,
            });

            // Store the Bearer token in local storage or state
            localStorage.setItem('token', response.data.token); // Adjust based on your response structure
            // Save user data to localStorage or a global state
            localStorage.setItem('user', JSON.stringify(response.data));

            // Redirect to dashboard after successful login
            window.location.href = '/dashboard';
        } catch (error: any) {
            setIsLoading(false);
            console.error('Login failed:', error.response?.data || error.message);

            // Set error message to state
            setLoginError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false); // Stop the loading indicator
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-center mb-4">
                    <img src={imageSrc} alt="Logo" className="rounded-full w-16 h-16" />
                </div>
                <h2 className="text-2xl font-bold text-center">Login to Your Account</h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {loginError && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md" role="alert">{loginError}</div>
                    )}
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            {...form.register('email')}
                            className="w-full p-2 border rounded"
                        />
                        {form.formState.errors.email && <p className="text-red-500">{form.formState.errors.email.message}</p>}
                    </div>
                    <div>
                        <label>Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                {...form.register('password')}
                                className="w-full p-2 border rounded"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-0 top-0 h-full px-3 py-2"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                            </button>
                        </div>
                        {form.formState.errors.password && <p className="text-red-500">{form.formState.errors.password.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full p-2 text-white rounded bg-orange-600/70 text-white font-semibold py-3 px-6 rounded-md shadow-md hover:bg-orange-700"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Logging in...' : 'Log in'}
                    </button>
                </form>
                <div className="flex flex-col space-y-4 mt-4 text-sm text-center text-gray-500">
                    <div>
                        Don't have an account?{' '}
                        <a href="/sign-up" className="font-semibold hover:text-blue-500">Sign up</a>
                    </div>
                </div>
            </div>
        </div>
    );
}