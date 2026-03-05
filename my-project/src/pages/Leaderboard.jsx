import { Card } from '../components/Card';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';

export function Leaderboard() {
    const { leaderboard } = useData();
    const { user } = useAuth();

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="text-yellow-500" size={32} />;
            case 2:
                return <Medal className="text-gray-400" size={32} />;
            case 3:
                return <Award className="text-orange-600" size={32} />;
            default:
                return <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-500">#{rank}</div>;
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
                <p className="text-gray-600">See how you rank among your friends</p>
            </div>

            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {leaderboard.slice(0, 3).map(entry => (
                    <Card
                        key={entry.user.id}
                        className={`text-center ${entry.rank === 1 ? 'border-2 border-yellow-400' : ''}`}
                    >
                        <div className="flex justify-center mb-3">{getRankIcon(entry.rank)}</div>
                        <div className="flex justify-center mb-3">
                            <img
                                src={entry.user.avatar || 'https://via.placeholder.com/80'}
                                alt={entry.user.name}
                                className="w-16 h-16 rounded-full object-cover border-4 border-gray-100"
                            />
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{entry.user.name}</h3>
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp size={16} className="text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">{entry.user.points}</span>
                        </div>
                        <p className="text-sm text-gray-600">points</p>
                    </Card>
                ))}
            </div>

            {/* Full Rankings Table */}
            <Card>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Full Rankings</h2>
                <div className="space-y-2">
                    {leaderboard.map(entry => {
                        const isCurrentUser = entry.user.id === user?.id;
                        return (
                            <div
                                key={entry.user.id}
                                className={`flex items-center gap-4 p-4 rounded-lg transition-all ${isCurrentUser
                                        ? 'bg-blue-50 border-2 border-blue-300'
                                        : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                <div className="flex-shrink-0 w-12 flex justify-center">
                                    {entry.rank <= 3 ? (
                                        getRankIcon(entry.rank)
                                    ) : (
                                        <span className="text-xl font-bold text-gray-500">#{entry.rank}</span>
                                    )}
                                </div>

                                <img
                                    src={entry.user.avatar || 'https://via.placeholder.com/50'}
                                    alt={entry.user.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />

                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                        {entry.user.name}
                                        {isCurrentUser && (
                                            <span className="ml-2 text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                                You
                                            </span>
                                        )}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <TrendingUp size={14} />
                                            {entry.weeklyPoints} this week
                                        </span>
                                        <span>{entry.user.streak} day streak</span>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-2xl font-bold text-gray-900">{entry.user.points}</div>
                                    <div className="text-sm text-gray-600">points</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Scoring Legend */}
            <Card className="mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">How Points Work</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">10</div>
                        <div>
                            <p className="font-medium text-gray-900">Complete a Task</p>
                            <p className="text-sm text-gray-600">Earn points for each completed task</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold">5</div>
                        <div>
                            <p className="font-medium text-gray-900">Complete a Habit</p>
                            <p className="text-sm text-gray-600">Daily habit completion</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg">
                        <div className="w-8 h-8 bg-orange-600 text-white rounded-lg flex items-center justify-center font-bold">50</div>
                        <div>
                            <p className="font-medium text-gray-900">Achieve a Goal</p>
                            <p className="text-sm text-gray-600">Complete long-term goals</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-violet-50 rounded-lg">
                        <div className="w-8 h-8 bg-violet-600 text-white rounded-lg flex items-center justify-center font-bold">2</div>
                        <div>
                            <p className="font-medium text-gray-900">Maintain Streak</p>
                            <p className="text-sm text-gray-600">Points per day of active streak</p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}