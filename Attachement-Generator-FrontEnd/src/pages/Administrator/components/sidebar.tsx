import { Link, useLocation } from 'react-router-dom';
import {
    Home, Users, Car, ChevronDown, Settings,
    Tag, Gauge, Cog, MessageCircle, Cylinder,
    Calendar,
    School, WalletIcon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import imageSrc from '../../../assets/image.png';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

interface NavItem {
    name: string;
    href: string;
    icon: React.ElementType;
}

interface NavItemProps {
    item: NavItem;
    isActive: boolean;
    onClick: () => void;
}

interface SettingsDropdownProps {
    isOpen: boolean;
    isActive: boolean;
    onToggle: () => void;
    items: NavItem[];
    currentPath: string;
    onItemClick: () => void;
}

interface UserProfileProps {
    user: {
        name?: string;
        email?: string;
    } | null;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const location = useLocation();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSettingOpen, setIsSettingOpen] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    // Navigation items configuration
    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'School', href: '/schools', icon: School },
        { name: 'Students', href: '/students', icon: Users },
        { name: 'Fees', href: '/fee-structures', icon: WalletIcon },
        { name: 'Users', href: '/users', icon: Users },
        // { name: 'Billing', href: '/billing', icon: Users },
        { name: 'Receipt', href: '/receipt', icon: Users },

        // { name: 'Academic Calendar', href: '/academic-calendars', icon: Calendar },
        // { name: 'Vat', href: '/vats', icon: Cylinder },
    ];

    const attachemntSettingItems = [
        { name: 'Academic Calendar', href: '/academic-calendars', icon: Calendar },
        { name: 'Vat', href: '/vats', icon: Cylinder },
    ];

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

    // Check if any settings item is active
    const isSettingActive = attachemntSettingItems.some(item => location.pathname === item.href);

    // Auto-expand settings when a settings page is active
    useEffect(() => {
        if (isSettingActive) {
            setIsSettingsOpen(true);
        }
    }, [isSettingActive]);

    return (
        <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 side-bar">
            {/* Logo Section */}
            <div className="flex items-center h-16 px-6 border-b border-gray-700">
                <Link to="/" className="flex items-center gap-3">
                    <img src={imageSrc} alt="Logo" className="w-10 h-10 rounded-full" />
                    <span className="text-lg font-semibold text-white">FIS</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
                {/* Main Nav Items */}
                <div className="space-y-1">
                    {navItems.map((item) => (
                        <NavItem
                            key={item.name}
                            item={item}
                            isActive={location.pathname === item.href}
                            onClick={onClose}
                        />
                    ))}
                </div>

                <div className="mt-4">
                    <SettingsDropdown
                        isOpen={isSettingOpen}
                        isActive={isSettingActive}
                        onToggle={() => setIsSettingOpen(!isSettingOpen)}
                        items={attachemntSettingItems}
                        currentPath={location.pathname}
                        onItemClick={onClose}
                    />
                </div>
            </nav>

            {/* User Profile */}
            <UserProfile user={user} />
        </div>
    );
}

// Extracted components for better organization
const NavItem = ({ item, isActive, onClick }: NavItemProps) => (
    <Link
        to={item.href}
        onClick={onClick}
        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200
            ${isActive
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
    >
        <item.icon className="w-5 h-5 mr-3" />
        <span className="text-sm font-medium">{item.name}</span>
    </Link>
);


const SettingsDropdown = ({ isOpen, isActive, onToggle, items, currentPath, onItemClick }: SettingsDropdownProps) => (
    <div className="space-y-1">
        <button
            onClick={onToggle}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200
                ${isActive || isOpen ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
        >
            <div className="flex items-center">
                <Cog className="w-5 h-5 mr-3" />
                <span className="text-sm font-medium">Settings</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <div className={`space-y-1 transition-all duration-200 
            ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            {items.map((item) => (
                <NavItem
                    key={item.name}
                    item={{ ...item, name: item.name }}
                    isActive={currentPath === item.href}
                    onClick={onItemClick}
                />
            ))}
        </div>
    </div>
);

const UserProfile = ({ user }: UserProfileProps) => (
    <div className="p-4 border-t border-gray-700">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                    {user?.name?.split(' ')
                        .map(word => word.charAt(0))
                        .join('')
                        .toUpperCase() || 'U'}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
        </div>
    </div>
);

