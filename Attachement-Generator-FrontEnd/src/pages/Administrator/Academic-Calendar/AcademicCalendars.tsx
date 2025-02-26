import { useState, useEffect } from 'react';
import apiClient from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Pagination from '../components/pagination'; // Import the Pagination component
import 'react-toastify/dist/ReactToastify.css';
import { FolderOpen } from 'lucide-react'; // Add this import for the empty state icon

// toast.configure();

interface AcademicYear {
    id: number;
    year: string;
    term: string;
    description: string;
    created_at: string;
}

export default function AcademicYearsPage() {
    const [academicyears, setAcademicYears] = useState<AcademicYear[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [paginationMeta, setPaginationMeta] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [deletMondal, setDeletMondal] = useState(false);
    const academicyearsPerPage = 10;
    const [currentAcademicYear, setCurrentacAdemicYear] = useState({
        id: 0,
        year: '',
        term: '',
        description: '',
    });
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        fetchAcademicYears();
    }, [currentPage]); // Add currentPage as a dependency

    const fetchAcademicYears = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/academic-calendars', { params: { page: currentPage } });
            setAcademicYears(response.data.data);
            setPaginationMeta(response.data.meta);
        } catch (error: any) {
            console.error('Error fetching academic-years:', error);

            if (error?.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                navigate('/login');
            } else if (error?.response?.data?.message?.includes('SQL')) {
                toast.error('An internal server error occurred. Please try again later.');
            } else {
                toast.error(error?.response?.data?.message || 'Failed to fetch Academic Calendars. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEdit = currentAcademicYear.id !== 0;
        const endpoint = isEdit ? `/academic-calendars/${currentAcademicYear.id}` : '/academic-calendars';
        const method = isEdit ? 'put' : 'post';

        try {
            await apiClient[method](endpoint, {
                year: currentAcademicYear.year,
                term: currentAcademicYear.term,
                description: currentAcademicYear.description,
            });

            // First show the success message
            toast.success(`Academic Calendar ${isEdit ? 'updated' : 'created'} successfully!`, {
                position: "top-right",
                autoClose: 3000,
            });

            // Add a small delay before state updates and page refresh
            setTimeout(async () => {
                setIsOpen(false);
                setCurrentacAdemicYear({ id: 0, year: '', term: '', description: '' });
                await fetchAcademicYears();
            }, 1000);

        } catch (error: any) {
            console.error(`Error ${isEdit ? 'updating' : 'adding'} AcademicYear:`, error);

            if (error?.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                navigate('/login');
            } else if (error?.response?.status === 422) {
                // Validation errors
                const validationErrors = error.response.data.errors;
                Object.values(validationErrors).forEach((errorMsg: any) => {
                    toast.error(errorMsg[0]);
                });
            } else if (error?.response?.data?.message?.includes('SQL')) {
                // SQL related errors
                toast.error('An internal server error occurred. Please try again later.');
            } else {
                // Other errors
                toast.error(error?.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} Academic Calendar.`);
            }
        }
    };

    const handleDeleteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.delete(`/academic-calendars/${currentAcademicYear.id}`);

            // Show success message first
            toast.success('Academic Calendar deleted successfully!', {
                position: "top-right",
                autoClose: 3000,
            });

            // Add delay before state updates and page refresh
            setTimeout(async () => {
                setDeletMondal(false);
                setCurrentacAdemicYear({ id: 0, year: '', term: '', description: '' });
                await fetchAcademicYears();
            }, 1000);

        } catch (error: any) {
            console.error('Error deleting AcademicYear:', error);

            if (error?.response?.status === 401) {
                toast.error('Session expired. Please login again.');
                navigate('/login');
            } else if (error?.response?.data?.message?.includes('SQL')) {
                toast.error('An internal server error occurred. Please try again later.');
            } else {
                toast.error(error?.response?.data?.message || 'Failed to delete Academic Calendar.');
            }
        }
    };

    const renderModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4 relative transform transition-all">
                <h3 className="text-xl font-bold mb-4">
                    {currentAcademicYear.id === 0 ? 'Add Academic Year' : 'Edit Academic Year'}
                </h3>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 bg-white text-gray-500 text-sm font-medium">
                            {currentAcademicYear.id === 0 ? 'New Entry' : 'Update Details'}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="group">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                Academic Calendar Year
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={currentAcademicYear.year}
                                onChange={(e) =>
                                    setCurrentacAdemicYear({ ...currentAcademicYear, year: e.target.value })
                                }
                                placeholder="Academic Calendar"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                                focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                required
                            />
                        </div>

                        <div className="group">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                Academic Calendar Term
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={currentAcademicYear.term}
                                onChange={(e) =>
                                    setCurrentacAdemicYear({ ...currentAcademicYear, term: e.target.value })
                                }
                                placeholder="Academic Calendar Term"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                                focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                value={currentAcademicYear.description}
                                onChange={(e) =>
                                    setCurrentacAdemicYear({ ...currentAcademicYear, description: e.target.value })
                                }
                                placeholder="Academic Calendar Description"
                                rows={4}
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                                focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200
                                resize-none"
                                required
                            />
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
                <h3 className="text-xl font-bold mb-4"> Delete Academic Year </h3>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 bg-white text-gray-500 text-sm font-medium">
                            {'Delete Academic Year'}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleDeleteSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">
                                Are you shure you want to delete?
                            </label>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            className="py-2 px-4 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                            onClick={() => setDeletMondal(false)}
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

    const handlePageChange = (url: string) => {
        const pageParam = new URL(url).searchParams.get('page');
        if (pageParam) {
            const newPage = Number(pageParam);
            setCurrentPage(newPage); // Set the current page
        }
    };

    const renderEmptyState = () => (
        <div className="text-center py-12 px-4 bg-white rounded-lg">
            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No Academic Calendars Found</h3>
            <p className="mt-2 text-sm text-gray-500">
                Get started by creating your first Academic Calendar.
            </p>
            <div className="mt-6">
                <button
                    onClick={() => {
                        setIsOpen(true);
                        setCurrentacAdemicYear({ id: 0, year: '', term: '', description: '' });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent 
                    shadow-sm text-sm font-medium rounded-md text-white bg-orange-500 
                    hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-orange-500"
                >
                    <span className="mr-2">+</span>
                    Add Academic Calendar
                </button>
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
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 space-y-2 lg:space-y-0">
                        <h2 className="text-2xl font-bold text-gray-800">Academic Calendars</h2>
                        <div className="flex flex-col sm:flex-row w-full lg:w-auto space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="flex-grow sm:flex-grow-0">
                                <input
                                    type="text"
                                    placeholder="Search Academic Calendars"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 
                                    focus:border-orange-500"
                                />
                            </div>
                            <button
                                className="w-full sm:w-auto bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 
                                transition-colors duration-200 whitespace-nowrap flex items-center justify-center"
                                onClick={() => {
                                    setIsOpen(true);
                                    setCurrentacAdemicYear({ id: 0, year: '', term: '', description: '' });
                                }}
                            >
                                <span className="mr-2">+</span>
                                Add Academic Calendar
                            </button>
                        </div>
                    </div>

                    {isOpen && renderModal()}
                    {deletMondal && renderDeleteModal()}

                    {academicyears.length === 0 ? (
                        renderEmptyState()
                    ) : (
                        <div className="w-full overflow-x-auto">
                            <div className="min-w-full">
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic Year</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Term</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {academicyears.map((academicyear, index) => (
                                            <tr key={academicyear.id} className="hover:bg-gray-50 transition-colors duration-150">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {(currentPage - 1) * academicyearsPerPage + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{academicyear.year}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{academicyear.term}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{academicyear.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {new Date(academicyear.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    <div className="flex flex-wrap gap-2">
                                                        <button
                                                            className="inline-flex items-center px-3 py-1.5 bg-blue-50 border border-blue-300 text-blue-600 
                                                        rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-200 
                                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                            onClick={() => {
                                                                setIsOpen(true);
                                                                setCurrentacAdemicYear({
                                                                    id: academicyear.id,
                                                                    year: academicyear.year,
                                                                    term: academicyear.term,
                                                                    description: academicyear.description,
                                                                });
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            {/* <span>Edit</span> */}
                                                        </button>

                                                        <button
                                                            className="inline-flex items-center px-3 py-1.5 bg-red-50 border border-red-300 text-red-600 
                                                        rounded-md text-sm font-medium hover:bg-red-100 transition-colors duration-200
                                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                            onClick={() => {
                                                                setDeletMondal(true);
                                                                setCurrentacAdemicYear({
                                                                    id: academicyear.id,
                                                                    year: academicyear.year,
                                                                    term: academicyear.term,
                                                                    description: academicyear.description,
                                                                });
                                                            }}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            {/* <span>Delete</span> */}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {academicyears.length > 0 && (
                    <div className="mt-6">
                        <Pagination paginationMeta={paginationMeta} onPageChange={handlePageChange} />
                    </div>
                )}

                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick={true}
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                    limit={3}
                />
            </div>
        </div>
    );
}