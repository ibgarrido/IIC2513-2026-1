import { Navigate, Outlet, useOutletContext } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const context = useOutletContext();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet context={context} />;
}
