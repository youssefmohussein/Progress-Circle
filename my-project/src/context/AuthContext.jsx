import { createContext, useContext, useState } from 'react';

// 1. Removed the AuthContextType interface and the User type import
const AuthContext = createContext(undefined);

const mockUser = {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    points: 1250,
    streak: 12,
    joinedAt: '2024-01-15',
};

export function AuthProvider({ children }) {
    // 2. Removed <User | null> generic
    const [user, setUser] = useState(mockUser);

    // 3. Removed type annotations from function parameters
    const login = async (email, password) => {
        console.log('Login:', email, password);
        setUser(mockUser);
    };

    const register = async (name, email, password) => {
        console.log('Register:', name, email, password);
        setUser({ ...mockUser, name, email });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}