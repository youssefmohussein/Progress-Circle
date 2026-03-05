import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Flame, Trash2, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'sonner';

function getLast7Days() {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });
}

export function Habits() {
    const { habits, addHabit, toggleHabitToday, deleteHabit } = useData();
    const [modalOpen, setModalOpen] = useState(false);
    const [form, setForm] = useState({ name: '', description: '' });
    const [saving, setSaving] = useState(false);
    const days = getLast7Days();
    const today = new Date().toISOString().split('T')[0];

    if (!habits) return <LoadingSpinner />;

    const handleAdd = async () => {
        if (!form.name.trim()) return toast.error('Habit name is required');
        setSaving(true);
        try {
            await addHabit(form);
            toast.success('Habit added!');
            setForm({ name: '', description: '' });
            setModalOpen(false);
        } catch { toast.error('Failed to add habit'); }
        finally { setSaving(false); }
    };

    const handleToggle = async (id) => {
        try {
            await toggleHabitToday(id);
        } catch { toast.error('Failed to update habit'); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteHabit(id);
            toast.success('Habit deleted');
        } catch { toast.error('Failed to delete habit'); }
    };

    const completedToday = habits.filter((h) => h.completedDates?.includes(today)).length;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold pc-gradient-text" style={{ fontFamily: 'Manrope, sans-serif' }}>Habits</h1>
                    <p className="text-sm text-muted mt-1">{completedToday}/{habits.length} completed today</p>
                </div>
                <Button onClick={() => setModalOpen(true)}><Plus size={16} />New Habit</Button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Active Habits', value: habits.length, color: 'text-indigo-500' },
                    { label: 'Longest Streak', value: `${Math.max(...habits.map((h) => h.streak || 0), 0)} days`, color: 'text-orange-500' },
                    { label: 'Completed Today', value: completedToday, color: 'text-green-500' },
                ].map((s) => (
                    <div key={s.label} className="pc-card text-center py-4">
                        <p className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: 'Manrope, sans-serif' }}>{s.value}</p>
                        <p className="text-xs text-muted mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            {habits.length === 0 ? (
                <EmptyState icon={Flame} title="No habits yet" description="Build consistency by tracking daily habits." action={<Button onClick={() => setModalOpen(true)}><Plus size={14} />Add Habit</Button>} />
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {habits.map((habit, i) => {
                            const isToday = habit.completedDates?.includes(today);
                            const pct = Math.round((habit.completedDates?.length || 0) / 30 * 100);
                            return (
                                <motion.div
                                    key={habit.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="pc-card group"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Check button */}
                                        <button
                                            onClick={() => handleToggle(habit.id)}
                                            className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${isToday ? 'bg-green-500 text-white scale-105 shadow-lg shadow-green-200 dark:shadow-green-900/30' : 'hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-muted'
                                                }`}
                                            style={!isToday ? { background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' } : {}}
                                        >
                                            {isToday ? <Check size={22} /> : '○'}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{habit.name}</h3>
                                                {(habit.streak || 0) > 0 && (
                                                    <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 font-semibold">
                                                        <Flame size={11} className="animate-streak" />{habit.streak}d
                                                    </span>
                                                )}
                                            </div>
                                            {habit.description && <p className="text-xs text-muted mb-2">{habit.description}</p>}
                                            {/* 7-day grid */}
                                            <div className="flex gap-1.5">
                                                {days.map((d) => {
                                                    const done = habit.completedDates?.includes(d);
                                                    const dayLabel = new Date(d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 1);
                                                    return (
                                                        <div key={d} className="flex flex-col items-center gap-1">
                                                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-colors ${done ? 'bg-green-500 text-white' : ''}`} style={!done ? { background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' } : {}}>
                                                                {done ? '✓' : '·'}
                                                            </div>
                                                            <span className="text-xs text-muted">{dayLabel}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(habit.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Habit">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-muted uppercase mb-1.5">Habit Name</label>
                        <input className="pc-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Daily Exercise" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-muted uppercase mb-1.5">Description</label>
                        <input className="pc-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional goal..." />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button className="flex-1" loading={saving} onClick={handleAdd}>Add Habit</Button>
                        <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}