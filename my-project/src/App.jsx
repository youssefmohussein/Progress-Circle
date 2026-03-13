import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { GamificationProvider } from './context/GamificationContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Leaderboard } from './pages/Leaderboard';
import { Habits } from './pages/Habits';
import { Info } from './pages/Info';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { Savings } from './pages/Savings';
import { Fitness } from './pages/Fitness';
import { FocusMode } from './pages/FocusMode';
import { AvatarShop } from './avatar/AvatarShop';
import { FocusFarm } from './pages/FocusFarm';
import { Unlockables } from './pages/Unlockables';
import { Planner } from './pages/Planner';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!user?.isAdmin) return <Navigate to="/" />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><Layout><Tasks /></Layout></PrivateRoute>} />
      <Route path="/habits" element={<PrivateRoute><Layout><Habits /></Layout></PrivateRoute>} />
      <Route path="/leaderboard" element={<PrivateRoute><Layout><Leaderboard /></Layout></PrivateRoute>} />
      <Route path="/planner" element={<PrivateRoute><Layout><Planner /></Layout></PrivateRoute>} />
      <Route path="/info" element={<PrivateRoute><Layout><Info /></Layout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
      <Route path="/savings" element={<PrivateRoute><Layout><Savings /></Layout></PrivateRoute>} />
      <Route path="/fitness" element={<PrivateRoute><Layout><Fitness /></Layout></PrivateRoute>} />
      <Route path="/focus" element={<PrivateRoute><Layout><FocusMode /></Layout></PrivateRoute>} />

      {/* Gamification */}
      <Route path="/avatar-shop" element={<PrivateRoute><Layout><AvatarShop /></Layout></PrivateRoute>} />
      <Route path="/farm" element={<PrivateRoute><Layout><FocusFarm /></Layout></PrivateRoute>} />
      <Route path="/milestones" element={<PrivateRoute><Layout><Unlockables /></Layout></PrivateRoute>} />

      <Route path="/admin" element={<AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <DataProvider>
            <GamificationProvider>
              <AppRoutes />
              <Toaster
                position="top-right"
                richColors
                expand={false}
                toastOptions={{
                  style: {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                  },
                }}
              />
            </GamificationProvider>
          </DataProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;