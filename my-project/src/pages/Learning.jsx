import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/Modal';
import { Plus, Brain, Clock, Award, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

export function Learning() {
    const { learningSessions, addLearningSession, deleteLearningSession } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [tool, setTool] = useState('');
    const [progress, setProgress] = useState('');
    const [timeSpent, setTimeSpent] = useState(15);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold pc-gradient-text" style={{ fontFamily: 'Manrope, sans-serif' }}>Learning & Skills</h1>
                    <p className="text-sm text-muted mt-1">Track extra-curricular learning like Duolingo or Coursera.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="pc-card flex flex-col items-center justify-center p-4">
                    <BookOpen className="text-purple-400 mb-2" size={24} />
                    <span className="text-2xl font-bold">{learningSessions.length}</span>
                    <span className="text-xs text-muted uppercase tracking-wider">Total Sessions</span>
                </div>
                <div className="pc-card flex flex-col items-center justify-center p-4">
                    <Clock className="text-blue-400 mb-2" size={24} />
                    <span className="text-2xl font-bold">{learningSessions.reduce((acc, s) => acc + (s.timeSpent || 0), 0)}</span>
                    <span className="text-xs text-muted uppercase tracking-wider">Minutes Learned</span>
                </div>
                <div className="pc-card flex flex-col items-center justify-center p-4 col-span-2 md:col-span-1">
                    <Award className="text-yellow-400 mb-2" size={24} />
                    <span className="text-2xl font-bold">{[...new Set(learningSessions.map(s => s.tool))].length}</span>
                    <span className="text-xs text-muted uppercase tracking-wider">Skills Explored</span>
                </div>
            </div>

            {learningSessions.length === 0 ? (
                <div className="pc-card text-center py-12 flex flex-col items-center justify-center text-muted">
                    <Brain size={48} className="mb-4 opacity-50" />
                    <p>No learning sessions logged. Hit the + button to log one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {learningSessions.map(session => (
                            <motion.div
                                key={session.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="pc-card relative overflow-hidden"
                            >
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', backgroundColor: `var(--color-purple-500, #a855f7)` }} />

                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg">{session.tool}</h3>
                                        <p className="text-xs text-muted mt-0.5">{dayjs(session.date).format('MMMM D, YYYY')}</p>
                                    </div>
                                    <button onClick={() => deleteLearningSession(session.id)} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors text-xs">
                                        Delete
                                    </button>
                                </div>

                                {session.progress && (
                                    <p className="text-sm mt-3 border-t border-white/5 pt-3">
                                        "{session.progress}"
                                    </p>
                                )}

                                <div className="mt-4 flex items-center gap-2">
                                    <span className="flex items-center gap-1 text-xs font-medium bg-purple-500/10 text-purple-400 px-2 py-1 rounded">
                                        <Clock size={12} /> {session.timeSpent} mins
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

        </div>
    );
}
