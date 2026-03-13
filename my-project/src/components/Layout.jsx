import { useState } from 'react';
import { Sidebar, SidebarContent } from './SideBar';
import { QuickAddModal } from './QuickAddModal';
import { Plus, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export function Layout({ children }) {
    const [quickAddOpen, setQuickAddOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { dark } = useTheme();

    return (
        <div style={{ display: 'flex', height: '100vh', background: 'var(--bg)', overflow: 'hidden', flexDirection: 'column' }}>
            {/* Mobile Header */}
            <header 
                className="flex lg:hidden items-center justify-between px-4"
                style={{
                    height: '60px',
                    background: dark ? 'rgba(15, 14, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(12px)',
                    borderBottom: dark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid var(--border)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 45,
                    flexShrink: 0
                }}
            >
                <div className="flex items-center gap-2">
                    <span style={{ fontFamily: 'Manrope,sans-serif', fontWeight: 800, fontSize: '1.1rem', color: dark ? '#fff' : 'var(--text)' }}>
                        Progress<span style={{ color: 'var(--primary)' }}>Circle</span>
                    </span>
                </div>
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    style={{ background: 'none', border: 'none', color: dark ? '#fff' : 'var(--text)', cursor: 'pointer', padding: '8px' }}
                >
                    <Menu size={24} />
                </button>
            </header>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Sidebar onQuickAdd={() => setQuickAddOpen(true)} />
                {/* lg:ml-64 = 256px sidebar width */}
                <main style={{ flex: 1, minWidth: 0, position: 'relative', height: '100%', overflowY: 'auto' }} className="lg:ml-64">
                    {/*
                      Mobile: px-4 pt-5 pb-24 (pb clears the fixed bottom nav)
                      Desktop: px-8 pt-8 pb-16
                    */}
                    <div
                        className="pt-5 px-4 pb-8 lg:pt-8 lg:px-8 lg:pb-16"
                        style={{
                            maxWidth: '1100px',
                            margin: '0 auto',
                            minHeight: 'min-content'
                        }}
                    >
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 50
                            }}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                bottom: 0,
                                width: '280px',
                                zIndex: 55,
                                background: 'var(--surface)',
                                boxShadow: '10px 0 30px rgba(0,0,0,0.1)'
                            }}
                        >
                            <SidebarContent onClose={() => setIsMobileMenuOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <QuickAddModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
        </div>
    );
}