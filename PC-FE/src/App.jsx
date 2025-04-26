import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from 'antd';
import { Toaster } from 'react-hot-toast';
import DogLoader from './components/Loader/DogLoader';
import PageTransition from './components/PageTransition/PageTransition';
import EnvTest from './components/EnvTest/EnvTest';

// Import pages directly instead of using lazy loading
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/Login/LoginPage';
import RegisterPage from './pages/Auth/Register/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPassword/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import Navbar from './pages/Navbar/Navbar';




const { Content } = Layout;

// Centralized loading component with dog animation
const Loader = () => (
  <div 
    style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '60vh' 
    }}
  >
    <DogLoader size="medium" />
  </div>
);

// Protected route component with optimized logic
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <Loader />;
  
  return isAuthenticated 
    ? children 
    : <Navigate to="/login" state={{ from: location.pathname }} replace />;
};

// Public route with optimized logic
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <Loader />;
  
  return isAuthenticated 
    ? <Navigate to="/dashboard" replace /> 
    : children;
};

// Toast notification configuration
const toastOptions = {
  duration: 3000,
  style: {
    background: '#fff',
    color: 'rgba(0, 0, 0, 0.85)',
    border: '1px solid #f0f0f0',
  },
  success: {
    duration: 3000,
    style: {
      background: '#52c41a',
      color: '#fff',
    },
  },
  error: {
    duration: 4000,
    style: {
      background: '#ff4d4f',
      color: '#fff',
    },
  },
};

// Main application layout component
const AppLayout = () => (
  <Layout style={{ minHeight: '100vh' }}>
    <Navbar />
    <Content style={{ background: '#fff' }}>
      <PageTransition>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={
            <PublicRoute><LoginPage /></PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute><RegisterPage /></PublicRoute>
          } />
          <Route path="/forgot-password" element={
            <PublicRoute><ForgotPasswordPage /></PublicRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><DashboardPage tab="profile" /></ProtectedRoute>
          } />
          <Route path="/env-test" element={<EnvTest />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageTransition>
    </Content>
    <Toaster position="top-right" toastOptions={toastOptions} />
  </Layout>
);

// Root App component
const App = () => (
  <AuthProvider>
    <AppLayout />
  </AuthProvider>
);

export default App;
