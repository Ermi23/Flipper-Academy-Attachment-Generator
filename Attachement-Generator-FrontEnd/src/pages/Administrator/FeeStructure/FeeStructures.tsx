"use client"

import { useState, useEffect } from 'react';
import apiClient from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from './../components/pagination'; // Import the Pagination component
import 'react-toastify/dist/ReactToastify.css';

interface FeeStructure {
    id: number;
    name: string;
    amount: number;
    grade_level: string;
    school_id: number;
    school: { id: number; name: string }; // Include school object
    academic_calendar_id: number;
    academic_calendar: { id: number; year: string }; // Include academic calendar object
    created_at: string;
    updated_at: string;
}

interface AcademicCalendar {
    id: number;
    year: string;
    term: string;
    description: string;
    created_at: string;
}

interface School {
    id: number;
    name: string;
    address: string;
    contact_email: string;
    phone_number_1: string;
    phone_number_2: string;
    company_image: string | null;
    company_website: string;
    tin: string;
    created_at: string;
    updated_at: string;
}

export default function FeeStructuresPage() {
    const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [academicCalendars, setAcademicCalendars] = useState<AcademicCalendar[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [paginationMeta, setPaginationMeta] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [currentFeeStructure, setCurrentFeeStructure] = useState({
        id: 0,
        name: '',
        amount: 0,
        grade_level: '',
        school_id: 1, // Default to the only school ID
        academic_calendar_id: 1, // Default to the first academic calendar ID
    });
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        fetchFeeStructures();
        fetchSchools();
        fetchAcademicCalendars();
    }, [currentPage]); // Add currentPage as a dependency

    const fetchSchools = async () => {
        try {
            const response = await apiClient.get('/schools');
            setSchools(response.data.data);
        } catch (error: any) {
            console.error('Error fetching schools:', error);
            toast.error('Failed to fetch schools. Please try again later.');
        }
    };

    const fetchAcademicCalendars = async () => {
        try {
            const response = await apiClient.get('/academic-calendars');
            setAcademicCalendars(response.data.data);
        } catch (error: any) {
            console.error('Error fetching academic calendars:', error);
            toast.error('Failed to fetch academic calendars. Please try again later.');
        }
    };

    const fetchFeeStructures = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/fee-structures', { params: { page: currentPage } });
            setFeeStructures(response.data.data);
            setPaginationMeta(response.data.meta);
        } catch (error: any) {
            console.error('Error fetching fee structures:', error);
            if (error?.response?.status === 401) {
                navigate('/login');
            } else {
                toast.error('Failed to fetch fee structures. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEdit = currentFeeStructure.id !== 0;
        const endpoint = isEdit ? `/fee-structures/${currentFeeStructure.id}` : '/fee-structures';
        const method = isEdit ? 'put' : 'post';

        try {
            const response = await apiClient[method](endpoint, {
                name: currentFeeStructure.name,
                amount: currentFeeStructure.amount,
                grade_level: currentFeeStructure.grade_level,
                school_id: currentFeeStructure.school_id,
                academic_calendar_id: currentFeeStructure.academic_calendar_id,
            });

            toast.success(`Fee Structure ${isEdit ? 'updated' : 'added'} successfully!`);

            const reResponse = await apiClient.get('/fee-structures', { params: { page: currentPage } });
            setFeeStructures(reResponse.data.data);
            setPaginationMeta(reResponse.data.meta);

            setIsOpen(false);
            setDeleteModal(false);
        } catch (error: any) {
            console.error(`Error ${isEdit ? 'updating' : 'adding'} fee structure:`, error);
            if (error?.response?.status === 401 || error?.response?.data?.message === 'Unauthenticated.') {
                navigate('/login');
            } else {
                toast.error(error.response.data.message);
            }
        }
    };

    const handleDeleteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = `/fee-structures/${currentFeeStructure.id}`;
        const method = 'delete';

        try {
            const response = await apiClient[method](endpoint);

            setDeleteModal(false);
            fetchFeeStructures(); // Refresh the list
        } catch (error: any) {
            console.error(`Error deleting fee structure:`, error);
            if (error?.response?.status === 401 || error?.response?.data?.message === 'Unauthenticated.') {
                navigate('/login');
            } else {
                toast.error(error.response.data.message);
            }
        }
    };

    const handlePageChange = (url: string) => {
        const pageParam = new URL(url).searchParams.get('page');
        if (pageParam) {
            const newPage = Number(pageParam);
            setCurrentPage(newPage); // Set the current page
        }
    };

    const renderModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4 relative transform transition-all">
                <h3 className="text-xl font-bold mb-4">
                    {currentFeeStructure.id === 0 ? 'Add Fee Structure' : 'Edit Fee Structure'}
                </h3>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 bg-white text-gray-500 text-sm font-medium">
                            {currentFeeStructure.id === 0 ? 'New Entry' : 'Update Details'}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Name Field */}
                        <div className="group">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={currentFeeStructure.name}
                                onChange={(e) =>
                                    setCurrentFeeStructure({ ...currentFeeStructure, name: e.target.value })
                                }
                                placeholder="Fee Structure Name"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                                focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                required
                            />
                        </div>

                        {/* Amount Field */}
                        <div>
                            <label htmlFor="amount" className="block text-sm font-semibold text-gray-700">
                                Amount
                            </label>
                            <input
                                id="amount"
                                type="number"
                                value={currentFeeStructure.amount}
                                onChange={(e) =>
                                    setCurrentFeeStructure({ ...currentFeeStructure, amount: parseFloat(e.target.value) })
                                }
                                placeholder="Amount"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                                focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                required
                            />
                        </div>

                        {/* Grade Level Field */}
                        <div>
                            <label htmlFor="grade_level" className="block text-sm font-semibold text-gray-700">
                                Grade Level
                            </label>
                            <input
                                id="grade_level"
                                type="text"
                                value={currentFeeStructure.grade_level}
                                onChange={(e) =>
                                    setCurrentFeeStructure({ ...currentFeeStructure, grade_level: e.target.value })
                                }
                                placeholder="Grade Level"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                                focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                required
                            />
                        </div>

                        {/* School ID Field */}
                        <div>
                            <label htmlFor="school_id" className="block text-sm font-semibold text-gray-700">
                                School
                            </label>
                            <select
                                id="school_id"
                                value={currentFeeStructure.school_id}
                                onChange={(e) =>
                                    setCurrentFeeStructure({ ...currentFeeStructure, school_id: parseInt(e.target.value) })
                                }
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                                focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                required
                            >
                                {schools.map((school) => (
                                    <option key={school.id} value={school.id}>
                                        {school.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Academic Calendar ID Field */}
                        <div>
                            <label htmlFor="academic_calendar_id" className="block text-sm font-semibold text-gray-700">
                                Academic Calendar
                            </label>
                            <select
                                id="academic_calendar_id"
                                value={currentFeeStructure.academic_calendar_id}
                                onChange={(e) =>
                                    setCurrentFeeStructure({ ...currentFeeStructure, academic_calendar_id: parseInt(e.target.value) })
                                }
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                                focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                required
                            >
                                {academicCalendars.map((calendar) => (
                                    <option key={calendar.id} value={calendar.id}>
                                        {calendar.year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            className="py-2 px-4 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const renderDeleteModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
                <h3 className="text-xl font-bold mb-4"> Delete Fee Structure </h3>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 bg-white text-gray-500 text-sm font-medium">
                            {'Delete Fee Structure'}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleDeleteSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">
                                Are you sure you want to delete this fee structure?
                            </label>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            className="py-2 px-4 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                            onClick={() => setDeleteModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
                        >
                            Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto mr-12">
            <div className="bg-gray-50 rounded-lg shadow-lg p-2">
                <div className="w-full overflow-hidden bg-white rounded-lg shadow">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 border-b">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Fee Structures</h2>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full md:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
                            <input
                                type="text"
                                placeholder="Search Fee Structures"
                                className="flex-grow sm:flex-grow-0 border border-gray-300 rounded-md py-2 px-4 
                            focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                            <button
                                className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 whitespace-nowrap"
                                onClick={() => {
                                    setIsOpen(true);
                                    setCurrentFeeStructure({
                                        id: 0,
                                        name: '',
                                        amount: 0,
                                        grade_level: '',
                                        school_id: 1,
                                        academic_calendar_id: 1,
                                    });
                                }}
                            >
                                Add Fee Structure
                            </button>
                        </div>
                    </div>

                    {isOpen && renderModal()}
                    {deleteModal && renderDeleteModal()}

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade Level</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Calendar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feeStructures.map((feeStructure, index) => (
                                    <tr key={feeStructure.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {(currentPage - 1) * 10 + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feeStructure.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feeStructure.amount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feeStructure.grade_level}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feeStructure.school.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feeStructure.academic_calendar.year}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feeStructure.created_at}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 border border-blue-300 text-blue-600 
                                                rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-200 
                                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    onClick={() => {
                                                        setIsOpen(true);
                                                        setCurrentFeeStructure({
                                                            id: feeStructure.id,
                                                            name: feeStructure.name,
                                                            amount: feeStructure.amount,
                                                            grade_level: feeStructure.grade_level,
                                                            school_id: feeStructure.school_id,
                                                            academic_calendar_id: feeStructure.academic_calendar_id,
                                                        });
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>

                                                <button
                                                    className="inline-flex items-center px-3 py-1.5 bg-red-50 border border-red-300 text-red-600 
                                                rounded-md text-sm font-medium hover:bg-red-100 transition-colors duration-200
                                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    onClick={() => {
                                                        setDeleteModal(true);
                                                        setCurrentFeeStructure({
                                                            id: feeStructure.id,
                                                            name: feeStructure.name,
                                                            amount: feeStructure.amount,
                                                            grade_level: feeStructure.grade_level,
                                                            school_id: feeStructure.school_id,
                                                            academic_calendar_id: feeStructure.academic_calendar_id,
                                                        });
                                                    }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Pagination component with improved styling */}
                <div className="mt-6">
                    <Pagination paginationMeta={paginationMeta} onPageChange={handlePageChange} />
                </div>
            </div>
        </div>
    );
}