import { useState, useRef, useCallback } from 'react';
import { useSEO } from '../hooks/useSEO';

import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { Confetti } from '../components/Confetti';
import { Plus, CheckSquare, Pencil, Trash2, Clock, Check, Bell, Tag, Settings, Timer, ChevronDown, ChevronRight, FileText, Layout, Crown, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { CategoryManager } from '../components/CategoryManager';
import { PriorityBadge, StatusBadge } from '../components/Badge';
import { EmptyState } from '../components/EmptyState';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'sonner';
import { PageInsight } from '../components/PageInsight';

import { useAuth } from '../context/AuthContext';



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
    const { user } = useAuth();
    useSEO('Task Engine', 'Manage tasks, set priorities, track deadlines, and break down goals with the ProgressCircle task engine.');
    const { tasks, categories, addTask, updateTask, deleteTask } = useData();
    const [filter, setFilter] = useState('All');
    const [modalOpen, setModalOpen] = useState(false);
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [expandedTasks, setExpandedTasks] = useState(new Set());
    const [saving, setSaving] = useState(false);
    const [showConfetti, setShowConfetti] = useState(null); // null | 'regular' | 'big'
    const filterBarRef = useRef(null);
    const trackRef = useRef(null);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const dragStartScroll = useRef(0);
    const [filterScrollThumb, setFilterScrollThumb] = useState(100);
    const [filterScrollOffset, setFilterScrollOffset] = useState(0);
    const handleFilterScroll = useCallback(() => {
        const el = filterBarRef.current;
        if (!el) return;
        const { scrollLeft, scrollWidth, clientWidth } = el;
        const scrollable = scrollWidth - clientWidth;
        const thumbPct = (clientWidth / scrollWidth) * 100;
        const offsetPct = scrollable > 0 ? (scrollLeft / scrollable) * (100 - thumbPct) : 0;
        setFilterScrollThumb(thumbPct);
        setFilterScrollOffset(offsetPct);
    }, []);
    const handleTrackClick = useCallback((e) => {
        const el = filterBarRef.current;
        const track = trackRef.current;
        if (!el || !track) return;
        const rect = track.getBoundingClientRect();
        const clickPct = (e.clientX - rect.left) / rect.width;
        const { scrollWidth, clientWidth } = el;
        el.scrollLeft = clickPct * (scrollWidth - clientWidth);
    }, []);
    const handleThumbMouseDown = useCallback((e) => {
        e.stopPropagation();
        const el = filterBarRef.current;
        const track = trackRef.current;
        if (!el || !track) return;
        isDragging.current = true;
        dragStartX.current = e.clientX;
        dragStartScroll.current = el.scrollLeft;
        const onMove = (me) => {
            if (!isDragging.current) return;
            const dx = me.clientX - dragStartX.current;
            const { scrollWidth, clientWidth } = el;
            const trackWidth = track.getBoundingClientRect().width;
            const scrollRatio = (scrollWidth - clientWidth) / (trackWidth * (clientWidth / scrollWidth));
            el.scrollLeft = dragStartScroll.current + dx * scrollRatio;
        };
        const onUp = () => {
            isDragging.current = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    }, []);
    const [form, setForm] = useState({
        title: '', description: '', priority: 'medium', deadline: '',
        categoryId: '', estimatedTime: 0, alertsEnabled: false, timeEnabled: false,
        isBigTask: false, parentId: null, notes: '', totalWork: 0, completedWork: 0,
        collaborators: [], isSynergyTask: false
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
                setShowConfetti(task.isBigTask ? 'big' : 'regular');
                toast.success(task.isBigTask ? 'LEGENDARY ACHIEVEMENT! 🏆' : 'Task completed! 🎉');
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
            isBigTask: isBig, parentId: parentId, notes: '', totalWork: 0, completedWork: 0,
            collaborators: [], isSynergyTask: false
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
                completedWork: task.completedWork || 0,
                collaborators: task.collaborators?.map(c => c._id || c) || [],
                isSynergyTask: task.isSynergyTask || false
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
            if (payload.categoryId === '') payload.categoryId = null;
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
                    <div className="flex items-center gap-3">
                        <h1 className="font-extrabold pc-gradient-text tracking-tight" style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.6rem, 6vw, 2.25rem)' }}>Master Plan</h1>
                        <PageInsight 
                            title="Central Intelligence Task Engine"
                            intro="The core operational layer for objective decomposition. Architect complex missions into manageable micro-targets and monitor execution velocity."
                            operations={[
                                { title: 'Objective Decomposition', content: 'Fragment large-scale goals into atomic tasks with assigned priorities and urgency.' },
                                { title: 'Strategic Categorization', content: 'Organize operations into functional sectors like Work, Personal, and Strategy.' },
                                { title: 'Status Synchronization', content: 'Real-time monitoring of task completion states from Initial to Complete.' }
                            ]}
                            neuralTip="Defining a 'Target Outcome' for each task before execution increases focus density by up to 40%."
                        />
                    </div>
                    <p className="text-xs text-muted font-medium mt-1 uppercase tracking-[0.2em]">{tasks.length} total · {tasks.filter(t => t.status === 'completed').length} done</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon={Settings} onClick={() => setCategoryModalOpen(true)}>Categories</Button>
                    <Button icon={Plus} onClick={() => openCreateModal(false)}>New Task</Button>
                </div>
            </div>

            {/* Filter bar: horizontal scroll with custom scrollbar indicator */}
            <div className="flex items-center rounded-2xl shadow-xl relative max-w-full overflow-hidden" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', paddingBottom: '6px' }}>
                {/* Scrollable Categories Section — native scrollbar hidden via CSS */}
                <div
                    ref={filterBarRef}
                    onScroll={handleFilterScroll}
                    className="mobile-scroll-x flex-1 min-w-0 pr-2 pt-1 px-2"
                >
                    {FILTERS.map((f) => {
                        const isCat = categories.find(c => c.name === f);
                        const isActive = filter === f;
                        return (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className="px-6 py-2 rounded-2xl text-[12px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 flex-shrink-0 whitespace-nowrap"
                                style={isActive ? {
                                    background: 'rgba(var(--primary-rgb), 0.1)',
                                    color: 'var(--primary)',
                                    border: '1px solid rgba(var(--primary-rgb), 0.2)',
                                    boxShadow: '0 0 15px -5px rgba(var(--primary-rgb), 0.4)'
                                } : {
                                    color: 'var(--muted)',
                                    border: '1px solid transparent'
                                }}
                            >
                                {isCat && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: isCat.color }} />}
                                {f}
                            </button>
                        );
                    })}
                </div>

                {/* Sticky Action Section (Always on Right) */}
                <div className="sticky right-0 flex items-center pl-6 z-10" style={{ background: 'var(--surface2)', boxShadow: '-20px 0 20px -10px var(--surface2)' }}>
                    <div className="h-6 w-px bg-white/5 mx-2 flex-shrink-0" />
                    <button
                        onClick={() => user?.plan === 'premium' ? openCreateModal(true) : toast.error('Big Tasks are a Premium feature! ✨')}
                        className="flex items-center gap-2 px-5 py-2 rounded-2xl text-[12px] font-bold uppercase tracking-[0.15em] transition-all flex-shrink-0 whitespace-nowrap"
                        style={{ color: user?.plan === 'premium' ? 'var(--primary)' : undefined }}
                    >
                        {user?.plan !== 'premium' ? <Crown size={14} /> : <Plus size={16} />} Big Task
                    </button>
                </div>

                {/* Custom draggable scrollbar */}
                <div
                    ref={trackRef}
                    onClick={handleTrackClick}
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/[0.06] rounded-full mx-2"
                    style={{ cursor: 'pointer' }}
                >
                    <div
                        onMouseDown={handleThumbMouseDown}
                        className="h-full rounded-full hover:opacity-80 transition-opacity"
                        style={{ background: 'var(--primary)', width: `${filterScrollThumb}%`, marginLeft: `${filterScrollOffset}%`, cursor: 'grab', userSelect: 'none' }}
                    />
                </div>
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

                    <div className={`pc-card p-4 border transition-all ${user?.plan === 'premium' ? 'bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-100/50 dark:border-indigo-900/30' : 'bg-muted/5 border-white/5 opacity-80'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${user?.plan === 'premium' ? 'text-indigo-500' : 'text-muted'}`}>Work Counter</span>
                                {user?.plan !== 'premium' && <Crown size={12} className="text-amber-500" />}
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-muted">ENABLE</span>
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 cursor-pointer" 
                                    checked={form.totalWork > 0} 
                                    onChange={(e) => {
                                        if (user?.plan !== 'premium') return toast.error('Work Counters are Premium! ✨');
                                        setForm({ ...form, totalWork: e.target.checked ? 10 : 0 });
                                    }} 
                                />
                            </div>
                        </div>
                        {form.totalWork > 0 && user?.plan === 'premium' && (
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
                        {user?.plan !== 'premium' && (
                            <p className="text-[10px] text-muted italic">Break tasks into measurable steps with counters.</p>
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
                        <div className="flex items-center gap-2 mb-2">
                            <label className="block text-[11px] font-black text-muted uppercase tracking-[0.15em]">Collaborators</label>
                            {user?.plan !== 'premium' && <Crown size={12} className="text-amber-500" />}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                             {form.collaborators.map(cId => (
                                 <div key={cId} className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase flex items-center gap-2">
                                     {cId.substring(0, 8)}...
                                     <button onClick={() => setForm({...form, collaborators: form.collaborators.filter(id => id !== cId)})} className="hover:text-rose-500">×</button>
                                 </div>
                             ))}
                        </div>
                        <input 
                            className={`pc-input text-sm ${user?.plan !== 'premium' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            placeholder="User ID (Collaborator feature in progress...)"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.target.value) {
                                    setForm({...form, collaborators: [...form.collaborators, e.target.value]});
                                    e.target.value = '';
                                }
                            }}
                            readOnly={user?.plan !== 'premium'}
                        />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10 hover:border-indigo-500/30 transition-all">
                        <div className={`w-12 h-6 rounded-full transition-all relative ${form.isSynergyTask ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : 'bg-gray-700'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${form.isSynergyTask ? 'left-7' : 'left-1'}`} />
                        </div>
                        <input type="checkbox" className="hidden" checked={form.isSynergyTask} onChange={(e) => setForm({ ...form, isSynergyTask: e.target.checked })} />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-black text-white uppercase tracking-widest">Synergy Protocol</p>
                                <Zap size={12} className="text-indigo-400" />
                            </div>
                            <p className="text-[10px] text-muted">1.5x Multiplier / Shared Progress</p>
                        </div>
                    </label>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <label className="block text-[11px] font-black text-muted uppercase tracking-[0.15em]">Project Notes</label>
                            {user?.plan !== 'premium' && <Crown size={12} className="text-amber-500" />}
                        </div>
                        <textarea 
                            className={`pc-input resize-none text-sm min-h-[80px] ${user?.plan !== 'premium' ? 'opacity-50 grayscale cursor-not-allowed' : ''}`} 
                            value={form.notes} 
                            onChange={(e) => {
                                if (user?.plan !== 'premium') return toast.error('Notes are a Premium feature! ✨');
                                setForm({ ...form, notes: e.target.value });
                            }} 
                            placeholder={user?.plan === 'premium' ? "Add specifics, progress notes, or lesson names..." : "Upgrade to unlock project notes"}
                            readOnly={user?.plan !== 'premium'}
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button className="flex-1 h-12 text-lg" loading={saving} onClick={handleSave}>{editTask ? 'Update Plan' : 'Commit to Life'}</Button>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>Back</Button>
                    </div>
                </div>
            </Modal>

            <Confetti 
                active={!!showConfetti} 
                isBigTask={showConfetti === 'big'} 
                onComplete={() => setShowConfetti(null)} 
            />
            <CategoryManager open={categoryModalOpen} onClose={() => setCategoryModalOpen(false)} />
        </div>
    );
}

