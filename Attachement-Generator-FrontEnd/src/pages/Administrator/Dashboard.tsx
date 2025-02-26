import Layout from './components/Layout';
import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Tooltip } from "recharts";

const data = [
    {
        name: "Jan",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Feb",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Mar",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Apr",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "May",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Jun",
        total: Math.floor(Math.random() * 5000) + 1000,
    }, {
        name: "Jan",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Feb",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Mar",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Apr",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "May",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
    {
        name: "Jun",
        total: Math.floor(Math.random() * 5000) + 1000,
    },
];

const Dashboard: React.FC = () => {
    return (
        <>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
                <div className="border rounded-lg shadow p-4">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium">Total Users</h3>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold">1,234</div>
                    <p className="text-xs text-muted-foreground">+180 from last month</p>
                </div>
                <div className="border rounded-lg shadow p-4">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium">Total Cars</h3>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M16 6l2 2l4-4" />
                            <path d="M8.5 2A6.5 6.5 0 0 1 15 8.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 8.5 15a6.5 6.5 0 1 1 0-13" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold">5,678</div>
                    <p className="text-xs text-muted-foreground">+201 from last month</p>
                </div>
                <div className="border rounded-lg shadow p-4">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium">Active Users</h3>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold">573</div>
                    <p className="text-xs text-muted-foreground">+201 since last hour</p>
                </div>
                <div className="border rounded-lg shadow p-4">
                    <div className="flex flex-row items-center justify-between pb-2">
                        <h3 className="text-sm font-medium">Active Rentals</h3>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                    <div className="text-2xl font-bold">423</div>
                    <p className="text-xs text-muted-foreground">+18 from yesterday</p>
                </div>
            </div>
            {/* <div className="mt-6">
                <div className="border rounded-lg shadow p-4">
                    <div className="pb-2">
                        <h3 className="text-lg font-semibold">Monthly Revenue</h3>
                    </div>
                    <div className="flex items-end space-x-2 h-64">
                        {data.map((item, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center"
                                style={{ height: `${(item.total / 5000) * 100}%` }}
                            >
                                <div className="bg-green-500 w-8 rounded-t-md" style={{ height: '100%' }}></div>
                                <span className="text-xs mt-2">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div> */}

            <div className="mt-6">
                <div className="card shadow-md rounded-lg p-4 bg-white">
                    <div className="card-header mb-4">
                        <h3 className="text-lg font-semibold text-gray-700">Monthly Revenue</h3>
                    </div>
                    <div className="card-content">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#6B7280"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                                />
                                <Tooltip
                                    formatter={(value: number) => `$${value.toLocaleString()}`}
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "8px",
                                        fontSize: "12px",
                                    }}
                                    cursor={{ fill: "#f3f4f6" }}
                                />
                                <Bar
                                    dataKey="total"
                                    fill="#34D399"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
