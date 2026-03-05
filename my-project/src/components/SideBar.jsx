import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    Target,
    Trophy,
    User,
    Calendar,
    LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/habits', icon: Calendar, label: 'Habits' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' },
];

export function Sidebar() {
    const location = useLocation();
    const { logout } = useAuth();

    return (
        <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    Progress Circle
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {navItems.map(item => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-150 ${isActive
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-150 w-full"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}