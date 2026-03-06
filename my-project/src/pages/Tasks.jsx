import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, CheckSquare, Pencil, Trash2, Clock, Check } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { PriorityBadge, StatusBadge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'sonner';

const FILTERS = ['All', 'Pending', 'In Progress', 'Completed', 'High Priority'];

export function Tasks() {
    const { tasks, addTask, updateTask, deleteTask } = useData();
    const [filter, setFilter] = useState('All');
    const [modalOpen, setModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', priority: 'medium', deadline: '' });

    if (!tasks) return <LoadingSpinner />;

    const filtered = tasks.filter((t) => {
        if (filter === 'Pending') return t.status === 'pending';
        if (filter === 'In Progress') return t.status === 'in_progress';
        if (filter === 'Completed') return t.status === 'completed';
        if (filter === 'High Priority') return t.priority === 'high';
        return true;
    });

    const openEditModal = (task) => {
        setEditTask(task);
        if (task) {
            setForm({ title: task.title, description: task.description || '', priority: task.priority, deadline: task.deadline || '' });
            setModalOpen(true);
        }
    };

    const handleSave = async () => {
        if (!form.title.trim()) return toast.error('Title is required');
        setSaving(true);
        try {
            if (editTask) {
                await updateTask(editTask.id, form);
                toast.success('Task updated');
            }
            setModalOpen(false);
        } catch {
            toast.error('Failed to update task');
        } finally {
            setSaving(false);
        }
    };

    const handleComplete = async (task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        try {
            await updateTask(task.id, { status: newStatus });
            if (newStatus === 'completed') toast.success('Task completed! +10 pts 🎉');
        } catch { toast.error('Failed to update task'); }
    };

    const handleDelete = async (id) => {
        try {
            await deleteTask(id);
            toast.success('Task deleted');
        } catch { toast.error('Failed to delete task'); }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold pc-gradient-text" style={{ fontFamily: 'Manrope, sans-serif' }}>Tasks</h1>
                    <p className="text-sm text-muted mt-1">{tasks.length} total · {tasks.filter(t => t.status === 'completed').length} completed</p>
                </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f ? 'pc-btn-primary shadow-md' : 'pc-btn pc-btn-secondary'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Task list */}
            {filtered.length === 0 ? (
                <EmptyState icon={CheckSquare} title="No tasks found" description="Click the + button down below to add your first task." />
            ) : (
                <div className="space-y-3">
                    <AnimatePresence>
                        {filtered.map((task, i) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ delay: i * 0.03 }}
                                className={`pc-card flex items-start gap-4 group ${task.status === 'completed' ? 'opacity-60' : ''}`}
                            >
                                {/* Complete checkbox */}
                                <button
                                    onClick={() => handleComplete(task)}
                                    className={`flex-shrink-0 mt-0.5 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.status === 'completed' ? 'bg-green-500 border-green-500' : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                                        }`}
                                >
                                    {task.status === 'completed' && <Check size={14} className="text-white" />}
                                </button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className={`font-semibold text-sm ${task.status === 'completed' ? 'line-through text-muted' : ''}`} style={{ color: task.status === 'completed' ? undefined : 'var(--color-text)' }}>
                                            {task.title}
                                        </p>
                                        <PriorityBadge priority={task.priority} />
                                        <StatusBadge status={task.status} />
                                    </div>
                                    {task.description && (
                                        <p className="text-xs text-muted mt-1 truncate">{task.description}</p>
                                    )}
                                    {task.deadline && (
                                        <p className="text-xs text-muted mt-1 flex items-center gap-1"><Clock size={11} /> Due {task.deadline}</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal(task)} className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-muted hover:text-indigo-500 transition-colors">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(task.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-muted hover:text-red-500 transition-colors">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Edit Modal */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Edit Task">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-muted uppercase mb-1.5">Title</label>
                        <input className="pc-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Task title..." />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-muted uppercase mb-1.5">Description</label>
                        <textarea className="pc-input resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description..." />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase mb-1.5">Priority</label>
                            <select className="pc-input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-muted uppercase mb-1.5">Deadline</label>
                            <input className="pc-input" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button className="flex-1" loading={saving} onClick={handleSave}>Save Changes</Button>
                        <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
