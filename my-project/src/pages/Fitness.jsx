import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/Modal';
import { Plus, Dumbbell, Clock, Flame, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

export function Fitness() {
    const { workouts, addWorkout, deleteWorkout } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [duration, setDuration] = useState(30);
    const [calories, setCalories] = useState(0);
    const [exercises, setExercises] = useState('');

    const currentStreak = workouts.length > 0 ? workouts[0].streak || 1 : 0; // Simplified for now

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold pc-gradient-text" style={{ fontFamily: 'Manrope, sans-serif' }}>Fitness Tracker</h1>
                    <p className="text-sm text-muted mt-1">Log gym sessions and build your streak.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="pc-card flex flex-col items-center justify-center p-4">
                    <Activity className="text-indigo-400 mb-2" size={24} />
                    <span className="text-2xl font-bold">{workouts.length}</span>
                    <span className="text-xs text-muted uppercase tracking-wider">Total Workouts</span>
                </div>
                <div className="pc-card flex flex-col items-center justify-center p-4">
                    <Flame className="text-rose-400 mb-2" size={24} />
                    <span className="text-2xl font-bold">{currentStreak}</span>
                    <span className="text-xs text-muted uppercase tracking-wider">Current Streak</span>
                </div>
                <div className="pc-card flex flex-col items-center justify-center p-4">
                    <Clock className="text-blue-400 mb-2" size={24} />
                    <span className="text-2xl font-bold">{workouts.reduce((acc, w) => acc + (w.duration || 0), 0)}</span>
                    <span className="text-xs text-muted uppercase tracking-wider">Total Minutes</span>
                </div>
                <div className="pc-card flex flex-col items-center justify-center p-4">
                    <Dumbbell className="text-emerald-400 mb-2" size={24} />
                    <span className="text-2xl font-bold">{workouts.reduce((acc, w) => acc + (w.calories || 0), 0)}</span>
                    <span className="text-xs text-muted uppercase tracking-wider">Calories Burned</span>
                </div>
            </div>

            {workouts.length === 0 ? (
                <div className="pc-card text-center py-12 flex flex-col items-center justify-center text-muted">
                    <Dumbbell size={48} className="mb-4 opacity-50" />
                    <p>No workouts logged. Use the floating + button to log one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatePresence>
                        {workouts.map(workout => (
                            <motion.div
                                key={workout.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="pc-card flex justify-between items-start"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-lg">{dayjs(workout.date).format('dddd Workout')}</h3>
                                        <span className="text-xs font-medium bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
                                            +{workout.duration} min
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted mb-3">{dayjs(workout.date).format('MMMM D, YYYY [at] h:mm A')}</p>

                                    {workout.exercises && workout.exercises.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {workout.exercises.map((ex, i) => (
                                                <span key={i} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded">
                                                    {ex}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <button onClick={() => deleteWorkout(workout.id)} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors text-xs">
                                        Delete
                                    </button>
                                    {workout.calories > 0 && (
                                        <div className="flex items-center gap-1 text-rose-400 text-sm font-medium mt-2">
                                            <Flame size={14} /> {workout.calories} kcal
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

        </div>
    );
}
