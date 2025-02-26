"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css"
import apiClient from '../../../api/axios';
import Pagination from './../components/pagination'; // Import the Pagination component
import { X } from "lucide-react"; // For the close icon

interface Student {
    id: number
    school_number: string
    first_name: string
    father_name: string
    last_name: string
    grade_level: string
    parent_name: string
    parent_email: string
    parent_phone_number: string
    student_address: string
    school_id: number
}

interface School {
    id: number
    name: string
}

interface ImportStudentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const StudentsCRUD: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editedStudent, setEditedStudent] = useState<Student | null>(null)
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
    const [schools, setSchools] = useState<School[]>([])
    const [paginationMeta, setPaginationMeta] = useState<any>(null)
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [deletMondal, setDeletMondal] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>("") // State for search input
    const [isModalOpen, setModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState({
        id: 0,
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents()
        fetchSchools()
    }, [currentPage, searchQuery]) // Fetch students when page or search query changes

    const fetchStudents = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get(`/students?page=${currentPage}&search=${searchQuery}`) // Add search query to the API request
            setStudents(response.data.data)
            setPaginationMeta(response.data.meta) // Assuming the API returns pagination metadata
        } catch (error: any) {
            console.error(`Error user:`, error);
            if (error?.response?.status === 401 || error?.response?.data?.message === 'Unauthenticated.') {
                navigate('/login');
            } else {
                toast.error(error.response.data.message);
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchSchools = async () => {
        try {
            const response = await apiClient.get("/schools")
            setSchools(response.data.data) // Assuming the API returns an array of schools
        } catch (error: any) {
            console.error(`Error user:`, error);
            if (error?.response?.status === 401 || error?.response?.data?.message === 'Unauthenticated.') {
                navigate('/login');
            } else {
                toast.error(error.response.data.message);
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setEditedStudent((prev) => ({ ...prev!, [name]: value }))
    }

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await apiClient.post("/students", editedStudent)
            toast.success("Student added successfully!")
            setIsAdding(false)
            // fetchStudents() // Refresh the list
        } catch (error: any) {
            console.error(`Error user:`, error);
            if (error?.response?.status === 401 || error?.response?.data?.message === 'Unauthenticated.') {
                navigate('/login');
            } else {
                toast.error(error.response.data.message);
            }
        }
    }

    const handleEditStudent = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await apiClient.put(`/students/${editedStudent?.id}`, editedStudent)
            // toast.success("Student updated successfully!")
            setIsEditing(false)

            const response = await apiClient.get(`/students?page=${currentPage}&search=${searchQuery}`) // Add search query to the API request
            setStudents(response.data.data)
            setPaginationMeta(response.data.meta) // Assuming the API returns pagination metadata

        } catch (error: any) {
            console.error(`Error user:`, error);
            if (error?.response?.status === 401 || error?.response?.data?.message === 'Unauthenticated.') {
                navigate('/login');
            } else {
                toast.error(error.response.data.message);
            }
        } finally {
            toast.success("Student updated successfully!")
        }
    }

    const handleDeletSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = `/students/${currentStudent.id}`;
        const method = 'delete';

        try {
            const response = await apiClient[method](endpoint);
            //optimistically remove the student from the list 
            setStudents((prevstudents) => prevstudents.filter(student => student.id !== currentStudent.id))
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

    const handleExportTemplate = async () => {
        const endpoint = `/students-template`;

        try {
            const response = await apiClient.get(endpoint, {
                responseType: 'blob', // Ensures response is a file (binary data)
            });

            // Create a blob from the response data
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.setAttribute('download', 'students_template.xlsx'); // Set download filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // Cleanup

            toast.success("Student Template downloaded successfully!");
        } catch (error: any) {
            console.error(`Error downloading file:`, error);
            if (error?.response?.status === 401 || error?.response?.data?.message === 'Unauthenticated.') {
                navigate('/login');
            } else {
                toast.error(error.response?.data?.message || "Failed to download template.");
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

    const handleRowClick = (student: Student) => {
        setSelectedStudent(student)
    }

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value) // Update search query state
    }

    const ImportStudentModal: React.FC<ImportStudentModalProps> = ({ isOpen, onClose }) => {
        const [file, setFile] = useState<File | null>(null);
        const [loading, setLoading] = useState(false);

        // Handle file selection
        const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.files?.length) {
                setFile(event.target.files[0]);
            }
        };

        // Handle file drop
        const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            if (event.dataTransfer.files?.length) {
                setFile(event.dataTransfer.files[0]);
            }
        };

        // Handle file upload
        const handleUpload = async () => {
            if (!file) {
                toast.error("Please select a file to upload.");
                return;
            }

            setLoading(true);
            const formData = new FormData();
            formData.append("file", file);

            try {
                await apiClient.post("/students/import", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                toast.success("Student data imported successfully!");
                onClose();
            } catch (error: any) {
                console.error("Import Error:", error);
                toast.error(error.response?.data?.message || "File upload failed.");
            } finally {
                setLoading(false);
            }
        };

        // Fix: Return null when isOpen is false
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                    {/* Close Button */}
                    <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
                        <X size={20} />
                    </button>

                    <h2 className="text-xl font-semibold mb-4">Import Students</h2>

                    {/* Drag & Drop Box */}
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                    >
                        {file ? (
                            <p className="text-green-600 font-semibold">{file.name}</p>
                        ) : (
                            <p className="text-gray-500">Drag & drop an Excel file here, or click to browse</p>
                        )}
                    </div>

                    {/* File Input */}
                    <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} className="mt-3 block w-full text-sm" />

                    {/* Action Buttons */}
                    <div className="flex justify-end mt-4 space-x-2">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400">
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            className={`px-4 py-2 rounded-md text-white ${loading ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Uploading..." : "Upload"}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderDeleteModal = () => (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded shadow-lg w-full max-w-md p-6">
                <h3 className="text-xl font-bold mb-4"> Delete Student </h3>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-3 bg-white text-gray-500 text-sm font-medium">
                            {'Delete Student'}
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
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Students</h2>
                    <div className="flex items-center space-x-4">
                        {/* Search Input */}
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                        {/* Add Student Button */}
                        <button
                            onClick={() => {
                                setIsAdding(true)
                                setIsEditing(false)
                                setEditedStudent({
                                    id: 0,
                                    school_number: "",
                                    first_name: "",
                                    father_name: "",
                                    last_name: "",
                                    grade_level: "",
                                    parent_name: "",
                                    parent_email: "",
                                    parent_phone_number: "",
                                    student_address: "",
                                    school_id: 1, // Default to the only school ID
                                })
                            }}
                            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Student
                        </button>

                        {/* Import Button */}
                        <button
                            onClick={() => setModalOpen(true)}
                            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Import Student
                        </button>

                        {/* Modal Component */}
                        <ImportStudentModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />


                        <button
                            onClick={() => { handleExportTemplate() }}
                            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 flex items-center"
                        >
                            Export Template
                        </button>
                    </div>
                </div>


                {deletMondal && renderDeleteModal()}

                {/* Add/Edit Form */}
                {(isAdding || isEditing) && (
                    <form onSubmit={isAdding ? handleAddStudent : handleEditStudent} className="space-y-4 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label htmlFor="school_number" className="text-sm font-medium text-gray-700 mb-1">
                                    School Number
                                </label>
                                <input
                                    type="text"
                                    id="school_number"
                                    name="school_number"
                                    value={editedStudent?.school_number || ""}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="first_name" className="text-sm font-medium text-gray-700 mb-1">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="first_name"
                                    name="first_name"
                                    value={editedStudent?.first_name || ""}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="father_name" className="text-sm font-medium text-gray-700 mb-1">
                                    Father Name
                                </label>
                                <input
                                    type="text"
                                    id="father_name"
                                    name="father_name"
                                    value={editedStudent?.father_name || ""}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="last_name" className="text-sm font-medium text-gray-700 mb-1">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="last_name"
                                    name="last_name"
                                    value={editedStudent?.last_name || ""}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="grade_level" className="text-sm font-medium text-gray-700 mb-1">
                                    Grade Level
                                </label>
                                <input
                                    type="text"
                                    id="grade_level"
                                    name="grade_level"
                                    value={editedStudent?.grade_level || ""}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="parent_name" className="text-sm font-medium text-gray-700 mb-1">
                                    Parent Name
                                </label>
                                <input
                                    type="text"
                                    id="parent_name"
                                    name="parent_name"
                                    value={editedStudent?.parent_name || ""}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="parent_email" className="text-sm font-medium text-gray-700 mb-1">
                                    Parent Email
                                </label>
                                <input
                                    type="email"
                                    id="parent_email"
                                    name="parent_email"
                                    value={editedStudent?.parent_email || ""}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="parent_phone_number" className="text-sm font-medium text-gray-700 mb-1">
                                    Parent Phone Number
                                </label>
                                <input
                                    type="text"
                                    id="parent_phone_number"
                                    name="parent_phone_number"
                                    value={editedStudent?.parent_phone_number || ""}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="student_address" className="text-sm font-medium text-gray-700 mb-1">
                                    Student Address
                                </label>
                                <input
                                    type="text"
                                    id="student_address"
                                    name="student_address"
                                    value={editedStudent?.student_address || ""}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="school_id" className="text-sm font-medium text-gray-700 mb-1">
                                    School
                                </label>
                                <select
                                    id="school_id"
                                    name="school_id"
                                    value={editedStudent?.school_id || ""}
                                    onChange={handleInputChange}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                >
                                    {schools.map((school) => (
                                        <option key={school.id} value={school.id}>
                                            {school.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200"
                        >
                            {isAdding ? "Add Student" : "Update Student"}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsAdding(false)
                                setIsEditing(false)
                            }}
                            className="w-full bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 mt-2"
                        >
                            Cancel
                        </button>
                    </form>
                )}

                {/* Students List */}
                <div className="space-y-4">
                    {students.map((student) => (
                        <div
                            key={student.id}
                            onClick={() => handleRowClick(student)}
                            className="bg-gray-50 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{student.first_name} {student.last_name}</h3>
                                    <p className="text-sm text-gray-600">{student.school_number}</p>
                                </div>
                                <div className="flex space-x-2">

                                    <button
                                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 border border-blue-300 text-blue-600 
                                                        rounded-md text-sm font-medium hover:bg-blue-100 transition-colors duration-200 
                                                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        onClick={(e) => {
                                            e.stopPropagation() // Prevent row click
                                            setIsEditing(true)
                                            setIsAdding(false)
                                            setEditedStudent(student)
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        {/* <span>Edit</span> */}
                                    </button>


                                    {/* <button
                                        onClick={(e) => {
                                            e.stopPropagation() // Prevent row click
                                            handleDeleteStudent(student.id)
                                        }}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button> */}

                                    <button
                                        className="inline-flex items-center px-3 py-1.5 bg-red-50 border border-red-300 text-red-600 
                                                rounded-md text-sm font-medium hover:bg-red-100 transition-colors duration-200
                                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        onClick={(e) => {
                                            e.stopPropagation() // Prevent row click
                                            setDeletMondal(true);
                                            setCurrentStudent({
                                                id: student.id,
                                            });
                                        }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        {/* <span>Delete</span> */}
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="mt-6">
                    <Pagination paginationMeta={paginationMeta} onPageChange={handlePageChange} />
                </div>
            </div>

            {/* Student Details Modal */}
            {selectedStudent && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Student Details</h2>
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">School Number</label>
                                <p className="text-lg text-gray-900">{selectedStudent.school_number}</p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">First Name</label>
                                <p className="text-lg text-gray-900">{selectedStudent.first_name}</p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Father Name</label>
                                <p className="text-lg text-gray-900">{selectedStudent.father_name}</p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                <p className="text-lg text-gray-900">{selectedStudent.last_name}</p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Grade Level</label>
                                <p className="text-lg text-gray-900">{selectedStudent.grade_level}</p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                                <p className="text-lg text-gray-900">{selectedStudent.parent_name}</p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Parent Email</label>
                                <p className="text-lg text-gray-900">{selectedStudent.parent_email}</p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Parent Phone Number</label>
                                <p className="text-lg text-gray-900">{selectedStudent.parent_phone_number}</p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Student Address</label>
                                <p className="text-lg text-gray-900">{selectedStudent.student_address}</p>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">School</label>
                                <p className="text-lg text-gray-900">{schools.find((school) => school.id === selectedStudent.school_id)?.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="w-full bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 mt-4"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    )
}

export default StudentsCRUD