import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" replace />;

  let isAdmin;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    isAdmin = payload.rol === 'admin';
  } catch {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) return <Navigate to="/catalog" replace />;
  return children;
}
