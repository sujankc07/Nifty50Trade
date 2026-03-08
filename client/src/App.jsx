import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Navbar from './components/layout/Navbar.jsx';
import AuthLayout from './components/auth/AuthLayout.jsx';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import MarketsPage from './pages/Markets.jsx';
import PortfolioPage from './pages/Portfolio.jsx';
import HistoryPage from './pages/History.jsx';
import WatchlistPage from './pages/Watchlist.jsx';
import './styles/global.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const AppRoutes = () => (
  <Routes>
    {/* Auth routes */}
    <Route element={<AuthLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Route>

    {/* Protected routes */}
    <Route path="/dashboard" element={<PrivateRoute><AppLayout><DashboardPage /></AppLayout></PrivateRoute>} />
    <Route path="/markets" element={<PrivateRoute><AppLayout><MarketsPage /></AppLayout></PrivateRoute>} />
    <Route path="/portfolio" element={<PrivateRoute><AppLayout><PortfolioPage /></AppLayout></PrivateRoute>} />
    <Route path="/history" element={<PrivateRoute><AppLayout><HistoryPage /></AppLayout></PrivateRoute>} />
    <Route path="/watchlist" element={<PrivateRoute><AppLayout><WatchlistPage /></AppLayout></PrivateRoute>} />

    {/* Default redirect */}
    <Route path="*" element={<Navigate to="/dashboard" />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;