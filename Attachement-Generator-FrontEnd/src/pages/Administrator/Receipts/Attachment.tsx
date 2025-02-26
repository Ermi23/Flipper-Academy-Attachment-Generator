"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Printer } from "lucide-react";
import apiClient from "../../../api/axios";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios, { AxiosError } from "axios";

interface FeeStructure {
    id: number;
    name: string;
    price: number;
}

interface Student {
    id: number;
    school_number: string;
    first_name: string;
    father_name: string;
    last_name: string;
    grade_level: string;
    parent_name: string;
    parent_email: string;
    parent_phone_number: string;
    student_address: string;
    school_id: number;
    created_at: string;
    updated_at: string;
}

interface School {
    id: number;
    name: string;
    address: string;
    contact_email: string;
    phone_number_1: string;
    phone_number_2: string;
    company_website: string;
    tin: string;
}

interface FeeStructureStudent {
    id: number;
    fee_structure_id: number;
    student_id: number;
    quantity: number;
    total_amount: number;
    fee_structure: FeeStructure;
    student: Student;
    created_at: string;
}

interface ReceiptData {
    receipt_no: string;
    created_at: string;
    vat_percentage: string;
    fee_structure_students: FeeStructureStudent[];
    school: School | null;
}

const Attachment: React.FC = () => {
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchParams] = useSearchParams();


    // Get query parameters
    const receiptId = searchParams.get("receipt_id");
    const receiptNo = searchParams.get("receipt_no");
    const vatPercentage = searchParams.get("vat_percentage");
    const navigate = useNavigate();

    // Fetch receipt data on component mount
    useEffect(() => {
        const fetchReceiptData = async () => {
            if (!receiptId) {
                setError("Receipt ID is missing.");
                setLoading(false);
                return;
            }

            try {
                // Fetch fee structure students by receipt ID
                const response = await apiClient.get(
                    `/fee-structure-students-by-receipt/${receiptId}`
                );
                const feeStructureStudents = response.data.data;

                // Fetch school details
                const schoolResponse = await apiClient.get("/schools/1"); // Replace with dynamic school ID if needed
                const school = schoolResponse.data.data;

                // Prepare receipt data
                const receiptData = {
                    receipt_no: receiptNo || "N/A",
                    created_at: feeStructureStudents[0]?.created_at || "N/A",
                    vat_percentage: vatPercentage || "0.00",
                    fee_structure_students: feeStructureStudents,
                    school,
                };

                setReceiptData(receiptData);
            } catch (error) {
                console.error(`Error user:`, error);
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 401 || error.response?.data?.message === "Unauthenticated.") {
                        navigate("/login");
                    } else {
                        setError("Failed to fetch receipt data. Please try again.");
                    }
                }

                console.error("Error fetching receipt data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReceiptData();
    }, [receiptId, receiptNo, vatPercentage]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-8 text-red-600">{error}</div>;
    }

    if (!receiptData) {
        return <div className="text-center py-8">No receipt data found.</div>;
    }

    const calculateSubtotal = (): number => {
        return receiptData.fee_structure_students.reduce(
            (sum, item) => sum + item.total_amount,
            0
        );
    };

    const calculateVat = (): number => {
        const subtotal = calculateSubtotal();
        const vatPercentage = parseFloat(receiptData.vat_percentage);
        return (subtotal * vatPercentage) / 100;
    };

    const calculateGrandTotal = (): number => {
        return calculateSubtotal() + calculateVat();
    };

    // Get the student details from the first fee structure student
    const student = receiptData.fee_structure_students[0]?.student;

    const handlePrint = () => {
        if (!receiptData.school) {
            toast.error("School details are missing. Please try again.");
            return;
        }

        const printWindow = window.open("", "_blank");
        if (!printWindow) {
            toast.error("Failed to open print window. Please allow pop-ups for this site.");
            return;
        }

        const subtotal = receiptData.fee_structure_students.reduce(
            (sum, item) => sum + item.total_amount,
            0
        );
        const vatAmount = (subtotal * parseFloat(receiptData.vat_percentage)) / 100;
        const grandTotal = subtotal + vatAmount;

        printWindow.document.write(`
          <html>
            <head>
              <title>Print Receipt</title>
              <style>
                @page { size: A4; margin: 2cm; }
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #000; }
                .container { max-width: 800px; margin: 0 auto; padding: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .school-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                .info-section { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .receipt-details, .student-info { flex: 1; }
                .section-title { font-weight: bold; margin-bottom: 10px; }
                .info-row { margin-bottom: 5px; }
                table { width: 100%; margin-top: 20px; border-collapse: collapse; }
                th { background-color: #f5f5f5; padding: 10px; text-align: left; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd; }
                td { padding: 10px; border-bottom: 1px solid #ddd; }
                .amount-column { text-align: right; }
                .totals { margin-top: 10px; }
                .total-row { display: flex; justify-content: space-between; padding: 5px 10px; }
                .bold { font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="school-name">${receiptData.school?.name || "N/A"}</div>
                  <div>${receiptData.school?.address || "N/A"}</div>
                  <div>${receiptData.school?.phone_number_1 || "N/A"}</div>
                  <div>${receiptData.school?.contact_email || "N/A"}</div>
                  <div>${receiptData.school?.company_website || "N/A"}</div>
                  <div>TIN: ${receiptData.school?.tin || "N/A"}</div>
                </div>
    
                <div class="info-section">
                  <div class="receipt-details">
                    <div class="section-title">Receipt Details</div>
                    <div class="info-row">Receipt No: ${receiptData.receipt_no}</div>
                    <div class="info-row">Date: ${new Date(receiptData.created_at).toLocaleDateString()}</div>
                  </div>
                  <div class="student-info">
                    <div class="section-title">Student Information</div>
                    <div class="info-row">Name: ${student.first_name} ${student.father_name} ${student.last_name}</div>
                    <div class="info-row">School Number: ${student.school_number}</div>
                    <div class="info-row">Address: ${student.student_address}</div>
                  </div>
                </div>
    
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th style="text-align: right">Amount (ETB)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${receiptData.fee_structure_students
                .map(
                    (item) => `
                          <tr>
                            <td>${item.quantity} x ${item.fee_structure.name}</td>
                            <td class="amount-column">${item.total_amount.toFixed(2)}</td>
                          </tr>
                        `
                )
                .join("")}
                    <tr style="border-top: 1px solid #000 ">
                      <td >Subtotal</td>
                      <td class="amount-column">${subtotal.toFixed(2)} ETB</td>
                    </tr>
                    <tr>
                      <td >VAT (${receiptData.vat_percentage}%)</td>
                      <td class="amount-column">${vatAmount.toFixed(2)} ETB</td>
                    </tr>
                    <tr>
                      <td class="bold">Grand Total</td>
                      <td class="amount-column bold">${grandTotal.toFixed(2)} ETB</td>
                    </tr>
                  </tbody>
                </table>
              </div>
    
              <script>
                window.onload = () => {
                  window.print();
                  window.onafterprint = () => {
                    window.close();
                  };
                };
              </script>
            </body>
          </html>
        `);

        printWindow.document.close();
    };


    return (
        <div className="max-w-3xl mx-auto p-8 bg-white shadow-lg relative">
            {/* Action Buttons */}
            <div className="flex gap-3 mb-8 print-button">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                    <Printer className="w-4 h-4" />
                    Print
                </button>
            </div>

            {/* Print Content */}
            <div className="print-content">
                {/* School Header */}
                {receiptData.school && (
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-semibold mb-4">{receiptData.school.name}</h1>
                        <div className="text-gray-600 space-y-1">
                            <p>{receiptData.school.address}</p>
                            <p>{receiptData.school.phone_number_1}</p>
                            <p>{receiptData.school.contact_email}</p>
                            <p>{receiptData.school.company_website}</p>
                            <p>TIN: {receiptData.school.tin}</p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-8">
                    {/* Receipt Info */}
                    <div className="flex justify-between mb-8">
                        <div>
                            <h2 className="font-semibold mb-2">Receipt Details</h2>
                            <div className="text-gray-600">
                                <p><span className="font-semibold">Receipt No : </span> {receiptData.receipt_no}</p>
                                <p><span className="font-semibold">Date : </span> {new Date(receiptData.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Student Information */}
                    {student && (
                        <div className="md:w-1/2 text-left md:text-right">
                            <h2 className="font-semibold mb-2">Student Information</h2>
                            <div className="text-gray-600 space-y-1">
                                <p><span className="font-semibold">Name : </span> {`${student.first_name} ${student.father_name} ${student.last_name}`}</p>
                                <p><span className="font-semibold">School Number :</span> {student.school_number}</p>
                                <p><span className="font-semibold">Address : </span> {student.student_address}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fee Structures Table */}
                <div className="mb-8">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="text-left py-3 px-4">Description</th>
                                <th className="text-right py-3 px-4">Amount (ETB)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {receiptData.fee_structure_students.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200">
                                    <td className="py-3 px-4">
                                        {item.quantity} x {item.fee_structure.name}
                                    </td>
                                    <td className="text-right py-3 px-4">
                                        {item.total_amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            <tr className="font-bold">
                                <td className="py-4 px-4">Subtotal</td>
                                <td className="text-right py-4 px-4">
                                    {calculateSubtotal().toFixed(2)} ETB
                                </td>
                            </tr>
                            <tr className="font-bold border-b border-gray-200">
                                <td className="py-4 px-4">VAT ({receiptData.vat_percentage}%)</td>
                                <td className="text-right py-4 px-4">
                                    {calculateVat().toFixed(2)} ETB
                                </td>
                            </tr>
                            <tr className="font-bold">
                                <td className="py-4 px-4">Grand Total</td>
                                <td className="text-right py-4 px-4">
                                    {calculateGrandTotal().toFixed(2)} ETB
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Attachment;