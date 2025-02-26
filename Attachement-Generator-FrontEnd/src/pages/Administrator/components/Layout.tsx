import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './sidebar';
import TopBar from './top-bar';
import { Menu } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        return window.innerWidth >= 1024;
    });
    const [isMobile, setIsMobile] = useState(false);
    const location = useLocation();
    const routesWithoutLayout = ['/login', '/sign-up'];

    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const isCurrentlyMobile = window.innerWidth < 1024;
            setIsMobile(isCurrentlyMobile);

            if (isCurrentlyMobile !== isMobile) {
                setSidebarOpen(!isCurrentlyMobile);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile]);

    if (routesWithoutLayout.includes(location.pathname)) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed lg:relative inset-y-0 left-0 z-40 w-64 transform 
                    transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            </aside>

            {/* Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <TopBar
                    onSidebarToggle={toggleSidebar}
                    isSidebarOpen={sidebarOpen}
                    isMobile={isMobile}
                />

                <main className="flex-1 overflow-y-auto bg-gray-100">
                    <div className={`container mx-auto px-4 sm:px-6 lg:px-8 py-8 transition-all duration-300
                        ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}`}
                    >
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
