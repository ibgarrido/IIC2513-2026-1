import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { normalizeUser } from "../../utils/userFromApi";
import "./DashboardLayout.css";

function readStoredUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return normalizeUser(parsed);
  } catch {
    return null;
  }
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      localStorage.removeItem("user");
      return;
    }
    setUser(readStoredUser());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-root">
      <div className="background-decor">
        <div className="glow-primary"></div>
        <div className="glow-accent"></div>
        <div className="grainy-bg"></div>
      </div>

      <Navbar user={user} onLogout={handleLogout} />

      <div className="dashboard-body">
        <Outlet context={{ user, setUser }} />
      </div>
    </div>
  );
}
