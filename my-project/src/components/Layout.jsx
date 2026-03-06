import { useState } from 'react';
import { Sidebar } from './SideBar';
import { QuickAddModal } from './QuickAddModal';
import { Plus } from 'lucide-react';

export function Layout({ children }) {
    const [quickAddOpen, setQuickAddOpen] = useState(false);

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
            <Sidebar onQuickAdd={() => setQuickAddOpen(true)} />
            {/* lg:ml-64 = 256px sidebar width */}
            <main style={{ flex: 1, minWidth: 0, position: 'relative' }} className="lg:ml-64">
                {/*
                  Mobile: px-4 pt-5 pb-24 (pb clears the fixed bottom nav)
                  Desktop: px-8 pt-8 pb-16
                */}
                <div
                    className="lg:pt-8 lg:px-8 lg:pb-16"
                    style={{
                        padding: '1.25rem 1rem 6rem',
                        maxWidth: '1100px',
                        margin: '0 auto',
                    }}
                >
                    {children}
                </div>

                {/* Floating Quick Add Button for Mobile */}
                <button
                    onClick={() => setQuickAddOpen(true)}
                    className="lg:hidden fixed bottom-20 right-5 w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-indigo-500/25 transition-all z-40"
                    style={{ zIndex: 44, boxShadow: '0 4px 20px rgba(99,102,241,0.45)' }}
                    aria-label="Quick add"
                >
                    <Plus size={22} />
                </button>
            </main>

            <QuickAddModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
        </div>
    );
}