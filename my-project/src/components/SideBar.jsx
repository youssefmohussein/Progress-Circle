import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, CheckSquare, Trophy,
    User, LogOut, Moon, Sun, Menu, X, Shield, Plus, Repeat
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar } from './Avatar';

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/habits', icon: Repeat, label: 'Habits' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' },
];

const sidebarBase = {
    background: 'linear-gradient(180deg,#1e1b4b 0%,#0f0e2a 100%)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    color: '#fff',
};

function SidebarContent({ onClose }) {
    const location = useLocation();
    const { logout, user } = useAuth();
    const { dark, toggleDark } = useTheme();

    return (
        <div style={sidebarBase}>
            {/* Logo */}
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }} className="flex items-center justify-between">
                <div>
                    <span style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>
                        Progress<span style={{ color: '#818cf8' }}>Circle</span>
                    </span>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Productivity Suite</p>
                </div>
                {onClose && (
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4 }}>
                        <X size={20} />
                    </button>
                )}
            </div>


            {/* User card */}
            {user && (
                <div style={{ margin: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar src={user.avatar} name={user.name} size="sm" />
                    <div style={{ overflow: 'hidden' }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{user.points ?? 0} pts</p>
                    </div>
                </div>
            )}

            {/* Nav links */}
            <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {navItems.map(({ path, icon: Icon, label }) => {
                    const active = location.pathname === path;
                    return (
                        <Link
                            key={path}
                            to={path}
                            onClick={onClose}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 10,
                                padding: '9px 14px', borderRadius: '0.75rem',
                                textDecoration: 'none', fontSize: 14, fontWeight: 500,
                                transition: 'all 0.18s',
                                background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
                                color: active ? '#a5b4fc' : 'rgba(255,255,255,0.6)',
                                border: active ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                            }}
                        >
                            <Icon size={17} style={{ color: active ? '#818cf8' : undefined }} />
                            {label}
                            {active && <div style={{ marginLeft: 'auto', width: 6, height: 6, background: '#818cf8', borderRadius: '50%' }} />}
                        </Link>
                    );
                })}
                {user?.isAdmin && (
                    <Link to="/admin" onClick={onClose} style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 14px', borderRadius: '0.75rem', textDecoration: 'none',
                        fontSize: 14, fontWeight: 500, color: 'rgba(167,139,250,0.8)',
                        transition: 'all 0.18s',
                    }}>
                        <Shield size={17} style={{ color: '#a78bfa' }} /> Admin
                    </Link>
                )}
            </nav>

            {/* Bottom actions */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                <button onClick={toggleDark} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '9px 14px', borderRadius: '0.75rem', background: 'none',
                    border: 'none', color: 'rgba(255,255,255,0.5)', fontSize: 14,
                    cursor: 'pointer', transition: 'all 0.18s',
                }}>
                    {dark ? <Sun size={17} /> : <Moon size={17} />}
                    {dark ? 'Light Mode' : 'Dark Mode'}
                </button>
                <button onClick={logout} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '9px 14px', borderRadius: '0.75rem', background: 'none',
                    border: 'none', color: 'rgba(252,165,165,0.7)', fontSize: 14,
                    cursor: 'pointer', transition: 'all 0.18s',
                }}>
                    <LogOut size={17} /> Logout
                </button>
            </div>
        </div>
    );
}

export function Sidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    // Bottom nav primary items
    const bottomNavItems = [
        { path: '/', icon: LayoutDashboard, label: 'Home' },
        { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex" style={{ position: 'fixed', left: 0, top: 0, height: '100vh', width: 256, flexDirection: 'column', zIndex: 40 }}>
                <SidebarContent />
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden flex justify-around items-center" style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 45,
                background: 'var(--color-surface)',
                borderTop: '1px solid var(--color-border)',
                padding: '12px 16px', paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
            }}>
                {bottomNavItems.map(({ path, icon: Icon, label }) => {
                    const active = location.pathname === path;
                    return (
                        <Link key={path} to={path} style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                            textDecoration: 'none', color: active ? '#6366f1' : 'var(--color-text-muted)',
                            transition: 'color 0.2s'
                        }}>
                            <Icon size={20} className={active ? 'drop-shadow-sm' : ''} />
                            <span style={{ fontSize: '10px', fontWeight: active ? 700 : 500 }}>{label}</span>
                        </Link>
                    );
                })}

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileOpen(true)}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                        background: 'none', border: 'none', color: 'var(--color-text-muted)',
                        cursor: 'pointer'
                    }}
                >
                    <Menu size={20} />
                    <span style={{ fontSize: '10px', fontWeight: 500 }}>Menu</span>
                </button>
            </div>

            {/* Mobile drawer (for the rest of the links) */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }}
                        />
                        <motion.div
                            initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            style={{ position: 'fixed', left: 0, top: 0, height: '100vh', width: 256, zIndex: 60 }}
                        >
                            <SidebarContent onClose={() => setMobileOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}