import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/Modal';
import { Plus, BookOpen, User, Star, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Courses() {
    const { courses, addCourse, deleteCourse } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [instructor, setInstructor] = useState('');
    const [credits, setCredits] = useState(3);
    const [color, setColor] = useState('indigo');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold pc-gradient-text" style={{ fontFamily: 'Manrope, sans-serif' }}>Courses</h1>
                    <p className="text-sm text-muted mt-1">Manage your university and online courses.</p>
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="pc-card text-center py-12 flex flex-col items-center justify-center text-muted">
                    <BookOpen size={48} className="mb-4 opacity-50" />
                    <p>No courses yet. Use the floating + button to add one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {courses.map(course => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="pc-card relative overflow-hidden"
                            >
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: `var(--color-${course.color}-500, #6366f1)` }} />

                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-lg">{course.title}</h3>
                                    <button onClick={() => deleteCourse(course.id)} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="space-y-2 text-sm text-muted">
                                    {course.instructor && (
                                        <div className="flex items-center gap-2">
                                            <User size={14} /> {course.instructor}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Star size={14} /> {course.credits} Credits
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-xs font-medium">
                                        <span style={{ color: `var(--color-${course.color}-400, #818cf8)` }} className="uppercase tracking-wider">{course.status}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

        </div>
    );
}
