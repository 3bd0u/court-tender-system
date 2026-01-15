import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import { authService } from './services/auth';
import Projects from './pages/Projects';
import CandidateDashboard from './pages/CandidateDashboard';

function ProtectedRoute({ children, adminOnly = false }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !authService.isAdmin()) {
    return <Navigate to="/login" />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/projects" element={
  <ProtectedRoute adminOnly>
    <Projects />
  </ProtectedRoute>
} />
        <Route path="/candidate/dashboard" element={
  <ProtectedRoute>
    <CandidateDashboard />
  </ProtectedRoute>
} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;