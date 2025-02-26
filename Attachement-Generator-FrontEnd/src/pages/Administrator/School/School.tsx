"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import apiClient from '../../../api/axios';
import { Edit2 } from "lucide-react"

interface School {
    id: number
    name: string
    address: string
    contact_email: string
    phone_number_1: string
    phone_number_2: string
    company_image: string | null
    company_website: string
    tin: string
    created_at: string
    updated_at: string
}

const SchoolDetails: React.FC = () => {
    const [school, setSchool] = useState<School | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [editedSchool, setEditedSchool] = useState<School | null>(null)

    useEffect(() => {
        fetchSchoolDetails()
    }, [])

    const fetchSchoolDetails = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get("/schools")
            console.log("API Response:", response.data) // Log the response
            const schoolData = response.data.data[0] // Access the first item in the `data` array
            setSchool(schoolData)
            setEditedSchool(schoolData) // Initialize editedSchool with the fetched data
        } catch (error: any) {
            console.error("Error fetching school details:", error)
            toast.error("Failed to fetch school details. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setEditedSchool((prev) => ({ ...prev!, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await apiClient.put(`/schools/${editedSchool?.id}`, editedSchool) // Use the school ID dynamically
            setSchool(editedSchool)
            setIsEditing(false)
            toast.success("School details updated successfully!")
        } catch (error: any) {
            console.error("Error updating school details:", error)
            toast.error("Failed to update school details. Please try again.")
        }
    }

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
                    <h2 className="text-2xl font-bold text-gray-800">School Details</h2>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 flex items-center"
                    >
                        <Edit2 className="w-4 h-4 mr-2" />
                        {isEditing ? "Cancel" : "Edit"}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div className="flex flex-col">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={editedSchool?.name || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                }`}
                        />
                    </div>

                    {/* Address Field */}
                    <div className="flex flex-col">
                        <label htmlFor="address" className="text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={editedSchool?.address || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                }`}
                        />
                    </div>

                    {/* Contact Email Field */}
                    <div className="flex flex-col">
                        <label htmlFor="contact_email" className="text-sm font-medium text-gray-700 mb-1">
                            Contact Email
                        </label>
                        <input
                            type="email"
                            id="contact_email"
                            name="contact_email"
                            value={editedSchool?.contact_email || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                }`}
                        />
                    </div>

                    {/* Phone Number 1 Field */}
                    <div className="flex flex-col">
                        <label htmlFor="phone_number_1" className="text-sm font-medium text-gray-700 mb-1">
                            Phone Number 1
                        </label>
                        <input
                            type="text"
                            id="phone_number_1"
                            name="phone_number_1"
                            value={editedSchool?.phone_number_1 || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                }`}
                        />
                    </div>

                    {/* Phone Number 2 Field */}
                    <div className="flex flex-col">
                        <label htmlFor="phone_number_2" className="text-sm font-medium text-gray-700 mb-1">
                            Phone Number 2
                        </label>
                        <input
                            type="text"
                            id="phone_number_2"
                            name="phone_number_2"
                            value={editedSchool?.phone_number_2 || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                }`}
                        />
                    </div>

                    {/* Company Image Field */}
                    <div className="flex flex-col">
                        <label htmlFor="company_image" className="text-sm font-medium text-gray-700 mb-1">
                            Company Image
                        </label>
                        <input
                            type="text"
                            id="company_image"
                            name="company_image"
                            value={editedSchool?.company_image || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                }`}
                        />
                    </div>

                    {/* Company Website Field */}
                    <div className="flex flex-col">
                        <label htmlFor="company_website" className="text-sm font-medium text-gray-700 mb-1">
                            Company Website
                        </label>
                        <input
                            type="text"
                            id="company_website"
                            name="company_website"
                            value={editedSchool?.company_website || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                }`}
                        />
                    </div>

                    {/* TIN Field */}
                    <div className="flex flex-col">
                        <label htmlFor="tin" className="text-sm font-medium text-gray-700 mb-1">
                            TIN
                        </label>
                        <input
                            type="text"
                            id="tin"
                            name="tin"
                            value={editedSchool?.tin || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className={`px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 ${!isEditing ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                                }`}
                        />
                    </div>

                    {/* Update Button (Visible Only in Edit Mode) */}
                    {isEditing && (
                        <button
                            type="submit"
                            className="w-full bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition-colors duration-200"
                        >
                            Update School Details
                        </button>
                    )}
                </form>
            </div>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </div>
    )
}

export default SchoolDetails