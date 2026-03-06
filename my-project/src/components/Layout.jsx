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
                <div style={{ padding: '2rem 2rem 4rem', paddingTop: '5rem', maxWidth: '1100px', margin: '0 auto' }} className="lg:pt-8">
                    {children}
                </div>

                {/* Floating Quick Add Button for Mobile */}
                <button
                    onClick={() => setQuickAddOpen(true)}
                    className="lg:hidden fixed bottom-20 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-indigo-500/25 transition-all z-40"
                    style={{ zIndex: 44 }}
                >
                    <Plus size={24} />
                </button>
            </main>

            <QuickAddModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
        </div>
    );
}