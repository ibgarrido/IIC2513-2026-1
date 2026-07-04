import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const mainPath = isLoggedIn ? '/catalog' : '/';

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUsername = localStorage.getItem('username');
      if (token) {
        setIsLoggedIn(true);
        setUsername(storedUsername || '');
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          setIsAdmin(payload.rol === 'admin');
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsLoggedIn(false);
        setUsername('');
        setIsAdmin(false);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setIsAdmin(false);
    setIsOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsOpen(false); 

  return (
    <nav className="navbar">
      {/* Agregamos closeMenu al logo por si el usuario lo toca estando el menú abierto */}
      <Link to={mainPath} className="navbar-logo" style={{ textDecoration: 'none' }} onClick={closeMenu}>
        Ideas<span>Not</span>Found
      </Link>

      {/* 3. El botón Hamburguesa (Solo se ve en móviles según el CSS) */}
      <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      {/* 4. Le inyectamos la clase dinámica 'active' al contenedor de enlaces */}
      <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
        {isLoggedIn ? (
          <>
            <NavLink 
              to="/" 
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} 
              end 
              onClick={closeMenu}
            >
              Inicio
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Sobre nosotros
            </NavLink>
            <NavLink
              to="/catalog"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Catálogo
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Carrito
            </NavLink>
            <NavLink
              to="/orders"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Pedidos
            </NavLink>
            <NavLink
              to="/docs"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Instrucciones
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => `navbar-username ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {username}
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Admin
              </NavLink>
            )}
            <button className="navbar-btn navbar-btn-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              end
              onClick={closeMenu}
            >
              Inicio
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Sobre nosotros
            </NavLink>
            <NavLink
              to="/docs"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Instrucciones
            </NavLink>
            <NavLink
              to="/login"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Iniciar sesión
            </NavLink>
            <Link to="/register" className="navbar-btn" onClick={closeMenu}>
              Crear cuenta
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}