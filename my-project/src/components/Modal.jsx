import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export function Modal({ open, onClose, title, children, maxWidth = '480px' }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 50,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '1rem',
                        background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)',
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        className="pc-card"
                        style={{ width: '100%', maxWidth, position: 'relative' }}
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold pc-gradient-text">{title}</h2>
                            <button onClick={onClose} className="pc-btn pc-btn-ghost p-2 rounded-lg">
                                <X size={18} style={{ color: 'var(--muted)' }} />
                            </button>
                        </div>
                        {children}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
