import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/Modal';
import { Plus, GraduationCap, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

export function Exams() {
    const { exams, courses, addExam, deleteExam } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [courseId, setCourseId] = useState('');
    const [examDate, setExamDate] = useState('');
    const [topicsInput, setTopicsInput] = useState('');

    const getDaysRemaining = (date) => {
        const diff = dayjs(date).diff(dayjs(), 'day');
        return diff >= 0 ? diff : diff;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold pc-gradient-text" style={{ fontFamily: 'Manrope, sans-serif' }}>Exams</h1>
                    <p className="text-sm text-muted mt-1">Track exam dates and preparation progress.</p>
                </div>
            </div>

            {exams.length === 0 ? (
                <div className="pc-card text-center py-12 flex flex-col items-center justify-center text-muted">
                    <GraduationCap size={48} className="mb-4 opacity-50" />
                    <p>No upcoming exams. Add one using the + button!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {exams.map(exam => {
                            const courseColor = exam.course?.color || 'rose';
                            const daysRemaining = getDaysRemaining(exam.examDate);
                            const isUrgent = daysRemaining >= 0 && daysRemaining <= 5;
                            const isPast = daysRemaining < 0;

                            return (
                                <motion.div
                                    key={exam.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className={`pc-card relative overflow-hidden ${isPast ? 'opacity-60' : ''}`}
                                >
                                    <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: `var(--color-${courseColor}-500, #f43f5e)` }} />

                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            {isUrgent && (
                                                <div className="flex items-center gap-1 text-xs text-rose-400 font-bold uppercase tracking-wider mb-2 bg-rose-500/10 w-fit px-2 py-0.5 rounded-full">
                                                    <AlertCircle size={12} /> {daysRemaining} days left
                                                </div>
                                            )}
                                            <h3 className="font-bold text-lg">{exam.title}</h3>
                                            {exam.course && (
                                                <span style={{ color: `var(--color-${courseColor}-400, #fb7185)` }} className="text-xs font-medium">
                                                    {exam.course.title}
                                                </span>
                                            )}
                                        </div>
                                        <button onClick={() => deleteExam(exam.id)} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors text-xs">
                                            Delete
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-muted mb-4 border-b border-white/5 pb-4">
                                        <div className="flex items-center gap-1.5">
                                            <CalendarIcon size={14} />
                                            <span>{dayjs(exam.examDate).format('MMMM D, YYYY')}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} />
                                            <span>{dayjs(exam.examDate).format('h:mm A')}</span>
                                        </div>
                                    </div>

                                    {exam.topics && exam.topics.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-xs text-muted uppercase tracking-wider font-semibold">Topics Coverage</p>
                                            <div className="flex flex-wrap gap-2">
                                                {exam.topics.map((topic, i) => (
                                                    <span key={i} className="text-xs bg-white/5 text-white/80 px-2 py-1 rounded border border-white/10">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}

        </div>
    );
}
