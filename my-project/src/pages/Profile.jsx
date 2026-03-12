import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    User, Mail, Calendar, Trophy, Zap, Shield, 
    Palette, Sun, Moon, Sparkles, ChevronRight,
    Music, Link2, ExternalLink, Check, Star, ShoppingBag, Sprout,
    Flame, Snowflake, Crown, TrendingUp, RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useGamification } from '../context/GamificationContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { AvatarDisplay } from '../components/AvatarDisplay';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { StatCard } from '../components/StatCard';
import { StreakCalendar } from '../components/StreakCalendar';
import api from '../api/client';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useTheme } from '../context/ThemeContext';

export function Profile() {
    const { user, setUser } = useAuth();
    const { tasks } = useData();
    const { gamData } = useGamification();
    const [updating, setUpdating] = useState(false);
    
    // Music Preferences Local States
    const [musicPlatform, setMusicPlatform] = useState(user?.musicPreferences?.platform || '');
    const [playlistUrl, setPlaylistUrl] = useState(user?.musicPreferences?.playlistUrl || '');
    const [isSavingMusic, setIsSavingMusic] = useState(false);

    const { theme, updateTheme, resetToDefaults, dark, toggleDark } = useTheme();

    if (!user || !tasks) return <LoadingSpinner />;

    const toggleModule = async (module) => {
        try {
            setUpdating(true);
            const res = await api.put('/users/profile', {
                [module]: !user[module]
            });
            if (res.data?.success) {
                setUser(res.data.data);
                toast.success('Module preferences updated.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update preferences');
        } finally {
            setUpdating(false);
        }
    };

    const saveMusicPreferences = async () => {
        try {
            setIsSavingMusic(true);
            const res = await api.put('/users/profile', {
                musicPreferences: {
                    platform: musicPlatform,
                    playlistUrl
                }
            });
            if (res.data?.success) {
                setUser(res.data.data);
                toast.success('Music preferences synced with profile.');
            }
        } catch (error) {
            toast.error('Failed to sync music preferences');
        } finally {
            setIsSavingMusic(false);
        }
    };

    const saveThemePreference = async (newPrefs) => {
        try {
            // Update context immediately
            updateTheme(newPrefs);
            
            // Sync with backend
            const res = await api.put('/users/profile', {
                themePreferences: { ...theme, ...newPrefs }
            });
            
            if (res.data?.success) {
                setUser(res.data.data);
            }
        } catch (error) {
            toast.error('Failed to save theme choice');
        }
    };

    const handleToggleMode = async (mode) => {
        await saveThemePreference({ mode, bg: '', surface: '', surface2: '' });
    };

    const handleRestoreDefaults = async () => {
        try {
            const defaults = resetToDefaults();
            const res = await api.put('/users/profile', {
                themePreferences: defaults
            });
            if (res.data?.success) {
                setUser(res.data.data);
                toast.success('Restored to original colors');
            }
        } catch (error) {
            toast.error('Failed to restore defaults');
        }
    };

    const universeThemes = [
        { name: 'Indigo Core', primary: '#6366f1', accent: '#8b5cf6', bg: '#0b0d12', surface: '#151824' },
        { name: 'Neon Cyber', primary: '#0ea5e9', accent: '#f43f5e', bg: '#020617', surface: '#0f172a' },
        { name: 'Emerald Vault', primary: '#10b981', accent: '#059669', bg: '#061a12', surface: '#0d2d21' },
        { name: 'Sunset Focus', primary: '#f59e0b', accent: '#dc2626', bg: '#1a1005', surface: '#2d1c0d' },
        { name: 'Deep Space', primary: '#a855f7', accent: '#6366f1', bg: '#000000', surface: '#0a0a0a' },
        { name: 'Midnight Bloom', primary: '#ec4899', accent: '#8b5cf6', bg: '#0f172a', surface: '#1e293b' },
        { name: 'Arctic Frost', primary: '#38bdf8', accent: '#0ea5e9', bg: '#0f172a', surface: '#1e293b' },
    ];

    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const joined = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '';

    return (
        <div className="space-y-5 max-w-3xl">
            {/* Profile header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pc-card">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
                    <div className="relative">
                        <AvatarDisplay avatarConfig={gamData?.avatarConfig} size="xl" />
                    </div>
                    <div className="flex-1">
                        <h2 style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--text)', fontSize: 'clamp(1.25rem, 5vw, 1.5rem)', fontWeight: 700 }}>{user.name}</h2>
                        <p className="text-sm text-muted">{user.email}</p>

                        <div className="flex items-center gap-2 mt-2">
                            {user.plan === 'premium' ? (
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                                    color: '#fff', fontSize: '11px', fontWeight: 700,
                                    padding: '2px 10px', borderRadius: '999px',
                                }}>
                                    <Crown size={11} /> Premium
                                </span>
                            ) : (
                                <Link to="/pricing" style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                                    background: 'rgba(var(--primary-rgb), 0.12)', color: 'var(--primary)',
                                    fontSize: '11px', fontWeight: 700,
                                    padding: '2px 10px', borderRadius: '999px', textDecoration: 'none',
                                }}>
                                    ✦ Upgrade to Premium
                                </Link>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 mt-2 text-sm text-muted">
                            <span className="font-semibold text-primary">{user.points || 0} pts</span>
                            <span className="hidden sm:inline">·</span>
                            <span>{user.streak || 0} day streak 🔥</span>
                            {gamData && <><span className="hidden sm:inline">·</span><span>🌳 {gamData.trees?.length || 0} trees</span></>}
                            {joined && <><span className="hidden sm:inline">·</span><span className="text-xs">Since {joined}</span></>}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
                <StatCard label="Tasks Done" value={completedTasks} icon={Trophy} color="primary" delay={0} />
                <StatCard label="Total Nodes" value={tasks.length} icon={Calendar} color="orange" delay={0.05} />
            </div>

            {/* Theme Studio */}
            <Card className="border-primary/20 bg-white/[0.02]">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Palette className="pc-gradient-text" size={22} />
                        <h2 className="text-xl font-black" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Universe Themes</h2>
                    </div>
                    <div className="flex bg-white/5 rounded-xl p-1 gap-1">
                        <button 
                            onClick={handleRestoreDefaults}
                            className="p-2 rounded-lg text-pc-muted hover:text-white transition-all"
                            title="Restore Defaults"
                        >
                            <RotateCcw size={14} />
                        </button>
                        <div className="w-[1px] h-4 bg-white/10 my-auto mx-1" />
                        <button 
                            onClick={() => handleToggleMode('light')}
                            className={`p-2 rounded-lg transition-all ${!dark && !theme.bg ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-pc-muted hover:text-white'}`}
                        >
                            <Sun size={14} />
                        </button>
                        <button 
                            onClick={() => handleToggleMode('dark')}
                            className={`p-2 rounded-lg transition-all ${dark && !theme.bg ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-pc-muted hover:text-white'}`}
                        >
                            <Moon size={14} />
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Immersive Presets */}
                    {user.plan === 'premium' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {universeThemes.map((t) => (
                                <button
                                    key={t.name}
                                    onClick={() => saveThemePreference({ 
                                        primaryColor: t.primary, 
                                        accentColor: t.accent,
                                        bg: t.bg,
                                        surface: t.surface,
                                        mode: 'dark'
                                    })}
                                    className={`group relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all overflow-hidden ${
                                        theme.primaryColor === t.primary ? 'bg-white/[0.07] border-primary/40 ring-1 ring-primary/40' : 'bg-white/5 border-transparent hover:border-white/20'
                                    } border`}
                                >
                                    <div className="flex gap-2">
                                        <div className="w-5 h-5 rounded-full shadow-lg" style={{ background: t.primary }} />
                                        <div className="w-5 h-5 rounded-full shadow-lg" style={{ background: t.accent }} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors">{t.name}</span>
                                    {theme.primaryColor === t.primary && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden flex flex-col items-center text-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 pointer-events-none" />
                            <Lock className="text-amber-500 mb-3 opacity-80" size={32} />
                            <h4 className="text-sm font-black text-white mb-2">Pro Feature Locked</h4>
                            <p className="text-xs text-pc-muted mb-4 max-w-xs">
                                Upgrade to Premium to unlock immersive Universe Themes and customize your entire Progress Circle experience.
                            </p>
                            <Link to="/pricing">
                                <Button className="relative z-10 px-6 py-2 rounded-xl text-xs font-black shadow-lg shadow-amber-500/20" variant="primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                                    <Crown size={14} className="mr-2 inline" /> Unlock Themes
                                </Button>
                            </Link>
                        </div>
                    )}

                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                        <Sparkles className="text-primary/70 shrink-0" size={16} />
                        <p className="text-[10px] text-pc-muted font-medium leading-relaxed">
                            Universe Presets are immersive transformations. Selecting one transforms the colors, gradients, and atmospheric lighting of your entire platform.
                        </p>
                    </div>
                </div>
            </Card>

            {/* System Modules */}
            <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
                    <TrendingUp size={80} />
                </div>
                <h3 className="text-lg font-black mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>System Modules</h3>
                <p className="text-xs text-pc-muted mb-6">Activate specialized nodes to expand your productivity horizon.</p>

                <div className="space-y-3">
                    {[
                        { key: 'habitsEnabled', label: 'Habit Engine', desc: 'Core routine tracking and consistency loops.', icon: 'Repeat', core: true },
                        { key: 'savingsEnabled', label: 'Financial Tracking', desc: 'Track savings, income, and critical expenses.', icon: 'Wallet' },
                        { key: 'fitnessEnabled', label: 'Physical Wellness', desc: 'Workout splits and physical body metrics.', icon: 'Activity' },
                        { key: 'nutritionEnabled', label: 'Nutrition & Fuel', desc: 'Monitor daily intake and meal planning.', icon: 'Salad', comingSoon: true },
                    ].map((mod) => (
                        <div key={mod.key} className="flex justify-between items-center py-3 px-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-sm">{mod.label}</p>
                                    {mod.comingSoon && <span className="text-[8px] font-black bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase">Experimental</span>}
                                </div>
                                <p className="text-[11px] text-pc-muted">{mod.desc}</p>
                            </div>
                            <button
                                disabled={updating || mod.comingSoon}
                                onClick={() => toggleModule(mod.key)}
                                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${user[mod.key] ? 'bg-primary' : 'bg-white/10'}`}
                            >
                                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${user[mod.key] ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
