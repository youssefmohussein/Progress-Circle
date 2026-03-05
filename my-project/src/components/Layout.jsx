import { Sidebar } from './SideBar';

export function Layout({ children }) {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
            <Sidebar />
            {/* lg:ml-64 = 256px sidebar width */}
            <main style={{ flex: 1, minWidth: 0 }} className="lg:ml-64">
                <div style={{ padding: '2rem 2rem 4rem', paddingTop: '5rem', maxWidth: '1100px', margin: '0 auto' }} className="lg:pt-8">
                    {children}
                </div>
            </main>
        </div>
    );
}