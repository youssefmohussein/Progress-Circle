import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { User, Trophy, Target, Calendar, TrendingUp } from 'lucide-react';

export function Profile() {
    const { user } = useAuth();
    const { tasks, habits, goals } = useData();

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const activeHabits = habits.length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;

    const memberSince = user?.joinedAt
        ? new Date(user.joinedAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
        })
        : '';

    const stats = [
        { label: 'Tasks Completed', value: completedTasks, icon: Trophy, color: 'blue' },
        { label: 'Active Habits', value: activeHabits, icon: Calendar, color: 'green' },
        { label: 'Goals Achieved', value: completedGoals, icon: Target, color: 'orange' },
        { label: 'Current Streak', value: user?.streak || 0, icon: TrendingUp, color: 'violet' },
    ];

    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        orange: 'bg-orange-100 text-orange-600',
        violet: 'bg-violet-100 text-violet-600',
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

            <Card className="mb-8">
                <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                        {user?.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                                <User className="text-white" size={48} />
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
                        <p className="text-gray-600 mb-4">{user?.email}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                            <div>
                                <span className="font-medium text-gray-900">{user?.points || 0}</span> Points
                            </div>
                            <div>
                                <span className="font-medium text-gray-900">{user?.streak || 0}</span> Day
                                Streak
                            </div>
                            <div>Member since {memberSince}</div>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {stats.map(stat => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="flex items-center gap-4">
                            <div className={`p-4 rounded-lg ${colorClasses[stat.color]}`}>
                                <Icon size={32} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Activity Summary</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Total Tasks</span>
                        <span className="font-semibold text-gray-900">{tasks.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Tasks Completed</span>
                        <span className="font-semibold text-gray-900">{completedTasks}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Active Habits</span>
                        <span className="font-semibold text-gray-900">{activeHabits}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Total Goals</span>
                        <span className="font-semibold text-gray-900">{goals.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Goals Completed</span>
                        <span className="font-semibold text-gray-900">{completedGoals}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Average Goal Progress</span>
                        <span className="font-semibold text-gray-900">
                            {goals.length > 0
                                ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
                                : 0}
                            %
                        </span>
                    </div>
                </div>
            </Card>
        </div>
    );
}