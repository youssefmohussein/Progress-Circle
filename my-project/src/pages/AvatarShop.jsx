import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ShoppingBag, Check, Lock, Coins, Snowflake } from 'lucide-react';
import { toast } from 'sonner';
import { useGamification } from '../context/GamificationContext';
import { AvatarDisplay } from '../components/AvatarDisplay';
import { LoadingSpinner } from '../components/LoadingSpinner';

const CATEGORIES = [
    { key: 'hair', label: 'Hair', icon: '💇' },
    { key: 'shirt', label: 'Shirt', icon: '👕' },
    { key: 'pants', label: 'Pants', icon: '👖' },
    { key: 'shoes', label: 'Shoes', icon: '👟' },
    { key: 'eyes', label: 'Eyes', icon: '👀' },
    { key: 'eyeColor', label: 'Eye Color', icon: '🎨' },
    { key: 'accessory', label: 'Accessories', icon: '🎩' },
    { key: 'bg', label: 'Background', icon: '🌅' },
    { key: 'powerups', label: 'Powerups', icon: '⚡' },
];

const EYE_COLOR_MAP = {
    'Dark Brown': '#5c3317',
    'Hazel':      '#8b6914',
    'Blue':       '#3b82f6',
    'Green':      '#22c55e',
    'Gray':       '#94a3b8',
    'Amber':      '#f59e0b',
    'Violet':     '#8b5cf6',
    'Red':        '#ef4444',
    'Gold':       '#eab308',
};



export function AvatarShop() {
    const { gamData, loading, saveAvatar, buyItem } = useGamification();
    const [activeTab, setActiveTab] = useState('hair');
    const [previewConfig, setPreviewConfig] = useState(null);
    const [buying, setBuying] = useState(null);
    const [saving, setSaving] = useState(false);

    if (loading || !gamData) return <LoadingSpinner />;

    const { points, avatarConfig, inventory, shopItems } = gamData;
    // Live config = saved config merged with any preview changes
    const liveConfig = { ...avatarConfig, ...previewConfig };

    const items = shopItems?.[activeTab] ?? [];

    function isOwned(itemId) {
        return (inventory || []).includes(itemId);
    }

    function getEquippedIndex() {
        return liveConfig[activeTab] ?? 0;
    }

    function handlePreview(index) {
        setPreviewConfig(prev => ({ ...(prev || {}), [activeTab]: index }));
    }

    async function handleBuy(itemId, price) {
        if (buying) return;
        setBuying(itemId);
        try {
            await buyItem(itemId);
            toast.success(`🛍️ Item purchased! -${price} pts`);
        } catch (e) {
            toast.error(e.response?.data?.message || 'Purchase failed');
        } finally {
            setBuying(null);
        }
    }

    async function handleSave() {
        if (!previewConfig) return;
        setSaving(true);
        try {
            await saveAvatar(liveConfig);
            setPreviewConfig(null);
            toast.success('✅ Avatar saved!');
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to save avatar');
        } finally {
            setSaving(false);
        }
    }

    const hasChanges = previewConfig && Object.keys(previewConfig).length > 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold pc-gradient-text" style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.5rem, 6vw, 1.875rem)' }}>
                        Avatar Shop
                    </h1>
                    <p className="text-xs text-muted mt-1">Customise your character with earned points.</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
                    <Coins size={16} className="text-yellow-400" />
                    <span className="font-bold text-yellow-400" style={{ fontFamily: 'Manrope, sans-serif' }}>{points}</span>
                    <span className="text-xs text-muted">pts</span>
                </div>
            </div>

            {/* Avatar preview */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl" style={{ background: 'var(--color-surface-2)' }}>
                <motion.div animate={{ scale: [1, 1.03, 1] }} transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}>
                    <AvatarDisplay avatarConfig={liveConfig} size="xl" />
                </motion.div>
                {hasChanges && (
                    <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={handleSave}
                        disabled={saving}
                        className="px-5 py-2 rounded-xl font-semibold text-sm text-white flex items-center gap-2"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                        <Sparkles size={14} />
                        {saving ? 'Saving…' : 'Save Changes'}
                    </motion.button>
                )}
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.key}
                        onClick={() => setActiveTab(cat.key)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
                        style={{
                            background: activeTab === cat.key ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'var(--color-surface-2)',
                            color: activeTab === cat.key ? 'white' : 'var(--color-text-muted)',
                        }}
                    >
                        <span>{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Items grid */}
            <AnimatePresence mode="wait">
                {activeTab === 'powerups' ? (
                    <motion.div
                        key="powerups"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid gap-4"
                        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}
                    >
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -2 }}
                                className="relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-surface-2 border border-white/5"
                            >
                                <div className="p-4 rounded-full bg-blue-500/10 text-blue-400">
                                    <Snowflake size={32} />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black text-white uppercase tracking-widest">{item.name}</p>
                                    <p className="text-[10px] text-muted leading-tight mt-1 px-2">{item.desc}</p>
                                </div>
                                <button
                                    onClick={() => handleBuy(item.id, item.price)}
                                    disabled={buying === item.id || points < item.price || gamData.userPlan !== 'premium'}
                                    className="w-full mt-2 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 text-white disabled:opacity-50"
                                    style={{ background: points >= item.price && gamData.userPlan === 'premium' ? 'linear-gradient(135deg, #3b82f6, #60a5fa)' : '#374151' }}
                                >
                                    {gamData.userPlan !== 'premium' ? (
                                        <><Lock size={12} /> Pro Only</>
                                    ) : (
                                        <><Coins size={12} /> {buying === item.id ? '...' : `${item.price} pts`}</>
                                    )}
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : activeTab === 'eyeColor' ? (
                    <motion.div
                        key="eyeColor"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.18 }}
                        className="grid gap-4"
                        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}
                    >
                        {items.map((item, i) => {
                            const owned = isOwned(item.id);
                            const equipped = getEquippedIndex() === i;
                            const isMilestone = !!item.milestone;
                            const color = EYE_COLOR_MAP[item.name] || '#888';
                            return (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ y: -2 }}
                                    onClick={() => owned && handlePreview(i)}
                                    className="relative flex flex-col items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all"
                                    style={{
                                        background: equipped ? 'rgba(99,102,241,0.15)' : 'var(--color-surface-2)',
                                        border: equipped ? `2px solid ${color}` : '2px solid transparent',
                                    }}
                                >
                                    {/* Color swatch */}
                                    <div style={{
                                        width: 52, height: 52, borderRadius: '50%',
                                        background: color,
                                        boxShadow: equipped ? `0 0 16px ${color}80` : `0 0 8px ${color}40`,
                                        border: `3px solid ${color}`,
                                        transition: 'all 0.3s',
                                    }} />
                                    <p className="text-xs font-semibold text-center" style={{ color: 'var(--color-text)' }}>{item.name}</p>
                                    {equipped ? (
                                        <span className="text-[10px] font-bold flex items-center gap-0.5" style={{ color }}><Check size={10} />Equipped</span>
                                    ) : owned ? (
                                        <button
                                            onClick={e => { e.stopPropagation(); handlePreview(i); }}
                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-lg text-white"
                                            style={{ background: color }}
                                        >Equip</button>
                                    ) : isMilestone ? (
                                        <span className="text-[10px] text-yellow-500 font-semibold flex items-center gap-0.5"><Lock size={9} />Milestone</span>
                                    ) : (
                                        <button
                                            onClick={e => { e.stopPropagation(); handleBuy(item.id, item.price); }}
                                            disabled={buying === item.id || points < item.price}
                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-0.5 text-white disabled:opacity-50"
                                            style={{ background: points >= item.price ? color : '#6b7280' }}
                                        >
                                            <Coins size={9} />
                                            {buying === item.id ? '…' : `${item.price} pts`}
                                        </button>
                                    )}
                                </motion.div>
                            );
                        })}
                    </motion.div>
                ) : (
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="grid gap-3"
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}
                >
                    {items.map((item, i) => {
                        const owned = isOwned(item.id);
                        const equipped = getEquippedIndex() === i;
                        const isMilestone = !!item.milestone;

                        return (
                            <motion.div
                                key={item.id}
                                whileHover={{ y: -2 }}
                                onClick={() => owned && handlePreview(i)}
                                className="relative flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all"
                                style={{
                                    background: equipped ? 'rgba(99,102,241,0.15)' : 'var(--color-surface-2)',
                                    border: equipped ? '2px solid #6366f1' : '2px solid transparent',
                                    opacity: !owned && !isMilestone ? 0.95 : 1,
                                }}
                            >
                                {/* Mini avatar preview for this item */}
                                <AvatarDisplay
                                    avatarConfig={{ ...liveConfig, [activeTab]: i }}
                                    size="sm"
                                    showBg={activeTab === 'bg'}
                                />

                                <p className="text-xs font-semibold text-center" style={{ color: 'var(--color-text)' }}>{item.name}</p>

                                {/* Status badge */}
                                {equipped ? (
                                    <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-0.5"><Check size={10} />Equipped</span>
                                ) : owned ? (
                                    <button
                                        onClick={e => { e.stopPropagation(); handlePreview(i); }}
                                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg text-white"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                                    >
                                        Equip
                                    </button>
                                ) : isMilestone ? (
                                    <span className="text-[10px] text-yellow-500 font-semibold flex items-center gap-0.5"><Lock size={9} />Milestone</span>
                                ) : (
                                    <button
                                        onClick={e => { e.stopPropagation(); handleBuy(item.id, item.price); }}
                                        disabled={buying === item.id || points < item.price}
                                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-0.5 text-white disabled:opacity-50"
                                        style={{ background: points >= item.price ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : '#6b7280' }}
                                    >
                                        <Coins size={9} />
                                        {buying === item.id ? '…' : `${item.price} pts`}
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
