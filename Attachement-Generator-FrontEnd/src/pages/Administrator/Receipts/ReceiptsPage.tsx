"use client"

import { useState, useEffect } from 'react';
import apiClient from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Pagination from './../components/pagination'; // Import the Pagination component
import 'react-toastify/dist/ReactToastify.css';

interface Receipt {
    id: number;
    receipt_no: string;
    vat_id: number;
    vat: { id: number; percentage: number }; // Include VAT object
    created_at: string;
    updated_at: string;
}

export default function ReceiptsPage() {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [paginationMeta, setPaginationMeta] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [deletMondal, setDeletMondal] = useState(false);
    const [currentReceipts, setCurrentReceipts] = useState({
        id: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchReceipts();
    }, [currentPage]);

    const fetchReceipts = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/receipts', { params: { page: currentPage } });
            setReceipts(response.data.data);
            setPaginationMeta(response.data.meta);
        } catch (error: any) {
            console.error('Error fetching receipts:', error);
            if (error?.response?.status === 401) {
                navigate('/login');
            } else {
                toast.error('Failed to fetch receipts. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    // const handleCreateReceipt = async () => {
    //     try {
    //         const response = await apiClient.post('/receipts');
    //         // const { receipt_no, vat_percentage } = response.data;
    //         // navigate(`/billing?receipt_no=${receipt_no}&vat_percentage=${vat_percentage}`);


    //         const { id, receipt_no, vat } = response.data; // Get the receipt ID
    //         navigate(`/billing?receipt_id=${id}&receipt_no=${receipt_no}&vat_percentage=${vat.percentage}`);

    //     } catch (error: any) {
    //         console.error('Error creating receipt:', error);
    //         toast.error('Failed to create receipt. Please try again.');
    //     }
    // };

    const handleCreateReceipt = async () => {
        try {
            const response = await apiClient.post('/receipts');
            const { id, receipt_no, vat } = response.data.data; // Adjusted to access 'data' properly

            // Check if vat is defined before accessing percentage
            const vatPercentage = vat && vat.percentage ? vat.percentage : '0.00'; // Default to '0.00' if vat is not available

            navigate(`/billing?receipt_id=${id}&receipt_no=${receipt_no}&vat_percentage=${vatPercentage}`);
        } catch (error: any) {
            console.error('Error creating receipt:', error);
            toast.error('Failed to create receipt. Please try again.');
        }
    };

    const handleShowReceipt = async (receiptId: number) => {
        try {
            // Dynamically pass the receiptId to the API endpoint
            const response = await apiClient.get(`/receipts/${receiptId}`);
            const { id, receipt_no, vat } = response.data.data; // Adjusted to access 'data' properly

            // Check if vat is defined before accessing percentage
            const vatPercentage = vat && vat.percentage ? vat.percentage : '0.00'; // Default to '0.00' if vat is not available

            // Navigate to the billing page with the receipt details
            navigate(`/Attachment?receipt_id=${id}&receipt_no=${receipt_no}&vat_percentage=${vatPercentage}`);
        } catch (error: any) {
            console.error('Error fetching receipt:', error);
            toast.error('Failed to fetch receipt. Please try again.');
        }
    };

    const handlePageChange = (url: string) => {
        const pageParam = new URL(url).searchParams.get('page');
        if (pageParam) {
            const newPage = Number(pageParam);
            setCurrentPage(newPage); // Set the current page
        }
    };


    const handleDeletSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = `/receipts/${currentReceipts.id}`;
        const method = 'delete';

        try {
            const response = await apiClient[method](endpoint);
            //optimistically remove the student from the list 
            setReceipts((prevreceiptss) => prevreceiptss.filter(receipts => receipts.id !== currentReceipts.id))
            toast.success("Student deleted successfully!")
            setDeletMondal(false);
            // fetchStudents() // Refresh the list
        } catch (error: any) {
            console.error(`Error user:`, error);
            if (error?.response?.status === 401 || error?.response?.data?.message === 'Unauthenticated.') {
                navigate('/login');
            } else {
                toast.error(error.response.data.message);
            }
        }
    };

    const renderDeleteModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
                <h3 className="text-xl font-bold mb-4"> Delete Receipt </h3>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 bg-white text-gray-500 text-sm font-medium">
                            {'Delete Receipt'}
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
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 md:mb-0">Receipts</h2>
                        <button
                            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 whitespace-nowrap"
                            onClick={handleCreateReceipt}
                        >
                            Add Receipt
                        </button>
                    </div>

                    {deletMondal && renderDeleteModal()}

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">VAT Percentage</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receipts.map((receipt, index) => (
                                    <tr key={receipt.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {(currentPage - 1) * 10 + index + 1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{receipt.receipt_no}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{receipt.vat.percentage}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{receipt.created_at}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 border border-blue-300 text-blue-600 
               rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-200 
               focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    onClick={() => handleShowReceipt(receipt.id)} // Pass receipt.id to the function
                                                >
                                                    Show
                                                </button>

                                                <button
                                                    className="inline-flex items-center px-3 py-1.5 bg-red-50 border border-red-300 text-red-600 
                                                rounded-md text-sm font-medium hover:bg-red-100 transition-colors duration-200
                                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                                    onClick={(e) => {
                                                        e.stopPropagation() // Prevent row click
                                                        setDeletMondal(true);
                                                        setCurrentReceipts({
                                                            id: receipt.id,
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