import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './pages/Administrator/components/Layout';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Dashboard from './pages/Administrator/Dashboard';
import Users from './pages/Administrator/Users/user';
import AcademicCalendars from './pages/Administrator/Academic-Calendar/AcademicCalendars';
import Vats from './pages/Administrator/Vat/Vat';
import Schools from './pages/Administrator/School/School';
import Student from './pages/Administrator/Student/student';
import FeeStructures from './pages/Administrator/FeeStructure/FeeStructures';
import BillingPage from './pages/Administrator/Billing/billing-page';
import ReceiptsPage from './pages/Administrator/Receipts/ReceiptsPage';
import Attachment from './pages/Administrator/Receipts/Attachment';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />

            <Route path="/" element={<Login />} />


            <Route
                path="*"
                element={
                    <Layout>

                        <Routes>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/users" element={<Users />} />
                            <Route path="/academic-calendars" element={<AcademicCalendars />} />
                            <Route path="/vats" element={<Vats />} />
                            <Route path="/schools" element={<Schools />} />
                            <Route path="/students" element={<Student />} />
                            <Route path="/fee-structures" element={<FeeStructures />} />
                            <Route path="/billing" element={<BillingPage />} />
                            <Route path="/receipt" element={<ReceiptsPage />} />
                            <Route path="/Attachment" element={<Attachment />} />
                        </Routes>

                    </Layout>
                }
            />
        </Routes>
    );
};

export default AppRoutes;