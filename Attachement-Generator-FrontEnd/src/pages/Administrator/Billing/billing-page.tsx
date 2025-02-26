"use client";

import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import apiClient from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
import { toast, ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';

interface FeeStructure {
    id: number;
    name: string;
    price: number;
}

interface Student {
    id: number;
    first_name: string;
    father_name: string;
    last_name: string;
}

interface FeeStructureStudent {
    id: number;
    fee_structure_id: number;
    student_id: number;
    quantity: number;
    total_amount: number;
    fee_structure: FeeStructure;
    student: Student;
}

const BillingPage: React.FC = () => {
    const [searchParams] = useSearchParams(); // Destructure the tuple
    const receiptId = searchParams.get("receipt_id");
    const receiptNo = searchParams.get("receipt_no");
    const navigate = useNavigate();

    // State variables
    const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedFee, setSelectedFee] = useState("");
    const [selectedStudent, setSelectedStudent] = useState("");
    const [quantity, setQuantity] = useState("1");
    const [billingItems, setBillingItems] = useState<FeeStructureStudent[]>([]);
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [loading, setLoading] = useState(true);
    const [isStudentLocked, setIsStudentLocked] = useState(false); // To lock the student dropdown

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch fee structures
                const feeResponse = await apiClient.get('/fee-structures');
                setFeeStructures(feeResponse.data.data);

                // Fetch students
                const studentResponse = await apiClient.get('/students-dropdown');
                setStudents(studentResponse.data.data);

                // Fetch existing fee structure students for this receipt
                if (receiptId) {
                    const billingResponse = await apiClient.get(`/fee-structure-students-by-receipt/${receiptId}`);
                    setBillingItems(billingResponse.data.data);
                    // Lock student dropdown if billing items already exist
                    if (billingResponse.data.data.length > 0) {
                        setIsStudentLocked(true);
                        setSelectedStudent(billingResponse.data.data[0].student_id.toString());
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to fetch data. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [receiptId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFee || !selectedStudent || !quantity || !receiptId) {
            toast.error("Please fill all fields.");
            return;
        }

        try {
            const response = await apiClient.post('/fee-structure-students', {
                fee_structure_id: Number(selectedFee),
                student_id: Number(selectedStudent),
                quantity: Number(quantity),
                receipt_id: Number(receiptId)
            });

            // Update billingItems state with the new fee structure student
            setBillingItems((prevItems) => [...prevItems, response.data.data]);

            // Lock the student dropdown after the first fee is added
            if (!isStudentLocked) {
                setIsStudentLocked(true);
            }

            // Reset form
            setSelectedFee("");
            setQuantity("1");

            toast.success("Fee added successfully!");
        } catch (error) {
            console.error("Error creating fee structure student:", error);
            toast.error("Failed to add fee. Please try again.");
        }
    };

    const handleRemoveItem = async (id: number) => {
        try {
            await apiClient.delete(`/fee-structure-students/${id}`);
            setBillingItems((prevItems) => prevItems.filter(item => item.id !== id));
            toast.success("Fee removed successfully!");
        } catch (error) {
            console.error("Error deleting fee structure student:", error);
            toast.error("Failed to remove fee. Please try again.");
        }
    };

    const calculateTotal = (): number => {
        return billingItems.reduce((sum, item) => sum + item.total_amount, 0);
    };

    const handlePrint = async (receiptId: string | number) => {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <div className="text-2xl font-bold mb-6">Billing - Receipt No: {receiptNo}</div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">
                    Select Student
                </label>
                <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-3 text-lg h-12"
                    disabled={isStudentLocked} // Disable dropdown if student is locked
                >
                    <option value="" disabled hidden>Select Student</option>
                    {students.map((student) => (
                        <option key={student.id} value={student.id}>
                            {`${student.first_name} ${student.father_name} ${student.last_name}`}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/3 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Add Fee</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Select Fee Type
                            </label>
                            <select
                                value={selectedFee}
                                onChange={(e) => setSelectedFee(e.target.value)}
                                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 p-3 text-lg h-12"
                            >
                                <option value="" disabled hidden>
                                    Select Fee Structure
                                </option>
                                {feeStructures.map((fee) => (
                                    <option key={fee.id} value={fee.id}>
                                        {fee.name} - {fee.price} ETB
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Quantity
                            </label>
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                min="1"
                                className="mt-1 w-full border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 text-lg h-12"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md"
                        >
                            Add Fee
                        </button>
                    </form>
                </div>

                <div className="w-full lg:w-2/3 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Fee Details</h2>
                        <button
                            // onClick={handlePrint(receipt.id)}
                            onClick={() => receiptId && handlePrint(receiptId)}
                            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-md"
                        >
                            Done
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fee Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {billingItems.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.fee_structure.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.quantity}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {typeof item.total_amount === 'number' ? item.total_amount.toFixed(2) : 'N/A'} ETB
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Paid By:</span>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-[100px] border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                            >
                                <option value="Cash">Cash</option>
                                <option value="Card">Card</option>
                                <option value="UPI">UPI</option>
                            </select>
                        </div>
                        <div className="text-xl font-bold">
                            Total: {calculateTotal().toFixed(2)} ETB
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;