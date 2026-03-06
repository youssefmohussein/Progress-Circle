import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/Modal';
import { Plus, FileText, Clock, Calendar as CalendarIcon, CheckCircle2, Circle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

export function Assignments() {
    const { assignments, courses, addAssignment, updateAssignment, deleteAssignment } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [courseId, setCourseId] = useState('');
    const [deadline, setDeadline] = useState('');
    const [estimatedTime, setEstimatedTime] = useState(1);

    const toggleStatus = async (assignment) => {
        const newStatus = assignment.status === 'Completed' ? 'Not Started' : 'Completed';
        await updateAssignment(assignment.id, { status: newStatus });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold pc-gradient-text" style={{ fontFamily: 'Manrope, sans-serif' }}>Assignments</h1>
                    <p className="text-sm text-muted mt-1">Track and manage your homework and projects.</p>
                </div>
            </div>

            {assignments.length === 0 ? (
                <div className="pc-card text-center py-12 flex flex-col items-center justify-center text-muted">
                    <FileText size={48} className="mb-4 opacity-50" />
                    <p>No assignments pending. Click the floating + button to add one!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {assignments.map(assignment => {
                            const isCompleted = assignment.status === 'Completed';
                            // assignment.course is populated by backend, so it's an object { _id, title, color }
                            const courseColor = assignment.course?.color || 'indigo';

                            // Prediction Logic
                            const daysUntilDeadline = Math.max(1, dayjs(assignment.deadline).diff(dayjs(), 'day'));
                            const assumedFreeHoursPerDay = 4; // Fixed prediction metric
                            const totalFreeHoursLeft = daysUntilDeadline * assumedFreeHoursPerDay;
                            const isAtRisk = !isCompleted && assignment.estimatedTimeHours > totalFreeHoursLeft;

                            return (
                                <motion.div
                                    key={assignment.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className={`pc-card relative overflow-hidden flex items-center gap-4 transition-opacity ${isCompleted ? 'opacity-50' : ''} ${isAtRisk ? 'ring-1 ring-rose-500/50' : ''}`}
                                >
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: `var(--color-${courseColor}-500, #6366f1)` }} />

                                    <button onClick={() => toggleStatus(assignment)} className="text-muted hover:text-indigo-400 transition-colors">
                                        {isCompleted ? <CheckCircle2 size={24} className="text-green-400" /> : <Circle size={24} />}
                                    </button>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-4">
                                            <h3 className={`font-medium text-lg ${isCompleted ? 'line-through text-muted' : ''}`}>{assignment.title}</h3>
                                            {!isCompleted && (
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${isAtRisk ? 'bg-rose-500/20 text-rose-400' : 'bg-green-500/20 text-green-400'}`}>
                                                    {isAtRisk ? 'At Risk ⚠️' : 'On Track'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-xs mt-1">
                                            {assignment.course && (
                                                <span style={{ color: `var(--color-${courseColor}-400, #818cf8)` }} className="font-medium bg-white/5 px-2 py-0.5 rounded-full">
                                                    {assignment.course.title}
                                                </span>
                                            )}
                                            <div className="flex items-center gap-1 text-muted">
                                                <CalendarIcon size={12} />
                                                <span>{dayjs(assignment.deadline).format('MMM D, YYYY')}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-muted">
                                                <Clock size={12} />
                                                <span>{assignment.estimatedTimeHours}h est.</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

        </div>
    );
}
