import { useState } from 'react';
import { useSEO } from '../hooks/useSEO';

import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Repeat, Trash2, CheckCircle2, Calendar, Clock, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Confetti } from '../components/Confetti';
import { toast } from 'sonner';

export function Habits() {
    const { habits, addHabit, toggleHabit, deleteHabit } = useData();
    const { user } = useAuth();
    useSEO('Habit Tracker', 'Build atomic routines and track daily habit completion with ProgressCircle.');

    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({
        name: '', description: '', frequency: 1, duration: 4 // default 4 weeks
    });
    const [saving, setSaving] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    if (!habits) return <LoadingSpinner />;

    const handleSave = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) return toast.error('Habit name is required');
        setSaving(true);
        try {
            await addHabit(form);
            toast.success('Habit deployed! 🚀');
            setModalOpen(false);
            setForm({ name: '', description: '', frequency: 1, duration: 4 });
        } catch (error) {
            toast.error('Failed to create habit');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Terminate this habit loop?')) return;
        try {
            await deleteHabit(id);
            toast.success('Habit deleted');
        } catch {
            toast.error('Failed to delete habit');
        }
    };

    const handleToggle = async (habit) => {
        const today = new Date().toISOString().split('T')[0];
        const wasDone = habit.completedDates?.includes(today);
        
        try {
            const updated = await toggleHabit(habit.id);
            if (!wasDone && updated.completedDates?.includes(today)) {
                setShowConfetti(true);
                toast.success(`NEURAL SYNC COMPLETE! ⚡`, {
                    description: `${habit.name}: Day ${updated.streak} of mastery.`,
                    duration: 4000
                });
            }
        } catch {
            toast.error('Failed to sync habit loop');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-32">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                    <h1 className="font-extrabold pc-gradient-text tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.6rem, 6vw, 2.25rem)' }}>Habit Loops</h1>
                    <p className="text-xs text-muted font-medium mt-1 uppercase tracking-[0.2em]">{habits.length} active loops</p>
                </div>
                {user?.plan === 'free' && habits.length >= 5 ? (
                    <Link to="/pricing">
                        <Button variant="premium" className="bg-gradient-to-r from-amber-500 to-orange-600 border-none">
                            ✨ Unlock Unlimited
                        </Button>
                    </Link>
                ) : (
                    <Button icon={Plus} onClick={() => setModalOpen(true)}>New Habit</Button>
                )}
            </div>


            {habits.length === 0 ? (
                <EmptyState icon={Repeat} title="No active loops" description="consistency is the key to mastery. Start a new habit today." />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {habits.map((habit, i) => (
                        <motion.div
                            key={habit.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card className="group relative overflow-hidden h-full flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500">
                                        <Repeat size={24} />
                                    </div>
                                    {/* always visible on touch (no hover on mobile) */}
                                    <button onClick={() => handleDelete(habit.id)} className="p-2 text-muted hover:text-rose-500 transition-colors touch-always-visible opacity-0 group-hover:opacity-100">
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">{habit.name}</h3>
                                    {habit.description && <p className="text-sm text-muted mb-4 line-clamp-2">{habit.description}</p>}

                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/5 rounded-xl border border-white/5">
                                            <Calendar size={14} className="text-indigo-400" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted">{habit.frequency}x / Week</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/5 rounded-xl border border-white/5">
                                            <Clock size={14} className="text-emerald-400" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-muted">{habit.duration} Weeks</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-1">
                                            {[...Array(7)].map((_, j) => {
                                                const day = new Date();
                                                day.setDate(day.getDate() - (6 - j));
                                                const dateStr = day.toISOString().split('T')[0];
                                                const isDone = habit.completedDates?.includes(dateStr);
                                                return (
                                                    <div
                                                        key={j}
                                                        className={`w-3 h-3 rounded-full border-2 border-pc-surface ${isDone ? 'bg-indigo-500 border-indigo-500' : 'bg-white/5 border-white/10'}`}
                                                        title={dateStr}
                                                    />
                                                );
                                            })}
                                        </div>
                                        <span className="text-[10px] font-black text-muted uppercase tracking-tighter">Last 7 Days</span>
                                    </div>

                                    <button
                                        onClick={() => handleToggle(habit)}
                                        className={`flex-1 sm:flex-none px-4 py-2 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${habit.completedDates?.includes(new Date().toISOString().split('T')[0]) ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'pc-btn-primary shadow-lg shadow-indigo-500/20'}`}
                                    >
                                        <CheckCircle2 size={14} />
                                        {habit.completedDates?.includes(new Date().toISOString().split('T')[0]) ? 'Finalized' : 'Log Today'}
                                    </button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Habit Loop">
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-black text-muted uppercase tracking-[0.15em] mb-2">Habit Name</label>
                            <input
                                className="pc-input text-lg font-bold"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="e.g., Morning Meditation"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-[11px] font-black text-muted uppercase tracking-[0.15em] mb-2">Description</label>
                            <textarea
                                className="pc-input text-sm min-h-[80px] py-3"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="What is the context of this habit?"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] font-black text-muted uppercase tracking-[0.15em] mb-2">Frequency</label>
                                <div className="relative">
                                    <select
                                        className="pc-input text-sm appearance-none"
                                        value={form.frequency}
                                        onChange={(e) => setForm({ ...form, frequency: parseInt(e.target.value) })}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7].map(n => <option key={n} value={n}>{n}x per week</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                                        <Sparkles size={14} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-[11px] font-black text-muted uppercase tracking-[0.15em] mb-2">Duration</label>
                                <div className="relative">
                                    <select
                                        className="pc-input text-sm appearance-none"
                                        value={form.duration}
                                        onChange={(e) => setForm({ ...form, duration: parseInt(e.target.value) })}
                                    >
                                        {[1, 2, 4, 8, 12].map(n => <option key={n} value={n}>{n} Weeks</option>)}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                                        <Clock size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="pc-btn pc-btn-primary w-full h-14 rounded-2xl text-lg font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20"
                    >
                        {saving ? 'Initializing...' : 'Deploy Habit'}
                    </button>
                </form>
            </Modal>

            <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
        </div>
    );
}
