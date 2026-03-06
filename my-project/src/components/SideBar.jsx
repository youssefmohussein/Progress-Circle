import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, CheckSquare, Trophy,
    User, LogOut, Moon, Sun, X, Shield, Repeat, MoreHorizontal, HelpCircle,
    Wallet, Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar } from './Avatar';

const baseNavItems = [
    { path: '/', icon: LayoutDashboard, label: 'Home' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { path: '/habits', icon: Repeat, label: 'Habits' },
    { path: '/leaderboard', icon: Trophy, label: 'Board' },
    { path: '/profile', icon: User, label: 'Profile' },
];

function getNavItems(user) {
    let items = [...baseNavItems];
    if (user?.savingsEnabled) {
        // Insert before Profile
        items.splice(items.length - 1, 0, { path: '/savings', icon: Wallet, label: 'Savings' });
    }
    if (user?.fitnessEnabled) {
        items.splice(items.length - 1, 0, { path: '/fitness', icon: Activity, label: 'Fitness' });
    }
    return items;
}

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
                {getNavItems(user).map(({ path, icon: Icon, label }) => {
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
                <Link to="/info" onClick={onClose} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '9px 14px', borderRadius: '0.75rem', background: 'none',
                    border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 14, textDecoration: 'none',
                    transition: 'all 0.18s',
                }}>
                    <HelpCircle size={17} /> How It Works
                </Link>
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

/* ─── Mobile "More" drawer ────────────────────────────────── */
function MoreDrawer({ onClose }) {
    const { dark, toggleDark } = useTheme();
    const { logout, user } = useAuth();

    const drawerStyle = {
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 60,
        background: 'linear-gradient(180deg,#1e1b4b 0%,#0f0e2a 100%)',
        borderRadius: '20px 20px 0 0',
        padding: '8px 0 calc(16px + env(safe-area-inset-bottom))',
    };

    const rowStyle = {
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 20px', color: 'rgba(255,255,255,0.75)',
        fontSize: 15, fontWeight: 500, cursor: 'pointer',
        background: 'none', border: 'none', width: '100%',
        textDecoration: 'none',
    };

    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 55 }}
            />
            <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                style={drawerStyle}
            >
                {/* Handle */}
                <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 99, margin: '4px auto 12px' }} />

                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                        <Avatar src={user.avatar} name={user.name} size="sm" />
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{user.name}</p>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{user.points ?? 0} pts</p>
                        </div>
                    </div>
                )}

                {user?.isAdmin && (
                    <Link to="/admin" onClick={onClose} style={{ ...rowStyle }}>
                        <Shield size={19} style={{ color: '#a78bfa' }} />
                        <span>Admin Panel</span>
                    </Link>
                )}

                <Link to="/info" onClick={onClose} style={rowStyle}>
                    <HelpCircle size={19} />
                    <span>How It Works</span>
                </Link>

                <button onClick={() => { toggleDark(); }} style={rowStyle}>
                    {dark ? <Sun size={19} style={{ color: '#fbbf24' }} /> : <Moon size={19} style={{ color: '#818cf8' }} />}
                    <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
                </button>

                <button onClick={logout} style={{ ...rowStyle, color: 'rgba(252,165,165,0.85)' }}>
                    <LogOut size={19} />
                    <span>Logout</span>
                </button>
            </motion.div>
        </>
    );
}

export function Sidebar() {
    const [moreOpen, setMoreOpen] = useState(false);
    const location = useLocation();
    const { user } = useAuth();

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex" style={{ position: 'fixed', left: 0, top: 0, height: '100vh', width: 256, flexDirection: 'column', zIndex: 40 }}>
                <SidebarContent />
            </div>

            {/* ── Mobile Bottom Navigation ── */}
            <nav
                className="flex lg:hidden items-center justify-around"
                style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 45,
                    background: 'linear-gradient(180deg,#1e1b4b 0%,#0f0e2a 100%)',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    padding: '6px 4px calc(6px + env(safe-area-inset-bottom))',
                }}
            >
                {getNavItems(user).filter((_, i) => i < 5).map(({ path, icon: Icon, label }) => {
                    const active = location.pathname === path;
                    return (
                        <Link
                            key={path}
                            to={path}
                            style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                                textDecoration: 'none', flex: 1, padding: '6px 0',
                                color: active ? '#a5b4fc' : 'rgba(255,255,255,0.4)',
                                transition: 'color 0.2s',
                                minHeight: 44,  /* accessibility tap target */
                                justifyContent: 'center',
                                position: 'relative',
                            }}
                        >
                            {active && (
                                <motion.div
                                    layoutId="bottom-nav-active"
                                    style={{
                                        position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)',
                                        width: 28, height: 2, background: '#818cf8', borderRadius: '0 0 99px 99px',
                                    }}
                                />
                            )}
                            <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                            <span style={{ fontSize: '9px', fontWeight: active ? 700 : 500, letterSpacing: '0.04em' }}>{label}</span>
                        </Link>
                    );
                })}

                {/* More button */}
                <button
                    onClick={() => setMoreOpen(true)}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                        background: 'none', border: 'none', flex: 1, padding: '6px 0',
                        color: 'rgba(255,255,255,0.4)', cursor: 'pointer', minHeight: 44,
                        justifyContent: 'center',
                    }}
                >
                    <MoreHorizontal size={20} strokeWidth={1.8} />
                    <span style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.04em' }}>More</span>
                </button>
            </nav>

            {/* Mobile More drawer */}
            <AnimatePresence>
                {moreOpen && <MoreDrawer onClose={() => setMoreOpen(false)} />}
            </AnimatePresence>
        </>
    );
}