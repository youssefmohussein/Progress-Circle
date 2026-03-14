import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Users, Plus, Search, Zap, CheckCircle, 
    MessageSquare, Shield, UserPlus, X, Target
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { AvatarDisplay } from '../avatar/AvatarDisplay';

export function SynergyArena() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);

    const fetchSynergyTasks = async () => {
        try {
            const res = await api.get('/tasks');
            // Filter tasks where user is a collaborator but not necessarily the owner, or synergy tasks
            const synergyTasks = res.data.data.filter(t => 
                t.isSynergyTask || 
                t.collaborators?.some(c => c._id === user._id) ||
                (t.userId._id !== user._id && t.collaborators?.some(c => c === user._id))
            );
            setTasks(synergyTasks);
        } catch (error) {
            toast.error('Failed to load synergy nodes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSynergyTasks();
    }, []);

    const handleSearch = async () => {
        if (!searchQuery) return;
        try {
            const res = await api.get(`/social/search?q=${searchQuery}`);
            setSearchResults(res.data.data);
        } catch (error) {
            toast.error('Operative search failed.');
        }
    };

    const addCollaborator = async (targetUserId) => {
        if (!selectedTask) return;
        try {
            const updatedCollaborators = [...(selectedTask.collaborators || []).map(c => c._id || c), targetUserId];
            await api.put(`/tasks/${selectedTask._id}`, { collaborators: updatedCollaborators });
            toast.success('Operative assigned to neural node.');
            setShowInviteModal(false);
            fetchSynergyTasks();
        } catch (error) {
            toast.error('Failed to assign operative.');
        }
    };

    if (loading) return <div className="p-8 text-center text-muted">Syncing with synergy nodes...</div>;

    const squad = Array.from(new Set(tasks.flatMap(t => t.collaborators || []))).filter(c => c._id !== user._id);

    return (
        <div className="space-y-6 max-w-5xl pb-20">
            {/* Header / Squad Overview */}
            <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="pc-card relative overflow-hidden bg-gradient-to-br from-indigo-500/10 to-transparent"
            >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-indigo-400 mb-1">
                            <Shield size={16} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Strategic Ops Area</span>
                        </div>
                        <h2 className="text-3xl font-black text-text">Synergy Arena</h2>
                        <p className="text-sm text-muted max-w-md mt-1">
                            Collaborative neural grid. Coordinate with your production squad to synchronize objectives and maximize output.
                        </p>
                    </div>
                    
                    <div className="flex -space-x-3 overflow-hidden p-2 bg-surface2 rounded-full border border-border/10">
                        {squad.slice(0, 5).map((member) => (
                            <div key={member._id} className="border-2 border-bg rounded-full scale-110">
                                <AvatarDisplay avatarConfig={member.avatarConfig} size="xs" />
                            </div>
                        ))}
                        {squad.length > 5 && (
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white border-2 border-bg">
                                +{squad.length - 5}
                            </div>
                        )}
                        <button 
                            onClick={() => toast.info('Synergy recruitment is active. Invite via tasks.')}
                            className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/20 transition-all border-2 border-bg"
                        >
                            <UserPlus size={14} />
                        </button>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Synergy Nodes */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                            <Zap size={18} className="text-indigo-500" /> Synergy Nodes
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                                {tasks.filter(t => t.status === 'completed').length} SECURED
                            </div>
                        </div>
                    </div>

                    {tasks.length === 0 ? (
                        <div className="pc-card py-20 text-center opacity-50 flex flex-col items-center gap-4">
                            <MessageSquare size={48} className="text-muted" />
                            <p className="text-sm max-w-xs">No collaborative neural nodes detected. Start by inviting an operative to a task.</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <motion.div 
                                key={task._id} 
                                className="pc-card group hover:border-indigo-500/30 transition-all cursor-pointer p-5"
                                whileHover={{ x: 4 }}
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${
                                                task.priority === 'high' ? 'bg-rose-500/20 text-rose-500' : 'bg-indigo-500/20 text-indigo-500'
                                            }`}>
                                                Priority {task.priority}
                                            </span>
                                            {task.status === 'completed' && (
                                                <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                                                    <CheckCircle size={10} /> SYNCED
                                                </span>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-lg leading-tight mb-1 group-hover:text-indigo-400 transition-colors">
                                            {task.title}
                                        </h4>
                                        <p className="text-xs text-muted mb-4 line-clamp-1">{task.description || 'No directive provided.'}</p>
                                        
                                        <div className="flex items-center gap-4">
                                            <div className="flex -space-x-2">
                                                <AvatarDisplay avatarConfig={task.userId.avatarConfig} size="xs" />
                                                {(task.collaborators || []).map(c => (
                                                    <AvatarDisplay key={c._id} avatarConfig={c.avatarConfig} size="xs" />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-muted font-medium">
                                                {1 + (task.collaborators?.length || 0)} Operatives assigned
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                        <button 
                                            onClick={() => { setSelectedTask(task); setShowInviteModal(true); }}
                                            className="p-2 rounded-lg bg-surface2 hover:bg-indigo-500/10 text-indigo-400 transition-all border border-border/5"
                                            title="Assign Operative"
                                        >
                                            <UserPlus size={16} />
                                        </button>
                                        <button className="p-2 rounded-lg bg-surface2 hover:bg-emerald-500/10 text-emerald-400 transition-all border border-border/5">
                                            <Target size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Sidebar - Squad Stats */}
                <div className="space-y-6">
                    <div className="pc-card p-6 bg-surface2">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-4 text-muted">Operative Stats</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted">Active Nodes</span>
                                <span className="font-bold">{tasks.filter(t => t.status !== 'completed').length}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted">Synergy Score</span>
                                <span className="font-bold text-indigo-400">842.5</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted">Network Density</span>
                                <span className="font-bold text-emerald-400">7.2</span>
                            </div>
                        </div>
                        <div className="h-2 bg-border/20 rounded-full mt-6 overflow-hidden">
                            <motion.div 
                                initial={{ width: 0 }} animate={{ width: '75%' }} 
                                className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400" 
                            />
                        </div>
                    </div>

                    <div className="pc-card p-6 border-indigo-500/10 bg-indigo-500/5">
                        <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><Zap size={16} className="text-indigo-400" /> Production Tip</h3>
                        <p className="text-[11px] text-muted leading-relaxed">
                            Adding operatives to high-priority nodes increases synergy resonance. Completed synergy tasks award 1.5x neural points.
                        </p>
                    </div>
                </div>
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {showInviteModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                            className="bg-surface pc-card p-6 w-full max-w-md border-indigo-500/20"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-black">Assign Operative</h3>
                                <button onClick={() => setShowInviteModal(false)} className="text-muted hover:text-text">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                <input 
                                    className="w-full bg-surface2 border border-border/10 p-3 pl-10 rounded-xl text-sm outline-none focus:border-indigo-500"
                                    placeholder="Search operative ID or name..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                                />
                                <button 
                                    onClick={handleSearch}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-lg"
                                >
                                    QUERY
                                </button>
                            </div>

                            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                {searchResults.map((op) => (
                                    <div key={op._id} className="flex items-center justify-between p-3 rounded-xl bg-surface2 border border-border/5 group">
                                        <div className="flex items-center gap-3">
                                            <AvatarDisplay avatarConfig={op.avatarConfig} size="xs" />
                                            <div>
                                                <p className="text-sm font-bold">{op.name}</p>
                                                <p className="text-[10px] text-muted">@{op.email.split('@')[0]}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => addCollaborator(op._id)}
                                            className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold hover:bg-indigo-500 hover:text-white transition-all"
                                        >
                                            ASSIGN
                                        </button>
                                    </div>
                                ))}
                                {searchQuery && searchResults.length === 0 && (
                                    <p className="text-center py-4 text-xs text-muted">No operatives detected in this sector.</p>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
