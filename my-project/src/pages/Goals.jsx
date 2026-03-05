import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { CheckCircle2, Flame, Trophy, Target, TrendingUp } from 'lucide-react';

export function Goals() {
    const { user } = useAuth();
    const { tasks, habits, goals, leaderboard } = useData();

    // Logic remains identical in JS
    const todaysTasks = tasks.filter(task => task.status !== 'completed');
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const activeGoals = goals.filter(goal => goal.status === 'active');

    const today = new Date().toISOString().split('T')[0];
    const habitsCompletedToday = habits.filter(habit =>
        habit.completedDates.includes(today)
    );

    const userRank = leaderboard.find(entry => entry.user.id === user?.id)?.rank || 0;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Goals
                </h1>
                <p className="text-gray-600">Track your long-term objectives</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Current Streak</p>
                            <p className="text-3xl font-bold text-gray-900">{user?.streak} days</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <Flame className="text-blue-600 streak-pulse" size={28} />
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total Points</p>
                            <p className="text-3xl font-bold text-gray-900">{user?.points}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Trophy className="text-green-600" size={28} />
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Your Rank</p>
                            <p className="text-3xl font-bold text-gray-900">#{userRank}</p>
                        </div>
                        <div className="bg-orange-100 p-3 rounded-lg">
                            <TrendingUp className="text-orange-600" size={28} />
                        </div>
                    </div>
                </Card>

                <Card className="border-l-4 border-violet-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Tasks Done</p>
                            <p className="text-3xl font-bold text-gray-900">{completedTasks.length}</p>
                        </div>
                        <div className="bg-violet-100 p-3 rounded-lg">
                            <CheckCircle2 className="text-violet-600" size={28} />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                    <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="text-blue-600" size={24} />
                        <h2 className="text-xl font-semibold text-gray-900">Today's Tasks</h2>
                    </div>
                    {todaysTasks.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">All tasks completed!</p>
                    ) : (
                        <div className="space-y-3">
                            {todaysTasks.slice(0, 4).map(task => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div
                                        className={`w-2 h-2 rounded-full ${task.priority === 'high'
                                            ? 'bg-red-500'
                                            : task.priority === 'medium'
                                                ? 'bg-orange-500'
                                                : 'bg-green-500'
                                            }`}
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{task.title}</p>
                                        {task.deadline && (
                                            <p className="text-sm text-gray-500">Due: {task.deadline}</p>
                                        )}
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-1 rounded ${task.status === 'in_progress'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {task.status.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                <Card>
                    <div className="flex items-center gap-2 mb-4">
                        <Flame className="text-orange-600" size={24} />
                        <h2 className="text-xl font-semibold text-gray-900">Habit Tracker</h2>
                    </div>
                    <div className="space-y-4">
                        {habits.slice(0, 3).map(habit => {
                            const isCompletedToday = habit.completedDates.includes(today);
                            return (
                                <div key={habit.id} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{habit.name}</p>
                                        <p className="text-sm text-gray-500">{habit.streak} day streak</p>
                                    </div>
                                    <div
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${isCompletedToday
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-400'
                                            }`}
                                    >
                                        {isCompletedToday ? '✓' : '○'}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>

            <Card>
                <div className="flex items-center gap-2 mb-6">
                    <Target className="text-blue-600" size={24} />
                    <h2 className="text-xl font-semibold text-gray-900">Active Goals</h2>
                </div>
                <div className="space-y-6">
                    {activeGoals.slice(0, 3).map(goal => (
                        <div key={goal.id}>
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-medium text-gray-900">{goal.title}</h3>
                                    {goal.description && (
                                        <p className="text-sm text-gray-500">{goal.description}</p>
                                    )}
                                </div>
                                {goal.targetDate && (
                                    <span className="text-sm text-gray-500">Due: {goal.targetDate}</span>
                                )}
                            </div>
                            <ProgressBar progress={goal.progress} />
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}