import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { Confetti } from '../components/Confetti';
import { Plus, CheckSquare, Pencil, Trash2, Clock, Check, Bell, Tag, Settings, Timer, ChevronDown, ChevronRight, FileText, Layout } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { CategoryManager } from '../components/CategoryManager';
import { PriorityBadge, StatusBadge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'sonner';

const FILTERS = ['All'];

const TaskItem = ({ task, tasks, categories, expandedTasks, toggleExpand, handleComplete, updateTask, openCreateModal, openEditModal, handleDelete, filter, isSub = false }) => {
    const category = categories?.find(c => c.id === (task.categoryId?._id || task.categoryId));
    let subTasks = tasks.filter(t => (t.parentId?._id || t.parentId) === task.id);

    // Apply category filter to sub-tasks as well if a specific category is selected
    if (filter !== 'All') {
        const activeCat = categories.find(c => c.name === filter);
        if (activeCat) {
            subTasks = subTasks.filter(st => (st.categoryId?._id || st.categoryId) === activeCat.id);
        }
    }
    const isExpanded = expandedTasks.has(task.id);
    const progress = task.totalWork > 0 ? (task.completedWork / task.totalWork) * 100 : 0;

    return (
        <motion.div
            layout
            className={`pc-card group border-l-4 ${isSub ? 'sm:ml-8 ml-3 bg-muted/5' : ''} ${task.status === 'completed' ? 'opacity-60' : ''}`}
            style={{ borderLeftColor: task.isBigTask ? '#6366f1' : 'transparent' }}
        >
            <div className="flex items-start gap-4 p-4">
                {task.isBigTask && !isSub ? (
                    <button onClick={() => toggleExpand(task.id)} className="mt-1 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                ) : (
                    <button
                        onClick={() => handleComplete(task)}
                        className={`flex-shrink-0 mt-1 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.status === 'completed'
                                ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/20'
                                : dayjs(task.deadline).diff(dayjs(), 'hour') < 12
                                    ? 'border-rose-500 hover:bg-rose-500/10'
                                    : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400'
                            }`}
                    >
                        {task.status === 'completed' && <Check size={14} className="text-white" />}
                    </button>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className={`font-bold text-[16px] truncate ${task.status === 'completed' ? 'line-through text-muted' : ''}`}>
                            {task.title}
                        </h3>
                        {task.isBigTask && <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 text-[10px] font-black uppercase rounded-md flex items-center gap-1"><Layout size={10} /> Container</span>}
                        <PriorityBadge priority={task.priority} />
                        {category && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ backgroundColor: `${category.color}20`, color: category.color }}>
                                <Tag size={10} /> {category.name}
                            </span>
                        )}
                    </div>

                    {task.description && <p className="text-sm text-muted mb-2 line-clamp-1">{task.description}</p>}

                    {task.totalWork > 0 && (
                        <div className="mb-3">
                            <div className="flex justify-between items-center text-[10px] font-black text-muted uppercase tracking-widest mb-1.5">
                                <span>Progress: {task.completedWork} / {task.totalWork}</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    className="h-full bg-indigo-500"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 text-[11px] text-muted font-bold uppercase tracking-widest">
                        {task.deadline && (
                            <span className="flex items-center gap-1"><Clock size={12} /> {new Date(task.deadline).toLocaleDateString()}</span>
                        )}
                        {task.estimatedTime > 0 && (
                            <span className="flex items-center gap-1"><Timer size={12} /> {task.actualTimeSpent || 0} / {task.estimatedTime}m</span>
                        )}
                        {task.notes && (
                            <span className="flex items-center gap-1 text-indigo-400"><FileText size={12} /> Notes available</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {!task.isBigTask && task.status !== 'completed' && task.estimatedTime > 0 && (
                        <button onClick={() => updateTask(task.id, { actualTimeSpent: (task.actualTimeSpent || 0) + 15 })} className="p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-500 transition-colors" title="Log 15m">
                            <Plus size={16} />
                        </button>
                    )}
                    {/* touch-always-visible makes these always visible on mobile touch devices */}
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity touch-always-visible">
                        {task.isBigTask && (
                            <button onClick={() => openCreateModal(false, task.id)} className="p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600" title="Add Sub-task">
                                <Plus size={16} />
                            </button>
                        )}
                        <button onClick={() => openEditModal(task)} className="p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-muted">
                            <Pencil size={18} />
                        </button>
                        <button onClick={() => handleDelete(task.id)} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 text-muted hover:text-red-500">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && subTasks.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-100 dark:border-gray-800 pb-4 pr-4"
                    >
                        {subTasks.map(st => (
                            <TaskItem
                                key={st.id}
                                task={st}
                                tasks={tasks}
                                categories={categories}
                                expandedTasks={expandedTasks}
                                toggleExpand={toggleExpand}
                                handleComplete={handleComplete}
                                updateTask={updateTask}
                                openCreateModal={openCreateModal}
                                openEditModal={openEditModal}
                                handleDelete={handleDelete}
                                filter={filter}
                                isSub={true}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export function Tasks() {
    const { tasks, categories, addTask, updateTask, deleteTask } = useData();
    const [filter, setFilter] = useState('All');
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [expandedTasks, setExpandedTasks] = useState(new Set());
    const [saving, setSaving] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [form, setForm] = useState({
        title: '', description: '', priority: 'medium', deadline: '',
        categoryId: '', estimatedTime: 0, alertsEnabled: false, timeEnabled: false,
        isBigTask: false, parentId: null, notes: '', totalWork: 0, completedWork: 0
    });

    if (!tasks || !categories) return <LoadingSpinner />;

    const toggleExpand = (id) => {
        const next = new Set(expandedTasks);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedTasks(next);
    };

    const handleComplete = async (task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        try {
            await updateTask(task.id, { status: newStatus });
            if (newStatus === 'completed') {
                setShowConfetti(true);
                toast.success('Task completed! 🎉');
            }
        } catch { toast.error('Failed to update task'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this task?')) return;
        try {
            await deleteTask(id);
            toast.success('Task deleted');
        } catch { toast.error('Failed to delete task'); }
    };

    const openCreateModal = (isBig = false, parentId = null) => {
        setEditTask(null);
        setForm({
            title: '', description: '', priority: 'medium', deadline: '',
            categoryId: '', estimatedTime: 0, alertsEnabled: false, timeEnabled: false,
            isBigTask: isBig, parentId: parentId, notes: '', totalWork: 0, completedWork: 0
        });
        setModalOpen(true);
    };

    const openEditModal = (task) => {
        setEditTask(task);
        if (task) {
            setForm({
                title: task.title, description: task.description || '', priority: task.priority,
                deadline: task.deadline ? dayjs(task.deadline).format('YYYY-MM-DDTHH:mm') : '',
                categoryId: task.categoryId?._id || task.categoryId || '',
                estimatedTime: task.estimatedTime || 0,
                timeEnabled: (task.estimatedTime > 0),
                isBigTask: task.isBigTask || false,
                parentId: task.parentId?._id || task.parentId || null,
                notes: task.notes || '',
                totalWork: task.totalWork || 0,
                completedWork: task.completedWork || 0
            });
            setModalOpen(true);
        }
    };

    const handleSave = async () => {
        if (!form.title.trim()) return toast.error('Title is required');
        setSaving(true);
        try {
            const payload = { ...form };
            if (!payload.timeEnabled) payload.estimatedTime = 0;
            delete payload.timeEnabled;
            delete payload.alertsEnabled;

            if (editTask) {
                await updateTask(editTask.id, payload);
                toast.success('Task updated');
            } else {
                await addTask(payload);
                toast.success('Task created');
            }
            setModalOpen(false);
        } catch (error) {
            toast.error('Failed to save task');
        } finally {
            setSaving(false);
        }
    };

    const FILTERS = ['All', ...categories.map(c => c.name)];

    const filtered = tasks.filter((t) => {
        if (filter === 'All') return !t.parentId;

        // Find if filter matches a category name
        const cat = categories.find(c => c.name === filter);
        if (cat) return (t.categoryId?._id || t.categoryId) === cat.id && !t.parentId;

        return !t.parentId;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-32">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                    <h1 className="font-extrabold pc-gradient-text tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.6rem, 6vw, 2.25rem)' }}>Master Plan</h1>
                    <p className="text-xs text-muted font-medium mt-1 uppercase tracking-[0.2em]">{tasks.length} total · {tasks.filter(t => t.status === 'completed').length} done</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon={Settings} onClick={() => setCategoryModalOpen(true)}>Categories</Button>
                </div>
            </div>

            {/* Filter bar: horizontal scroll on mobile */}
            <div className="mobile-scroll-x p-1 bg-[#858b99] dark:bg-slate-800/80 rounded-full px-2">
                {FILTERS.map((f) => {
                    const isCat = categories.find(c => c.name === f);
                    const isActive = filter === f;
                    return (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isActive ? 'bg-[#374151] text-indigo-400 shadow-lg' : 'text-[#1e1e2e]/70 dark:text-white/60 hover:text-[#1e1e2e]'}`}
                        >
                            {isCat && <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isCat.color }} />}
                            {f}
                        </button>
                    );
                })}
                <div className="h-6 w-px bg-slate-500/30 mx-2" />
                <button
                    onClick={() => openCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.15em] text-indigo-500 hover:text-indigo-400 transition-all"
                >
                    <Plus size={16} /> Big Task
                </button>
            </div>

            {filtered.length === 0 ? (
                <EmptyState icon={CheckSquare} title="The horizon is clear" description="Start mapping out your next big move." />
            ) : (
                <div className="space-y-4">
                    {filtered.map((task) => (
                        <TaskItem
                            key={task.id} task={task} tasks={tasks} categories={categories}
                            expandedTasks={expandedTasks} toggleExpand={toggleExpand}
                            handleComplete={handleComplete} updateTask={updateTask}
                            openCreateModal={openCreateModal} openEditModal={openEditModal}
                            handleDelete={handleDelete} filter={filter}
                        />
                    ))}
                </div>
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTask ? "Review Node" : (form.isBigTask ? "New Big Task" : "New Task")}>
                <div className="space-y-5">
                    <div>
                        <label className="block text-[11px] font-black text-muted uppercase tracking-[0.15em] mb-2">Title</label>
                        <input className="pc-input text-lg font-bold" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Computer Science 101" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-black text-muted uppercase tracking-[0.15em] mb-2">Category</label>
                            <select className="pc-input text-sm" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                                <option value="">Global</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[11px] font-black text-muted uppercase tracking-[0.15em] mb-2">Priority</label>
                            <select className="pc-input text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                                <option value="low">Low</option>
                                <option value="medium">Standard</option>
                                <option value="high">Critical</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[11px] font-black text-muted uppercase tracking-[0.15em] mb-2">Projected Deadline</label>
                            <input className="pc-input text-sm" type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                        </div>
                        {!form.isBigTask && (
                            <div className="flex flex-col justify-end">
                                <label className="flex items-center gap-3 cursor-pointer group bg-muted/5 p-2 rounded-xl hover:bg-muted/10 transition-colors">
                                    <div className={`w-10 h-5 rounded-full transition-all relative ${form.alertsEnabled ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${form.alertsEnabled ? 'left-6' : 'left-1'}`} />
                                    </div>
                                    <input type="checkbox" className="hidden" checked={form.alertsEnabled} onChange={(e) => setForm({ ...form, alertsEnabled: e.target.checked })} />
                                    <span className="text-[11px] font-black text-muted group-hover:text-indigo-500 uppercase tracking-widest">Alerts</span>
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="pc-card bg-indigo-50/30 dark:bg-indigo-900/10 p-4 border border-indigo-100/50 dark:border-indigo-900/30">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em]">Work Counter</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-muted">ENABLE</span>
                                <input type="checkbox" className="w-4 h-4" checked={form.totalWork > 0} onChange={(e) => setForm({ ...form, totalWork: e.target.checked ? 10 : 0 })} />
                            </div>
                        </div>
                        {form.totalWork > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-muted uppercase mb-1">Total (e.g., Lessons)</label>
                                    <input type="number" className="pc-input text-sm" value={form.totalWork} onChange={(e) => setForm({ ...form, totalWork: parseInt(e.target.value) || 0 })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-muted uppercase mb-1">Finished</label>
                                    <input type="number" className="pc-input text-sm" value={form.completedWork} onChange={(e) => setForm({ ...form, completedWork: parseInt(e.target.value) || 0 })} />
                                </div>
                            </div>
                        )}
                    </div>

                    {!form.isBigTask && form.parentId && (
                        <div className="space-y-4">
                            {!form.timeEnabled ? (
                                <button
                                    onClick={() => setForm({ ...form, timeEnabled: true })}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/5 border border-indigo-500/10 hover:bg-indigo-500/10 transition-all"
                                >
                                    <Timer size={14} /> Add Time Tracking
                                </button>
                            ) : (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-black text-muted uppercase tracking-widest">Time Estimation</span>
                                        <button onClick={() => setForm({ ...form, timeEnabled: false, estimatedTime: 0 })} className="text-[10px] text-rose-500 font-bold hover:underline">Remove</button>
                                    </div>
                                    <div className="flex gap-2">
                                        {[15, 30, 45, 60, 90, 120].map(mins => (
                                            <button
                                                key={mins}
                                                onClick={() => setForm({ ...form, estimatedTime: mins })}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${form.estimatedTime === mins ? 'bg-indigo-500 text-white' : 'bg-muted/5 text-muted hover:bg-muted/10'}`}
                                            >
                                                {mins}m
                                            </button>
                                        ))}
                                        <input
                                            type="number"
                                            className="pc-input text-sm w-20 h-8"
                                            value={form.estimatedTime}
                                            onChange={(e) => setForm({ ...form, estimatedTime: parseInt(e.target.value) || 0 })}
                                            placeholder="Min"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="block text-[11px] font-black text-muted uppercase tracking-[0.15em] mb-2">Project Notes</label>
                        <textarea className="pc-input resize-none text-sm min-h-[80px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add specifics, progress notes, or lesson names..." />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button className="flex-1 h-12 text-lg" loading={saving} onClick={handleSave}>{editTask ? 'Update Plan' : 'Commit to Life'}</Button>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>Back</Button>
                    </div>
                </div>
            </Modal>

            <Confetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
            <CategoryManager open={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} />
        </div>
    );
}

