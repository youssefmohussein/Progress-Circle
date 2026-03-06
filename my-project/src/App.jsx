import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Habits } from './pages/Habits';
import { Goals } from './pages/Goals';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';
import { Courses } from './pages/Courses';
import { Assignments } from './pages/Assignments';
import { Exams } from './pages/Exams';
import { Fitness } from './pages/Fitness';
import { Learning } from './pages/Learning';
import { Schedule } from './pages/Schedule';
import { AdminDashboard } from './pages/Admin/AdminDashboard';

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
      <Route path="/goals" element={<PrivateRoute><Layout><Goals /></Layout></PrivateRoute>} />
      <Route path="/leaderboard" element={<PrivateRoute><Layout><Leaderboard /></Layout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Layout><Profile /></Layout></PrivateRoute>} />
      <Route path="/courses" element={<PrivateRoute><Layout><Courses /></Layout></PrivateRoute>} />
      <Route path="/assignments" element={<PrivateRoute><Layout><Assignments /></Layout></PrivateRoute>} />
      <Route path="/exams" element={<PrivateRoute><Layout><Exams /></Layout></PrivateRoute>} />
      <Route path="/fitness" element={<PrivateRoute><Layout><Fitness /></Layout></PrivateRoute>} />
      <Route path="/learning" element={<PrivateRoute><Layout><Learning /></Layout></PrivateRoute>} />
      <Route path="/schedule" element={<PrivateRoute><Layout><Schedule /></Layout></PrivateRoute>} />

      <Route path="/admin" element={<AdminRoute><Layout><AdminDashboard /></Layout></AdminRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
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
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;