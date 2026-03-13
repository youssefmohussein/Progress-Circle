import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useGamification } from '../context/GamificationContext';
import { AvatarDisplay } from './AvatarDisplay';
import { avatarOptions } from './avatarOptions';
import { avatarDefaults } from './avatarDefaults';
import { LoadingSpinner } from '../components/LoadingSpinner';

const CATEGORIES = [
    { key: 'head', label: 'Hair / Head', icon: '💇' },
    { key: 'face', label: 'Face', icon: '😀' },
    { key: 'facialHair', label: 'Facial Hair', icon: '🧔' },
    { key: 'clothingColor', label: 'Clothing Col.', icon: '👕' },
    { key: 'accessories', label: 'Accessories', icon: '🕶️' },
    { key: 'skinColor', label: 'Skin Tone', icon: '🎨' },
    { key: 'headContrastColor', label: 'Hair Color', icon: '🖌️' },
    { key: 'backgroundColor', label: 'Background', icon: '🌅' }
];

export function AvatarShop() {
    const { gamData, loading, saveAvatar, buyItem } = useGamification();
    const [activeTab, setActiveTab] = useState('head');
    const [previewConfig, setPreviewConfig] = useState(null);
    const [saving, setSaving] = useState(false);
    const [buying, setBuying] = useState(null);



    // Initialize preview with current saved avatar or defaults
    useEffect(() => {
        if (gamData && gamData.avatarConfig && !previewConfig) {
            setPreviewConfig({ ...avatarDefaults, ...gamData.avatarConfig });
        } else if (gamData && !previewConfig) {
            setPreviewConfig({ ...avatarDefaults, seed: gamData.username || 'default' });
        }
    }, [gamData, previewConfig]);

    if (loading || !gamData || !previewConfig) return <LoadingSpinner />;

    const liveConfig = { ...previewConfig };

    function handlePreview(key, value) {
        setPreviewConfig(prev => ({ ...prev, [key]: value }));
    }

    async function handleSave() {
        setSaving(true);
        try {
            await saveAvatar(liveConfig);
            toast.success('✅ Avatar saved!');
        } catch (e) {
            toast.error(e.response?.data?.message || 'Failed to save avatar');
        } finally {
            setSaving(false);
        }
    }

    // Check if the current preview differs from saved config to show the Save button
    const hasChanges = JSON.stringify(gamData.avatarConfig || {}) !== JSON.stringify(previewConfig);

    const items = gamData.shopItems?.[activeTab] || [];
    const inventory = gamData.inventory || [];

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

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-bold pc-gradient-text" style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'clamp(1.5rem, 6vw, 1.875rem)' }}>
                        Avatar Editor
                    </h1>
                    <p className="text-xs text-muted mt-1">Customize your Open Peeps avatar.</p>
                </div>
            </div>

            {/* Avatar live preview */}
            <div className="flex flex-col items-center gap-4 p-6 rounded-2xl" style={{ background: 'var(--color-surface-2)' }}>
                <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}>
                    <AvatarDisplay avatarConfig={liveConfig} size="xl" previewMode={true} />
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
                        {saving ? 'Saving…' : 'Save Avatar'}
                    </motion.button>
                )}
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
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

            {/* Options grid */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.18 }}
                    className="grid gap-3"
                    style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}
                >
                    {items.map((item, i) => {
                        const optValue = item.val;
                        const isEquipped = liveConfig[activeTab] === optValue;
                        const isOwned = item.price === 0 || inventory.includes(item.id);

                        // Create a temporary config to preview this single option
                        const previewOptConfig = { ...liveConfig, [activeTab]: optValue };

                        return (
                            <motion.div
                                key={`${item.id}`}
                                whileHover={{ y: -2 }}
                                onClick={() => isOwned && handlePreview(activeTab, optValue)}
                                className="relative flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all"
                                style={{
                                    background: isEquipped ? 'rgba(99,102,241,0.15)' : 'var(--color-surface-2)',
                                    border: isEquipped ? '2px solid #6366f1' : '2px solid transparent',
                                    opacity: isOwned ? 1 : 0.9,
                                }}
                            >
                                {/* Mini inline preview for colors or the character itself */}
                                {(activeTab === 'skinColor' || activeTab === 'headContrastColor' || activeTab === 'clothingColor' || activeTab === 'backgroundColor') ? (
                                    <div 
                                        className="w-10 h-10 rounded-full border-2 border-white/10" 
                                        style={{ backgroundColor: optValue === 'transparent' ? 'transparent' : `#${optValue}` }} 
                                    />
                                ) : (
                                    <AvatarDisplay avatarConfig={previewOptConfig} size="sm" showBg={false} />
                                )}

                                <p className="text-[10px] font-semibold text-center mt-1 truncate w-full" style={{ color: 'var(--color-text)' }}>
                                    {item.name}
                                </p>

                                {isEquipped ? (
                                    <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-0.5 mt-1">
                                        <Check size={10} /> Equipped
                                    </span>
                                ) : isOwned ? (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handlePreview(activeTab, optValue); }}
                                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg text-white mt-1"
                                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                                    >
                                        Equip
                                    </button>
                                ) : (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleBuy(item.id, item.price); }}
                                        disabled={buying === item.id || gamData.points < item.price}
                                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg text-white mt-1 disabled:opacity-50"
                                        style={{ background: gamData.points >= item.price ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : '#6b7280' }}
                                    >
                                        {buying === item.id ? '...' : `${item.price} pts`}
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
