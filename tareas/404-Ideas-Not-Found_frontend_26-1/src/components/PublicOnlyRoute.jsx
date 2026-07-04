/*  Componente de ruta pública que redirige a los usuarios autenticados al catálogo.
*/

import { Navigate } from 'react-router-dom';

export default function PublicOnlyRoute({ children }) {
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  if (isAuthenticated) {
    return <Navigate to="/catalog" replace />;
  }

  return children;
}