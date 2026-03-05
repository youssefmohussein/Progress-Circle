import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Target, Pencil, Trash2, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ProgressBar } from '../components/ProgressBar';
import { StatusBadge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'sonner';

export function Goals() {
    const { goals, addGoal, updateGoal, deleteGoal } = useData();
    const [modalOpen, setModalOpen] = useState(false);
    const [editGoal, setEditGoal] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', targetDate: '', progress: 0, status: 'active' });

    if (!goals) return <LoadingSpinner />;

    const openAdd = () => {
        setEditGoal(null);
        setForm({ title: '', description: '', targetDate: '', progress: 0, status: 'active' });
        setModalOpen(true);
    };

    const openEdit = (g) => {
        setEditGoal(g);
        setForm({ title: g.title, description: g.description || '', targetDate: g.targetDate || '', progress: g.progress, status: g.status });
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!form.title.trim()) return toast.error('Title is required');
        setSaving(true);
        try {
            if (editGoal) {
                await updateGoal(editGoal.id, form);
                toast.success('Goal updated');
            } else {
                await addGoal(form);
                toast.success('Goal created!');
            }
            setModalOpen(false);
        } catch { toast.error('Failed to save goal'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        try { await deleteGoal(id); toast.success('Goal deleted'); }
        catch { toast.error('Failed to delete goal'); }
    };

    const active = goals.filter((g) => g.status === 'active');
    const completed = goals.filter((g) => g.status === 'completed');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold pc-gradient-text" style={{ fontFamily: 'Manrope, sans-serif' }}>Goals</h1>
                    <p className="text-sm text-muted mt-1">{active.length} active · {completed.length} completed</p>
                </div>
                <Button onClick={openAdd}><Plus size={16} />New Goal</Button>
            </div>

            {goals.length === 0 ? (
                <EmptyState icon={Target} title="No goals yet" description="Set long-term goals and track your progress." action={<Button onClick={openAdd}><Plus size={14} />Add Goal</Button>} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <AnimatePresence>
                        {goals.map((goal, i) => (
                            <motion.div
                                key={goal.id}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                className="pc-card pc-card-lift group relative"
                            >
                                {goal.progress === 100 && (
                                    <div className="absolute top-3 right-3 text-lg">🏆</div>
                                )}
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <h3 className="font-bold text-base mb-1" style={{ color: 'var(--color-text)', fontFamily: 'Manrope, sans-serif' }}>
                                            {goal.title}
                                        </h3>
                                        {goal.description && <p className="text-xs text-muted truncate">{goal.description}</p>}
                                    </div>
                                    <StatusBadge status={goal.status} />
                                </div>

                                <div className="mb-3">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-xs text-muted">Progress</span>
                                        <span className="text-sm font-bold text-indigo-500">{goal.progress}%</span>
                                    </div>
                                    <ProgressBar progress={goal.progress} color={goal.progress === 100 ? 'green' : 'indigo'} />
                                </div>

                                {goal.targetDate && (
                                    <p className="text-xs text-muted flex items-center gap-1 mb-3">
                                        <Calendar size={11} /> Target: {goal.targetDate}
                                    </p>
                                )}

                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(goal)} className="pc-btn pc-btn-secondary text-xs px-3 py-1.5 flex items-center gap-1"><Pencil size={12} />Edit</button>
                                    <button onClick={() => handleDelete(goal.id)} className="pc-btn pc-btn-danger text-xs px-3 py-1.5 flex items-center gap-1"><Trash2 size={12} />Delete</button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editGoal ? 'Edit Goal' : 'New Goal'} maxWidth="max-w-lg">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-muted uppercase mb-1.5">Title</label>
                        <input className="pc-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Goal title..." />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-muted uppercase mb-1.5">Description</label>
                        <textarea className="pc-input resize-none" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What will success look like?" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase mb-1.5">Target Date</label>
                            <input className="pc-input" type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase mb-1.5">Status</label>
                            <select className="pc-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-muted uppercase mb-1.5">Progress: {form.progress}%</label>
                        <input type="range" min="0" max="100" value={form.progress} onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })} className="w-full accent-indigo-500" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button className="flex-1" loading={saving} onClick={handleSave}>{editGoal ? 'Save Changes' : 'Create Goal'}</Button>
                        <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}