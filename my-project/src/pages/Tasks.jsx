import { Card } from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { User, Trophy, Target, Calendar, TrendingUp } from 'lucide-react';

export function Tasks() {
    const { user } = useAuth();
    const { tasks, habits, goals } = useData();

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const activeHabits = habits.length;
    const completedGoals = goals.filter(g => g.status === 'completed').length;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Tasks</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="flex items-center gap-4">
                    <div className="p-4 rounded-lg bg-blue-100 text-blue-600">
                        <Trophy size={32} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Tasks Completed</p>
                        <p className="text-3xl font-bold text-gray-900">{completedTasks}</p>
                    </div>
                </Card>
            </div>

            <Card>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Task List</h3>
                <div className="space-y-4">
                    {tasks.map(task => (
                        <div key={task.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-700">{task.title}</span>
                            <span className={`px-2 py-1 rounded text-xs ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                {task.status.replace('_', ' ')}
                            </span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}
