import { Link, NavLink } from "react-router-dom";
import UserAvatar from "../UserAvatar/UserAvatar";
import "./Navbar.css";

function navLinkClass({ isActive }) {
  return isActive ? "navbar-link navbar-link--active" : "navbar-link";
}

export default function Navbar({ user, onLogout }) {
  return (
    <>
      <header className="app-navbar">
        <div className="app-navbar-inner">
          <Link to="/" className="navbar-logo" aria-label="DCCPalooza — inicio">
            <span className="navbar-logo-brand">
              DCC<span className="navbar-logo-brand-accent">PALOOZA</span>
            </span>
          </Link>

          <nav className="navbar-desktop-nav" aria-label="Principal">
            <NavLink to="/mercado" className={navLinkClass} end>
              Mercado de artistas
            </NavLink>
            {user && (
              <NavLink to="/mis-artistas" className={navLinkClass}>
                Contratados
              </NavLink>
            )}
            {user && (
              <NavLink to="/mis-reviews" className={navLinkClass}>
                Mis Reviews
              </NavLink>
            )}
          </nav>

          <div className="navbar-right">
            <div className="navbar-brand-mini" aria-hidden="true">
              DCC&apos;27
            </div>
            <div className="navbar-balance-desktop">
              {user && (
                <div className="navbar-user-desktop-info">
                  <span className="navbar-user-name">{user.username}</span>
                  {typeof user.balance === "number" && (
                    <span className="navbar-balance-value">
                      {user.balance.toLocaleString()} LC
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="navbar-user-mobile">
              {user && (
                <>
                  <span className="navbar-user-mobile-name">{user.username}</span>
                  <span className="navbar-user-mobile-balance">
                    {typeof user.balance === "number"
                      ? `${user.balance.toLocaleString()} LC`
                      : ""}
                  </span>
                </>
              )}
            </div>
            {user && (
              <Link
                to="/perfil"
                className="navbar-profile-link"
                title="Perfil"
                aria-label="Perfil"
              >
                <UserAvatar user={user} size="sm" />
              </Link>
            )}
            {user ? (
              <button
                type="button"
                className="navbar-icon-btn navbar-logout"
                onClick={onLogout}
                title="Cerrar sesión"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                className="navbar-login-btn"
                title="Iniciar sesión"
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </header>

      <nav className="navbar-mobile-bottom" aria-label="Principal móvil">
        <NavLink
          to="/mercado"
          className={navLinkClass}
          end
          title="Mercado de artistas"
        >
          <span className="material-symbols-outlined navbar-m-icon">
            library_music
          </span>
          <span className="label-xs font-bold navbar-m-label">Mercado</span>
        </NavLink>
        {user && (
          <NavLink to="/mis-artistas" className={navLinkClass} title="Contratados">
            <span className="material-symbols-outlined navbar-m-icon">sell</span>
            <span className="label-xs font-bold navbar-m-label">Contratados</span>
          </NavLink>
        )}
        {user && (
          <NavLink to="/mis-reviews" className={navLinkClass} title="Mis Reviews">
            <span className="material-symbols-outlined navbar-m-icon">rate_review</span>
            <span className="label-xs font-bold navbar-m-label">Reviews</span>
          </NavLink>
        )}
      </nav>
    </>
  );
}
