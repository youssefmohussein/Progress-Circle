import { Sidebar } from './SideBar';

export function Layout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
}