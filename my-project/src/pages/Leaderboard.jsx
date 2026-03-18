import { motion } from 'framer-motion';
import { useSEO } from '../hooks/useSEO';

import { Trophy, Medal, Award, Flame, CheckSquare } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/Card';
import { AvatarDisplay } from '../avatar/AvatarDisplay';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { getTreeMetadata } from '../utils/themeTreeMetadata';
import { EmptyState } from '../components/EmptyState';

const MEDALS = [
    { rank: 1, icon: Trophy, color: 'text-yellow-500', bg: 'from-yellow-400/20 to-amber-400/10', border: 'border-yellow-400/30', emoji: '🥇' },
    { rank: 2, icon: Medal, color: 'text-gray-400', bg: 'from-gray-400/20 to-slate-300/10', border: 'border-gray-300/30', emoji: '🥈' },
    { rank: 3, icon: Award, color: 'text-orange-600', bg: 'from-orange-500/20 to-amber-600/10', border: 'border-orange-400/30', emoji: '🥉' },
];

export function Leaderboard() {
    const { leaderboard } = useData();
    const { user } = useAuth();
    useSEO('Global Rankings', 'See who leads the ProgressCircle leaderboard. Compete on tasks, streaks, and focus sessions.');

    if (!leaderboard) return <LoadingSpinner />;

    if (leaderboard.length === 0) {
        return <EmptyState icon={Trophy} title="Leaderboard is empty" description="Be the first to score points by completing tasks and habits!" />;
    }

    const top3 = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    // Reorder top3 for podium: [2nd, 1st, 3rd]
    const podium = [top3[1], top3[0], top3[2]].filter(Boolean);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-bold pc-gradient-text" style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.5rem, 6vw, 1.875rem)' }}>Leaderboard</h1>
                <p className="text-xs text-muted mt-1">Compete with your peers and rise to the top.</p>
            </div>

            {/* Podium */}
            {top3.length >= 1 && (
                <div className="flex items-end justify-center gap-2 sm:gap-4">
                    {podium.map((entry, i) => {
                        if (!entry) return null;
                        const isFirst = entry.rank === 1;
                        const m = MEDALS[entry.rank - 1];
                        const heights = { 1: 'h-28 sm:h-36', 2: 'h-22 sm:h-28', 3: 'h-18 sm:h-24' };
                        const isMe = entry.user?.id === user?.id;
                        return (
                            <motion.div
                                key={entry.user?.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`flex flex-col items-center gap-1.5 sm:gap-2 ${isFirst ? 'order-2' : i === 0 ? 'order-1' : 'order-3'}`}
                                style={{ minWidth: 0, flex: 1, maxWidth: 110 }}
                            >
                                <span className="text-lg sm:text-2xl">{m.emoji}</span>
                                <AvatarDisplay avatarConfig={entry.user?.avatarConfig} userTheme={entry.user?.themePreferences} size={isFirst ? 'lg' : 'md'} />
                                <div className="text-center max-w-full px-1">
                                    <p className="text-xs font-bold truncate" style={{ color: 'var(--color-text)' }}>{entry.user?.name}{isMe && ' (you)'}</p>
                                    <p className="text-[10px] text-[var(--primary)] font-semibold">{entry.user?.points} pts</p>
                                    {entry.user?.treesCount > 0 && (
                                        <p className="text-[10px] text-emerald-400">
                                            {getTreeMetadata(entry.user.avatarConfig?.farmTheme, 'oak').icon} {entry.user.treesCount}
                                        </p>
                                    )}
                                </div>
                                <div className={`w-full rounded-t-xl bg-gradient-to-t ${m.bg} border border-solid ${m.border} ${heights[entry.rank]} flex items-end justify-center pb-2`}>
                                    <span className={`text-lg sm:text-2xl font-black ${m.color}`} style={{ fontFamily: 'Manrope, sans-serif' }}>#{entry.rank}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Full rankings */}
            <Card>
                <h2 className="text-lg font-bold mb-5" style={{ fontFamily: 'Manrope, sans-serif', color: 'var(--color-text)' }}>Full Rankings</h2>
                <div className="space-y-2">
                    {leaderboard.map((entry, i) => {
                        const isMe = entry.user?.id === user?.id;
                        const m = MEDALS[entry.rank - 1];
                        return (
                            <motion.div
                                key={entry.user?.id}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className={`flex items-center gap-3 p-2 sm:p-3 rounded-xl transition-colors ${isMe ? 'border-2 border-[var(--primary)]/40' : 'hover:opacity-90'
                                    }`}
                                style={{ background: isMe ? 'color-mix(in srgb, var(--primary) 8%, var(--color-surface-2))' : 'var(--color-surface-2)' }}
                            >
                                <div className="w-8 flex-shrink-0 flex justify-center">
                                    {m ? <span className="text-xl">{m.emoji}</span> : <span className="text-sm font-bold text-muted">#{entry.rank}</span>}
                                </div>
                                <AvatarDisplay avatarConfig={entry.user?.avatarConfig} userTheme={entry.user?.themePreferences} size="sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate" style={{ color: 'var(--color-text)' }}>
                                        {entry.user?.name} {isMe && <span className="text-xs text-[var(--primary)] font-normal">(you)</span>}
                                    </p>
                                    <p className="text-xs text-muted flex items-center gap-2 mt-1">
                                        <span className="flex items-center gap-1"><Flame size={10} className="text-orange-400" />{entry.user?.streak} days</span>
                                        <span className="flex items-center gap-1"><CheckSquare size={10} className="text-[var(--primary)]" />{entry.user?.points} total</span>
                                        {entry.user?.treesCount > 0 && (
                                            <span className="text-emerald-400">
                                                {getTreeMetadata(entry.user.avatarConfig?.farmTheme, 'oak').icon} {entry.user.treesCount}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-bold text-[var(--primary)]" style={{ fontFamily: 'Manrope, sans-serif' }}>{entry.user?.points}</p>
                                    <p className="text-xs text-muted">points</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}