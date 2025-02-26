import React, { useEffect, useState } from 'react';
import { Bell, Menu } from 'lucide-react';

interface TopBarProps {
    onSidebarToggle: () => void;
    isSidebarOpen: boolean;
    isMobile: boolean;
}

interface NotificationDropdownProps {
    isOpen: boolean;
    onToggle: () => void;
}

interface NotificationItemProps {
    title: string;
    time: string;
}

interface ProfileDropdownProps {
    isOpen: boolean;
    onToggle: () => void;
    user: { name?: string; email?: string; } | null;
    onLogout: () => void;
}

interface ProfileMenuItemProps {
    text: string;
    onClick?: () => void;
    className?: string;
}

export default function TopBar({ onSidebarToggle, isSidebarOpen, isMobile }: TopBarProps) {
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser({ name: parsedUser.user.name, email: parsedUser.user.email });
            } catch (error) {
                console.error('Error parsing user data:', error);
            }
        }
    }, []);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        setShowProfileMenu(false);
    };

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
        setShowNotifications(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.notification-area') && !target.closest('.profile-area')) {
                setShowNotifications(false);
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm top-bar">
            <div className="flex items-center justify-between px-4 py-3 lg:px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onSidebarToggle}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        aria-label="Toggle Sidebar"
                    >
                        <Menu className="h-6 w-6 text-gray-600" />
                    </button>
                    <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
                        Flipper International School
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <NotificationDropdown
                        isOpen={showNotifications}
                        onToggle={toggleNotifications}
                    />
                    <ProfileDropdown
                        isOpen={showProfileMenu}
                        onToggle={toggleProfileMenu}
                        user={user}
                        onLogout={handleLogout}
                    />
                </div>
            </div>
        </header>
    );
}

const NotificationDropdown = ({ isOpen, onToggle }: NotificationDropdownProps) => (
    <div className="notification-area relative">
        <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative"
            onClick={onToggle}
        >
            <Bell className="h-6 w-6 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
        </button>

        {isOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-700">Notifications</h3>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    <NotificationItem
                        title="New user registered"
                        time="2 minutes ago"
                    />
                    <NotificationItem
                        title="New car added"
                        time="1 hour ago"
                    />
                </div>
            </div>
        )}
    </div>
);

const NotificationItem = ({ title, time }: NotificationItemProps) => (
    <div className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer">
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
);

const ProfileDropdown = ({ isOpen, onToggle, user, onLogout }: ProfileDropdownProps) => (
    <div className="profile-area relative">
        <button
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={onToggle}
        >
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-medium">
                {user?.name?.split(' ')
                    .map(word => word.charAt(0))
                    .join('')
                    .toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user?.name || 'User'}
            </span>
        </button>

        {isOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                    <p className="font-medium text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                </div>
                <div className="p-2">
                    <ProfileMenuItem text="Profile" />
                    <ProfileMenuItem text="Settings" />
                    <ProfileMenuItem
                        text="Logout"
                        onClick={onLogout}
                        className="text-red-600 hover:bg-red-50"
                    />
                </div>
            </div>
        )}
    </div>
);

const ProfileMenuItem = ({ text, onClick, className = "text-gray-700 hover:bg-gray-50" }: ProfileMenuItemProps) => (
    <button
        className={`w-full text-left px-3 py-2 text-sm rounded-md ${className}`}
        onClick={onClick}
    >
        {text}
    </button>
);