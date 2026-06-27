import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

export function ProtectedRoute({ children, role, isPublic }) {
  const { isAuthenticated, role: userRole, user } = useSelector(s => s.auth);

  // If this route is public (like login, register, role-selection) and user is authenticated
  if (isPublic && isAuthenticated) {
    if ((userRole === 'user' || userRole === 'candidate') && !user?.jobRole) {
      return <Navigate to="/onboarding" replace />;
    }
    const dashboardPath = userRole === 'admin' ? '/admin' : (userRole === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    return <Navigate to={dashboardPath} replace />;
  }

  // Normal protected route logic
  if (!isPublic && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check onboarding for user/candidate role
  const isUserRole = userRole === 'user' || userRole === 'candidate';
  const currentPath = window.location.pathname;
  if (!isPublic && isUserRole && !user?.jobRole && currentPath !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  if (!isPublic && isUserRole && user?.jobRole && currentPath === '/onboarding') {
    return <Navigate to="/candidate/dashboard" replace />;
  }

  if (!isPublic && role && userRole !== role) {
    const dashboardPath = userRole === 'admin' ? '/admin' : (userRole === 'recruiter' ? '/recruiter/dashboard' : '/candidate/dashboard');
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
}
