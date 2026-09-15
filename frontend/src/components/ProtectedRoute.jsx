import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// requireAdmin = true restricts the route to admin users only
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { isAuthenticated, isAdmin, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Prevent admins from being stuck on customer-only pages if desired later; currently unrestricted
  return children;
};

export default ProtectedRoute;
