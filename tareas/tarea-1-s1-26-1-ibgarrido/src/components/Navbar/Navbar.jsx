import { Link } from "react-router-dom";
import "./Navbar.css";

// https://blog.logrocket.com/creating-navbar-react/
// https://stackoverflow.com/questions/57232965/what-is-the-correct-way-to-change-navbar-values-in-react-based-on-if-user-is-log
export default function Navbar({ userProfile, onLogout }) {

  if (!userProfile) {
    return (
      <header className="market__navbar">
        <div className="market__brand">
          <span className="market__brandMark">LP</span>
          <div>
            <p className="market__brandKicker">Festival Market</p>
            <h2 className="market__brandName">DCC Palooza</h2>
          </div>
        </div>

        <nav className="market__navLinks" aria-label="Navegacion principal">
        </nav>
        <div className="market__userArea">
          <Link to="/login" className="market__loginButton">
            Login / Register
          </Link>
        </div>
      </header>
    )
  }
  return (
    <header className="market__navbar">
      <div className="market__brand">
        <span className="market__brandMark">LP</span>
        <div>
          <p className="market__brandKicker">Festival Market</p>
          <h2 className="market__brandName">DCC Palooza</h2>
        </div>
      </div>

      <nav className="market__navLinks" aria-label="Navegacion principal">
        <Link to="/mercado" className="market__navLink">
          Marketplace
        </Link>
        <Link to="/mis-artistas" className="market__navLink">
          Contratados
        </Link>
      </nav>
      
      <div className="market__userArea">
        <span className="market__currencyBadge">
          {userProfile?.balance?.toLocaleString("es-CL")} DCCoins
        </span>
        <span className="market__userLabel">Hola, {userProfile?.username}</span>
        <button type="button" className="market__logoutButton" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
