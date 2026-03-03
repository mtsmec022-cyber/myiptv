import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback, ReactNode } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { LiveTV } from './pages/LiveTV';
import { Movies } from './pages/Movies';
import { Series } from './pages/Series';
import { Settings } from './pages/Settings';
import { Player } from './pages/Player';
import { Search } from './pages/Search';
import { Favorites } from './pages/Favorites';
import { Login } from './pages/Login';
import { Sync } from './pages/Sync';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { auth } = useAuth();
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Global TV Remote Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Basic TV keys mapping
      switch (e.key) {
        case 'Backspace':
        case 'Escape':
          if (location.pathname !== '/') {
            navigate(-1);
          }
          break;
        // Add more global keys if needed
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, location]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/sync" element={<ProtectedRoute><Sync /></ProtectedRoute>} />
      <Route path="/" element={<ProtectedRoute><Layout><Home /></Layout></ProtectedRoute>} />
      <Route path="/live" element={<ProtectedRoute><Layout><LiveTV /></Layout></ProtectedRoute>} />
      <Route path="/movies" element={<ProtectedRoute><Layout><Movies /></Layout></ProtectedRoute>} />
      <Route path="/series" element={<ProtectedRoute><Layout><Series /></Layout></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><Layout><Search /></Layout></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><Layout><Favorites /></Layout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
      <Route path="/player" element={<ProtectedRoute><Player /></ProtectedRoute>} />
    </Routes>
  );
}
