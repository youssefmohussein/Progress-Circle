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
                    className="pt-5 px-4 pb-24 lg:pt-8 lg:px-8 lg:pb-16"
                    style={{
                        maxWidth: '1100px',
                        margin: '0 auto',
                    }}
                >
                    {children}
                </div>

                {/* Floating Quick Add Button for Mobile has been removed per user request */}
            </main>

            <QuickAddModal open={quickAddOpen} onClose={() => setQuickAddOpen(false)} />
        </div>
    );
}