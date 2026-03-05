import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Tasks } from './pages/Tasks';
import { Habits } from './pages/Habits';
import { Goals } from './pages/Goals';
import { Leaderboard } from './pages/Leaderboard';
import { Profile } from './pages/Profile';

// Removed the TS interface for props
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();

  // If authenticated, render children; otherwise, redirect to login
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}



function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <PrivateRoute>
            <Layout>
              <Tasks />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/habits"
        element={
          <PrivateRoute>
            <Layout>
              <Habits />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <PrivateRoute>
            <Layout>
              <Goals />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <PrivateRoute>
            <Layout>
              <Leaderboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout>
              <Profile />
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;