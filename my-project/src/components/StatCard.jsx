import { motion } from 'framer-motion';

export function StatCard({ label, value, icon: Icon, color = 'indigo', suffix = '', delay = 0 }) {
    const colors = {
        indigo: { bg: '#eef2ff', icon: '#6366f1', border: '#6366f1' },
        sky: { bg: '#e0f2fe', icon: '#0ea5e9', border: '#0ea5e9' },
        green: { bg: '#dcfce7', icon: '#22c55e', border: '#22c55e' },
        orange: { bg: '#ffedd5', icon: '#f97316', border: '#f97316' },
        purple: { bg: '#f3e8ff', icon: '#9333ea', border: '#9333ea' },
    };
    const c = colors[color] || colors.indigo;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay }}
            className="pc-card pc-card-lift"
            style={{ borderLeft: `4px solid ${c.border}` }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>{label}</p>
                    <p className="text-3xl font-bold" style={{ color: 'var(--text)', fontFamily: 'Manrope,sans-serif' }}>
                        {value}{suffix}
                    </p>
                </div>
                <div className="p-3 rounded-xl flex-shrink-0" style={{ background: c.bg }}>
                    <Icon size={24} style={{ color: c.icon }} />
                </div>
            </div>
        </motion.div>
    );
}
