import { useState } from 'react';
import { useData } from '../context/DataContext';
import { Modal } from './Modal';
import { Plus, CheckSquare, Calendar, Target, FileText, BookOpen, GraduationCap, Dumbbell, Brain, CalendarDays } from 'lucide-react';

const CATEGORIES = [
    { id: 'task', label: 'Task', icon: CheckSquare },
    { id: 'habit', label: 'Habit', icon: Calendar },
    { id: 'assignment', label: 'Assignment', icon: FileText },
    { id: 'course', label: 'Course', icon: BookOpen },
    { id: 'exam', label: 'Exam', icon: GraduationCap },
    { id: 'workout', label: 'Workout Log', icon: Dumbbell },
    { id: 'learning', label: 'Learning Session', icon: Brain },
    { id: 'schedule', label: 'Schedule Block', icon: CalendarDays },
    { id: 'goal', label: 'Goal', icon: Target },
];

export function QuickAddModal({ open, onClose }) {
    const {
        addTask, addHabit, addGoal, addCourse,
        addAssignment, addExam, addWorkout,
        addLearningSession, addScheduleBlock, courses
    } = useData();

    const [category, setCategory] = useState('task');
    const [title, setTitle] = useState('');
    const [courseId, setCourseId] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [numberInput, setNumberInput] = useState(); // Reusable for calories, duration, credits
    const [optionInput, setOptionInput] = useState('medium'); // Reusable for priority, status

    const handleSubmit = async (e) => {
        e.preventDefault();

        switch (category) {
            case 'task':
                await addTask({ title, priority: optionInput, deadline: date || null });
                break;
            case 'habit':
                await addHabit({ name: title });
                break;
            case 'goal':
                await addGoal({ title, targetDate: date || null });
                break;
            case 'course':
                await addCourse({ title, credits: numberInput || 3 });
                break;
            case 'assignment':
                await addAssignment({ title, course: courseId, deadline: date, estimatedTimeHours: numberInput || 1 });
                break;
            case 'exam':
                await addExam({ title, course: courseId, examDate: date ? `${date}T${time || '00:00'}` : new Date().toISOString() });
                break;
            case 'workout':
                await addWorkout({ duration: numberInput || 30, date: date || new Date().toISOString() });
                break;
            case 'learning':
                await addLearningSession({ tool: title, timeSpent: numberInput || 15 });
                break;
            case 'schedule':
                await addScheduleBlock({ title, type: 'Class', startTime: time || '09:00', endTime: '10:00', daysOfWeek: [new Date().getDay()] });
                break;
        }

        // Reset
        setTitle('');
        setCourseId('');
        setDate('');
        setTime('');
        setNumberInput('');
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} title="Quick Add">
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Category Selector */}
                <div>
                    <label className="block text-sm font-medium text-muted mb-2">I want to add a...</label>
                    <div className="grid grid-cols-3 gap-2">
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const isSelected = category === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${isSelected
                                            ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400'
                                            : 'bg-white/5 border-white/10 text-muted hover:bg-white/10'
                                        }`}
                                >
                                    <Icon size={18} className="mb-1" />
                                    <span style={{ fontSize: '10px', fontWeight: 600 }}>{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="h-px w-full bg-white/10 my-4" />

                {/* Dynamic Fields based on Category */}
                {(category !== 'workout' && category !== 'learning') && (
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Title / Name</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="pc-input w-full"
                            placeholder="What do you want to add?"
                            required
                        />
                    </div>
                )}

                {category === 'learning' && (
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Skill or Tool</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="pc-input w-full"
                            placeholder="e.g. Duolingo"
                            required
                        />
                    </div>
                )}

                {(category === 'assignment' || category === 'exam') && (
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Course</label>
                        <select
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            className="pc-input w-full"
                            required
                        >
                            <option value="">Select a Course</option>
                            {courses?.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                        </select>
                    </div>
                )}

                {(category === 'task' || category === 'assignment' || category === 'exam' || category === 'goal') && (
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">
                            {category === 'exam' ? 'Exam Date' : 'Deadline / Target Date'}
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="pc-input w-full"
                        />
                    </div>
                )}

                {(category === 'exam' || category === 'schedule') && (
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="pc-input w-full"
                        />
                    </div>
                )}

                {(category === 'course' || category === 'assignment' || category === 'workout' || category === 'learning') && (
                    <div>
                        <label className="block text-sm font-medium text-muted mb-1">
                            {category === 'course' ? 'Credits' : category === 'assignment' ? 'Est. Hours' : 'Duration (mins)'}
                        </label>
                        <input
                            type="number"
                            value={numberInput || ''}
                            onChange={(e) => setNumberInput(Number(e.target.value))}
                            className="pc-input w-full"
                            required
                            min="1"
                        />
                    </div>
                )}

                <button type="submit" className="pc-btn pc-btn-primary w-full mt-6 flex items-center justify-center gap-2">
                    <Plus size={18} /> Add {CATEGORIES.find(c => c.id === category)?.label}
                </button>
            </form>
        </Modal>
    );
}
