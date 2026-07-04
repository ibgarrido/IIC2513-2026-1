/*  Componente de ruta protegida que redirige a los usuarios no autenticados al login. (En desuso)
*/

import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {

    const token = localStorage.getItem('token'); 
    const isAuthenticated = !!token;



    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
}