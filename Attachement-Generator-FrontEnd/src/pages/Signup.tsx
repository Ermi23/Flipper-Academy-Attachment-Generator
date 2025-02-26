import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';
import imageSrc from '../assets/image.png';

// Schema for password validation
const passwordSchema = z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' });

// Form schema
const formSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters long' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: passwordSchema,
    confirmPassword: z.string(),
    agreeTerms: z.boolean().refine(value => value === true, {
        message: 'You must agree to the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export default function SignupPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false,
        },
    });

    async function onSubmit(values: any) {
        setIsLoading(true);
        console.log(values); // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        // Redirect to dashboard or login page
        window.location.href = '/';
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-center mb-4">
                    <img
                        src={imageSrc}
                        alt="Logo"
                        className="rounded-full w-16 h-16"
                    />
                </div>
                <h2 className="text-2xl font-bold text-center">Create an Account</h2>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            {...form.register('fullName')}
                            className="w-full p-2 border rounded"
                        />
                        {form.formState.errors.fullName && (
                            <p className="text-red-500">{form.formState.errors.fullName.message}</p>
                        )}
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            {...form.register('email')}
                            className="w-full p-2 border rounded"
                        />
                        {form.formState.errors.email && (
                            <p className="text-red-500">{form.formState.errors.email.message}</p>
                        )}
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
                        {form.formState.errors.password && (
                            <p className="text-red-500">{form.formState.errors.password.message}</p>
                        )}
                    </div>
                    <div>
                        <label>Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                {...form.register('confirmPassword')}
                                className="w-full p-2 border rounded"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-0 top-0 h-full px-3 py-2"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4 text-gray-500" /> : <Eye className="h-4 w-4 text-gray-500" />}
                            </button>
                        </div>
                        {form.formState.errors.confirmPassword && (
                            <p className="text-red-500">{form.formState.errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            {...form.register('agreeTerms')}
                            className="h-4 w-4"
                        />
                        <label className="leading-none">
                            I agree to the{' '}
                            <a href="/terms" className="text-blue-500 hover:underline">terms and conditions</a>
                        </label>
                        {form.formState.errors.agreeTerms && (
                            <p className="text-red-500">{form.formState.errors.agreeTerms.message}</p>
                        )}
                    </div>
                    <button type="submit" className="w-full p-2 text-white rounded bg-orange-600/70 text-white font-semibold py-3 px-6 rounded-md shadow-md hover:bg-orange-700" disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>
                <div className="text-sm text-center text-gray-500 mt-4">
                    Already have an account?{' '}
                    <a href="/login" className="font-semibold text-blue-500 hover:underline">Log in</a>
                </div>
            </div>
        </div>
    );
}