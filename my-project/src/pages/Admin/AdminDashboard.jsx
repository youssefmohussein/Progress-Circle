import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Trophy, CheckSquare, Target, Trash2, RefreshCw, 
    Search, Filter, Edit3, Shield, Star, Zap, Settings, 
    TrendingUp, BarChart3, Mail, Calendar, Crown, X, Save, 
    AlertTriangle, Activity, Database, Key, Server, Terminal,
    Globe, Lock, Unlock, Gift, ArrowUpRight, Cpu
} from 'lucide-react';
import { adminAPI } from '../../api/adminAPI';
import { StatCard } from '../../components/StatCard';
import { Avatar } from '../../components/Avatar';
import { Button } from '../../components/Button';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Card } from '../../components/Card';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';

export function AdminDashboard() {
    const { user: currentUser, refreshUser } = useAuth();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [rewardAmount, setRewardAmount] = useState(50);
    const [pulseData, setPulseData] = useState([]);
    
    const fetchData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes, settingsRes] = await Promise.all([
                adminAPI.getStats(), 
                adminAPI.getUsers(),
                adminAPI.getSettings()
            ]);
            setStats(statsRes.data.data);
            setUsers(usersRes.data.data);
            setSettings(settingsRes.data.data);
        } catch { toast.error('Shield Interface Failure: Link compromised.'); }
        finally { setLoading(false); }
    };

    useEffect(() => { 
        fetchData();
        // Generate mock pulse data
        setPulseData(Array.from({ length: 40 }, () => Math.random() * 100));
        const interval = setInterval(() => {
            setPulseData(prev => [...prev.slice(1), Math.random() * 100]);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleUpdateUser = async (id, data) => {
        setIsSaving(true);
        try {
            await adminAPI.updateUser(id, data);
            toast.success('CORE OVERWRITE SUCCESSFUL');
            setEditingUser(null);
            fetchData();
            if (currentUser && currentUser.id === id) {
                refreshUser();
            }
        } catch { toast.error('OVERWRITE FAILED: SECURITY PROTOCOL'); }
        finally { setIsSaving(false); }
    };

    const handleToggleSetting = async (key) => {
        const newSettings = { ...settings, [key]: !settings[key] };
        setSettings(newSettings);
        try {
            await adminAPI.updateSettings(newSettings);
            toast.success(`${key.toUpperCase()} STATUS MODIFIED`);
        } catch { toast.error('PROTOCOL UPDATE FAILED'); fetchData(); }
    };

    const handleRewardAll = async () => {
        if (!confirm(`Execute GLOBAL INJECTION of ${rewardAmount} points to ALL biologicals?`)) return;
        try {
            await adminAPI.rewardAll({ points: rewardAmount, reason: 'Admin Bonus' });
            toast.success('GLOBAL INJECTION COMPLETE');
            fetchData();
        } catch { toast.error('INJECTION INTERRUPTED'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('DANGER: This will permanently purge the user data. Proceed?')) return;
        try {
            await adminAPI.deleteUser(id);
            toast.success('PURGE COMPLETE');
            fetchData();
        } catch { toast.error('PURGE INTERRUPTED'); }
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading && !stats) return <div className="h-screen flex items-center justify-center bg-pc-bg"><LoadingSpinner size="lg" /></div>;

    return (
        <div className="min-h-screen pb-20 space-y-10 selection:bg-indigo-500/30">
            {/* Cyber Header */}
            <header className="relative py-10 px-8 rounded-[3rem] border border-white/10 overflow-hidden bg-white/[0.02]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-3 mb-2">
                            <Shield className="text-indigo-500 animate-pulse" size={24} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Security Level: GOD MODE</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black pc-gradient-text leading-tight">
                            Command <span className="text-white opacity-20">/</span> Suite
                        </h1>
                        <p className="text-pc-muted font-medium mt-4 max-w-md leading-relaxed text-sm">
                            Total system sovereignty enabled. Real-time neural monitoring and core protocol authorized.
                        </p>
                    </motion.div>

                    <div className="flex gap-4">
                        <div className="px-8 py-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-xl">
                            <p className="text-[10px] font-black text-pc-muted uppercase tracking-widest mb-1">System Pulse</p>
                            <div className="flex items-end gap-1 h-6">
                                {pulseData.slice(-15).map((h, i) => (
                                    <motion.div 
                                        key={i} 
                                        animate={{ height: `${h}%` }}
                                        className="w-1 bg-indigo-500/40 rounded-full"
                                    />
                                ))}
                            </div>
                            <p className="text-xs font-mono text-indigo-400 mt-2">STABLE / 99.8%</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Matrix Navigation */}
            <nav className="flex flex-wrap gap-3 p-2 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 w-fit mx-auto md:mx-0">
                {[
                    { id: 'overview', label: 'Overview', icon: BarChart3, color: 'indigo' },
                    { id: 'users', label: 'User Matrix', icon: Server, color: 'sky' },
                    { id: 'system', label: 'SysControl', icon: Cpu, color: 'amber' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-8 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                            activeTab === tab.id 
                                ? 'bg-indigo-500 text-white shadow-2xl shadow-indigo-500/40' 
                                : 'text-pc-muted hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </nav>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div 
                        key="overview"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard label="Total Souls" value={stats?.totalUsers} icon={Users} color="indigo" />
                            <StatCard label="Elite Access" value={stats?.premiumUsers} icon={Crown} color="amber" />
                            <StatCard label="Neural Load" value={stats?.totalTasks} icon={Zap} color="sky" />
                            <StatCard label="Biosphere" value={stats?.totalTrees} icon={Globe} color="green" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <Card className="lg:col-span-2 p-8 border-white/5 bg-white/[0.01]">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-black flex items-center gap-3">
                                        <Activity className="text-indigo-500" size={20} /> System Vitality
                                    </h3>
                                    <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase outline-none">
                                        <option>Last 7 Cycles</option>
                                        <option>Last 30 Cycles</option>
                                    </select>
                                </div>
                                <div className="h-64 flex items-end gap-4 px-2">
                                    {[60, 40, 80, 50, 90, 70, 100].map((h, i) => (
                                        <div key={i} className="flex-1 group relative">
                                            <div className="absolute inset-0 bg-indigo-500/5 rounded-t-2xl mb-1" />
                                            <motion.div 
                                                initial={{ height: 0 }} 
                                                animate={{ height: `${h}%` }} 
                                                className="relative w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-2xl shadow-lg shadow-indigo-500/20 group-hover:brightness-125 transition-all"
                                            />
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                                                <div className="bg-white text-indigo-900 text-[10px] font-black px-2 py-1 rounded-md shadow-xl whitespace-nowrap">
                                                    +{h}% Growth
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between mt-6 px-4 text-[10px] text-pc-muted font-black uppercase tracking-[0.2em]">
                                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => <span key={d}>{d}</span>)}
                                </div>
                            </Card>

                            <div className="space-y-6">
                                <Card className="p-8 border-amber-500/20 bg-amber-500/5 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Terminal size={80} /></div>
                                    <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                                        <AlertTriangle className="text-amber-500" size={18} /> Administrative Alert
                                    </h3>
                                    <p className="text-xs text-pc-muted font-medium leading-relaxed mb-6">
                                        You are operating with **full database sovereignty**. All injections and purges are irreversible.
                                    </p>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-amber-500/70">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                            PROTOCOL 001: MONITORING ACTIVE
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-black text-amber-500/70">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                            PROTOCOL 002: BACKUP SYNCHRONIZED
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'users' && (
                    <motion.div 
                        key="users"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1 group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-pc-muted group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input 
                                    type="text" 
                                    placeholder="Search Matrix for ID, Email, or Neural Signature..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] pl-16 pr-8 py-5 text-sm focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-all placeholder:text-pc-muted/50"
                                />
                            </div>
                            <Button variant="outline" onClick={fetchData} className="px-8 flex gap-3 text-[11px] font-black tracking-widest rounded-[2rem]">
                                <RefreshCw size={16} /> RE-SYNC
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {filteredUsers.map((u, i) => (
                                <motion.div
                                    key={u._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="group relative flex flex-col md:flex-row items-center gap-6 p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/[0.02] transition-all"
                                >
                                    <div className="flex items-center gap-6 flex-1 w-full">
                                        <div className="relative">
                                            <Avatar src={u.avatar} name={u.name} size="lg" className="rounded-3xl" />
                                            {u.isAdmin && (
                                                <div className="absolute -bottom-2 -right-2 p-1.5 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/50">
                                                    <Shield size={12} className="text-white" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="text-lg font-black text-white">{u.name}</h4>
                                                {u.plan === 'premium' && <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-tighter rounded-md border border-amber-500/20">Pro</span>}
                                            </div>
                                            <p className="text-xs text-pc-muted/70 font-mono tracking-tighter">{u.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap md:flex-nowrap items-center gap-8 w-full md:w-auto">
                                        <div className="flex gap-10">
                                            <div className="text-center">
                                                <p className="text-xs font-black text-indigo-400 mb-1">{u.points}</p>
                                                <p className="text-[9px] text-pc-muted font-black uppercase tracking-widest">Neural XP</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-black text-sky-400 mb-1">{u.streak}d</p>
                                                <p className="text-[9px] text-pc-muted font-black uppercase tracking-widest">Consistency</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => setEditingUser(u)}
                                                className="p-4 rounded-2xl bg-white/5 text-pc-muted hover:text-white hover:bg-indigo-500 transition-all shadow-xl hover:shadow-indigo-500/20"
                                            >
                                                <Edit3 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(u._id)}
                                                className="p-4 rounded-2xl bg-red-500/5 text-red-500/50 hover:bg-red-500 hover:text-white transition-all shadow-xl hover:shadow-red-500/20"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'system' && (
                    <motion.div 
                        key="system"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        <Card className="p-10 space-y-10 border-indigo-500/10 bg-indigo-500/[0.02] rounded-[3rem]">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500"><Database size={28} /></div>
                                <div>
                                    <h2 className="text-2xl font-black">Core Protocols</h2>
                                    <p className="text-xs text-pc-muted">Modify global system behavior</p>
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.03] border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${settings?.maintenanceMode ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                                            {settings?.maintenanceMode ? <Lock size={20} /> : <Unlock size={20} />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black">Maintenance Mode</p>
                                            <p className="text-[10px] text-pc-muted uppercase tracking-widest">Restrict Public Access</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleToggleSetting('maintenanceMode')}
                                        className={`w-14 h-8 rounded-full relative transition-all duration-500 ${settings?.maintenanceMode ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-white/10'}`}
                                    >
                                        <motion.div 
                                            animate={{ x: settings?.maintenanceMode ? 28 : 4 }}
                                            className="absolute top-2 w-4 h-4 rounded-full bg-white shadow-xl"
                                        />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.03] border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-500/20 text-indigo-500 rounded-xl"><Star size={20} /></div>
                                        <div>
                                            <p className="text-sm font-black text-white">XP Multiplier</p>
                                            <p className="text-[10px] text-pc-muted uppercase tracking-widest">Global Reward Rate</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 font-mono font-black">
                                        <button onClick={() => toast.info('Multiplier adjustment coming soon')} className="hover:text-white transition-colors"> - </button>
                                        <span>1.0x</span>
                                        <button onClick={() => toast.info('Multiplier adjustment coming soon')} className="hover:text-white transition-colors"> + </button>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-10 space-y-10 border-amber-500/10 bg-amber-500/[0.02] rounded-[3rem]">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500"><Gift size={28} /></div>
                                <div>
                                    <h2 className="text-2xl font-black">Global Injections</h2>
                                    <p className="text-xs text-pc-muted">Transmit rewards to all souls</p>
                                </div>
                            </div>
                            
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-pc-muted px-2">
                                        <span>Point Magnitude</span>
                                        <span className="text-amber-500">{rewardAmount} PTS</span>
                                    </div>
                                    <input 
                                        type="range" min="10" max="500" step="10"
                                        value={rewardAmount}
                                        onChange={(e) => setRewardAmount(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-amber-500/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                    />
                                </div>

                                <button 
                                    onClick={handleRewardAll}
                                    className="w-full py-6 rounded-[2rem] bg-amber-500 text-indigo-950 font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    <Zap size={18} /> Global Neural Injection
                                </button>

                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-[9px] font-black text-amber-500/70 leading-relaxed uppercase tracking-widest">
                                    <AlertTriangle size={14} className="flex-shrink-0" />
                                    Injection affects all {stats?.totalUsers} active biological signatures.
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Overwrite Modal */}
            <AnimatePresence>
                {editingUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setEditingUser(null)}
                            className="absolute inset-0 bg-[#06080E]/95 backdrop-blur-[30px]"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-2xl bg-[#0F1219] border border-white/10 rounded-[3.5rem] shadow-full overflow-hidden"
                        >
                            <div className="p-12 space-y-12">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <Avatar src={editingUser.avatar} name={editingUser.name} size="xl" className="rounded-3xl" />
                                        <div>
                                            <h3 className="text-3xl font-black text-white">{editingUser.name}</h3>
                                            <p className="text-sm font-mono text-pc-muted/70 flex items-center gap-2 mt-1">
                                                <Key size={14} className="text-indigo-500" /> {editingUser._id}
                                            </p>
                                        </div>
                                    </div>
                                    <button onClick={() => setEditingUser(null)} className="p-3 rounded-full hover:bg-white/5 transition-colors"><X size={24} /></button>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-pc-muted ml-2">Digital Alias</label>
                                        <input 
                                            type="text" defaultValue={editingUser.name}
                                            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:border-indigo-500 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-pc-muted ml-2">Neural Experience</label>
                                        <input 
                                            type="number" defaultValue={editingUser.points}
                                            onChange={(e) => setEditingUser({ ...editingUser, points: parseInt(e.target.value) })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:border-indigo-500 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-pc-muted ml-2">Access Plan</label>
                                        <select 
                                            defaultValue={editingUser.plan}
                                            onChange={(e) => setEditingUser({ ...editingUser, plan: e.target.value })}
                                            className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:border-indigo-500 transition-all outline-none appearance-none"
                                        >
                                            <option value="free">FREE_ACCESS</option>
                                            <option value="premium">PRO_ACCESS</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-pc-muted ml-2">Admin Sovereignty</label>
                                        <div className="flex items-center justify-between px-6 py-4 bg-white/[0.03] border border-white/10 rounded-[1.5rem]">
                                            <span className="text-sm font-bold text-pc-muted">Authorized</span>
                                            <button 
                                                onClick={() => setEditingUser({ ...editingUser, isAdmin: !editingUser.isAdmin })}
                                                className={`w-12 h-6 rounded-full relative transition-all ${editingUser.isAdmin ? 'bg-indigo-500' : 'bg-white/10'}`}
                                            >
                                                <motion.div animate={{ x: editingUser.isAdmin ? 24 : 4 }} className="absolute top-1 w-4 h-4 rounded-full bg-white" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button onClick={() => setEditingUser(null)} variant="outline" className="flex-1 rounded-[1.5rem] py-6 text-[11px] font-black uppercase tracking-widest">Abort Process</Button>
                                    <Button onClick={() => handleUpdateUser(editingUser._id, editingUser)} disabled={isSaving} className="flex-1 rounded-[1.5rem] py-6 text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-500/40">
                                        {isSaving ? <LoadingSpinner size="sm" /> : <div className="flex items-center gap-3"><Database size={16} /> Execute Overwrite</div>}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
