import { useState, useEffect } from 'react';
import apiClient from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from './../components/pagination'; // Import the Pagination component
import 'react-toastify/dist/ReactToastify.css';

// toast.configure();

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [paginationMeta, setPaginationMeta] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [deletMondal, setDeletMondal] = useState(false);
    const usersPerPage = 10;
    const [currentUser, setCurrentUser] = useState({
        id: 0,
        name: '',
        email: '',
        password: '',
        confirm_password: '',
    });
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState<number>(1);

    // useEffect(() => {
    //     fetchUsers();
    // }, []);
    useEffect(() => {
        fetchUsers();
    }, [currentPage]); // Add currentPage as a dependency

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/users', { params: { page: currentPage } });
            setUsers(response.data.data);
            setPaginationMeta(response.data.meta);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            if (error?.response?.status === 401) {
                navigate('/login');
            } else {
                toast.error('Failed to fetch users. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEdit = currentUser.id !== 0;
        const endpoint = isEdit ? `/users/${currentUser.id}` : '/users';
        const method = isEdit ? 'put' : 'post';

        try {
            const response = await apiClient[method](endpoint, {
                name: currentUser.name,
                email: currentUser.email,
                password: currentUser.password,
                password_confirmation: currentUser.confirm_password,
            });

            toast.success(`User ${isEdit ? 'updated' : 'added'} successfully!`);
            fetchUsers();
            setIsOpen(false);
            setDeletMondal(false);
        } catch (error: any) {
            console.error(`Error ${isEdit ? 'updating' : 'adding'} user:`, error);
            if (error?.response?.status === 401 || error?.response?.data?.message === 'Unauthenticated.') {
                navigate('/login');
            } else {
                toast.error(error.response.data.message);
            }
        }
    };

    const handleDeletSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = `/users/${currentUser.id}`;
        const method = 'delete';

        try {
            const response = await apiClient[method](endpoint);

            setDeletMondal(false);
        } catch (error: any) {
            console.error(`Error user:`, error);
            if (error?.response?.status === 401 || error?.response?.data?.message === 'Unauthenticated.') {
                navigate('/login');
            } else {
                toast.error(error.response.data.message);
            }
        }
    };

    const renderModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4 relative transform transition-all">
                <h3 className="text-xl font-bold mb-4">
                    {currentUser.id === 0 ? 'Add User' : 'Edit User'}
                </h3>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 bg-white text-gray-500 text-sm font-medium">
                            {currentUser.id === 0 ? 'New Entry' : 'Update Details'}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="group">
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                                User Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={currentUser.name}
                                onChange={(e) =>
                                    setCurrentUser({ ...currentUser, name: e.target.value })
                                }
                                placeholder="User Name"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                                focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={currentUser.email}
                                onChange={(e) =>
                                    setCurrentUser({ ...currentUser, email: e.target.value })
                                }
                                placeholder="User Email"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                                focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={currentUser.password}
                                onChange={(e) =>
                                    setCurrentUser({ ...currentUser, password: e.target.value })
                                }
                                placeholder="User Password"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                                focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                required={!currentUser.id}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirm_password"
                                type="password"
                                value={currentUser.confirm_password}
                                onChange={(e) =>
                                    setCurrentUser({ ...currentUser, confirm_password: e.target.value })
                                }
                                placeholder="Confirm Password"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm 
                                focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                                required={!currentUser.id}
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
                <h3 className="text-xl font-bold mb-4"> Delete User </h3>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 bg-white text-gray-500 text-sm font-medium">
                            {'Delete User'}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleDeletSubmit}>
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
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Users</h2>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full md:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
                            <input
                                type="text"
                                placeholder="Search Users"
                                className="flex-grow sm:flex-grow-0 border border-gray-300 rounded-md py-2 px-4 
                            focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                            />
                            <button
                                className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 whitespace-nowrap"
                                onClick={() => {
                                    setIsOpen(true);
                                    setCurrentUser({ id: 0, name: '', email: '', password: '', confirm_password: '' });
                                }}
                            >
                                Add User
                            </button>
                        </div>
                    </div>

                    {isOpen && renderModal()}
                    {deletMondal && renderDeleteModal()}

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">

                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (

                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {(currentPage - 1) * usersPerPage + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.created_at}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 border border-blue-300 text-blue-600 
                                                rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-200 
                                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    onClick={() => {
                                                        setIsOpen(true);
                                                        setCurrentUser({
                                                            id: user.id,
                                                            name: user.name,
                                                            email: user.email,
                                                            password: '',
                                                            confirm_password: '',
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
                                                        setCurrentUser({
                                                            id: user.id,
                                                            name: user.name,
                                                            email: user.email,
                                                            password: '',
                                                            confirm_password: '',
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
                {/* Pagination component with improved styling */}
                <div className="mt-6">
                    <Pagination paginationMeta={paginationMeta} onPageChange={handlePageChange} />
                </div>
            </div>
        </div>
    );
}