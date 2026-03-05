import { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useData } from '../context/DataContext';
import { Plus, Flame } from 'lucide-react';

export function Habits() {
    const { habits, addHabit, toggleHabitToday } = useData();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newHabit, setNewHabit] = useState({
        name: '',
        description: '',
    });

    const handleAddHabit = () => {
        if (newHabit.name.trim()) {
            addHabit({
                userId: '1',
                name: newHabit.name,
                description: newHabit.description,
            });
            setNewHabit({ name: '', description: '' });
            setShowAddModal(false);
        }
    };

    const today = new Date().toISOString().split('T')[0];

    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date.toISOString().split('T')[0]);
        }
        return days;
    };

    const last7Days = getLast7Days();

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Habits</h1>
                    <p className="text-gray-600">Build consistency and track your daily routines</p>
                </div>
                <Button onClick={() => setShowAddModal(true)}>
                    <Plus size={20} className="mr-2" />
                    Add Habit
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-l-4 border-orange-500">
                    <p className="text-sm text-gray-600 mb-1">Active Habits</p>
                    <p className="text-3xl font-bold text-gray-900">{habits.length}</p>
                </Card>
                <Card className="border-l-4 border-blue-500">
                    <p className="text-sm text-gray-600 mb-1">Longest Streak</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {Math.max(...habits.map(h => h.streak), 0)} days
                    </p>
                </Card>
                <Card className="border-l-4 border-green-500">
                    <p className="text-sm text-gray-600 mb-1">Completed Today</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {habits.filter(h => h.completedDates.includes(today)).length}
                    </p>
                </Card>
            </div>

            <div className="space-y-4">
                {habits.map(habit => {
                    const isCompletedToday = habit.completedDates.includes(today);
                    return (
                        <Card key={habit.id} hover>
                            <div className="flex items-start gap-4">
                                <button
                                    onClick={() => toggleHabitToday(habit.id)}
                                    className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-all ${isCompletedToday
                                            ? 'bg-green-500 text-white scale-105'
                                            : 'bg-gray-200 text-gray-400 hover:bg-gray-300'
                                        }`}
                                >
                                    {isCompletedToday ? '✓' : '○'}
                                </button>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
                                        {habit.streak > 0 && (
                                            <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                                                <Flame size={16} />
                                                <span className="text-sm font-medium">{habit.streak} days</span>
                                            </div>
                                        )}
                                    </div>
                                    {habit.description && (
                                        <p className="text-gray-600 mb-3">{habit.description}</p>
                                    )}

                                    <div className="flex gap-1">
                                        {last7Days.map(date => {
                                            const isCompleted = habit.completedDates.includes(date);
                                            const dateObj = new Date(date);
                                            const dayName = dateObj.toLocaleDateString('en-US', {
                                                weekday: 'short',
                                            });
                                            return (
                                                <div key={date} className="flex flex-col items-center gap-1">
                                                    <div
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isCompleted
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-gray-100 text-gray-400'
                                                            }`}
                                                    >
                                                        {isCompleted ? '✓' : '–'}
                                                    </div>
                                                    <span className="text-xs text-gray-500">{dayName}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <Card className="w-full max-w-md">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Habit</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Habit Name
                                </label>
                                <input
                                    type="text"
                                    value={newHabit.name}
                                    onChange={e => setNewHabit({ ...newHabit, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    placeholder="e.g., Daily Exercise"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={newHabit.description}
                                    onChange={e => setNewHabit({ ...newHabit, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                    rows={3}
                                    placeholder="What's your goal?"
                                />
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={handleAddHabit} className="flex-1">
                                    Add Habit
                                </Button>
                                <Button
                                    onClick={() => setShowAddModal(false)}
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}