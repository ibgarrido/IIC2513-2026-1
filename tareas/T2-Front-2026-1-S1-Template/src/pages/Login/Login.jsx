import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginRequest, register as registerRequest } from "../../api/auth";
import { normalizeUser } from "../../utils/userFromApi";
import "./Login.css";

function authErrorMessage(error) {
  const data = error?.response?.data;
  if (!data) return "No fue posible conectar. Revisa tu red o la URL de la API.";
  if (Array.isArray(data.details) && data.details.length) {
    return data.details.join(" ");
  }
  if (typeof data.error === "string") return data.error;
  return "No fue posible completar la solicitud.";
}

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/mercado", { replace: true });
    }
  }, [navigate]);

  const executeLogin = async (username, password) => {
    const response = await loginRequest(username, password);
    localStorage.setItem("token", response.token);
    if (response.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(normalizeUser(response.user))
      );
    }
  }


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const username = event.target.username.value.trim();
    const password = event.target.password.value;

    try {
      await executeLogin(username, password)
      navigate("/mercado");
    } catch (err) {
      // Si tira error de login, intentar registrar
      try {
        const reg = await registerRequest(username, password);
        if (reg.status == 409) {
          throw new Error("El usuario ya existe. Verifica tu contraseña.");
        }
        if (!reg?.user?.id) {
          throw new Error(reg?.error || "No se pudo registrar al usuario.");
        }


        await executeLogin(username, password);
        navigate("/mercado");
      }
      catch (e2) {

        setError(e2.message || "Error al iniciar sesión. Intenta nuevamente.");
      }
    }

  };

  return (
    <div className="login-container">
      <div className="background-decor">
        <div className="glow-primary"></div>
        <div className="glow-accent"></div>
        <div className="grainy-bg"></div>
      </div>

      <main className="login-canvas">
        <div className="login-wrapper">
          <header className="login-header">
            <Link to="/" className="login-back-link font-meta label-sm">
              ← Volver al inicio
            </Link>
            <div className="brand-group">
              <span className="font-meta accent-secondary">Access Portal</span>
              <h1 className="font-brutalist-header hero-title">
                DCC<span className="accent-primary-text">Palooza</span>
              </h1>
            </div>
          </header>

          <div className="login-card-outer">
            <div className="login-card-inner">
              <div className="card-subtle-glow"></div>

              <div className="card-header">
                <div className="card-header-main">
                  <h2 className="font-headline font-bold card-header-title">
                    ACCEDER AL ÁREA
                  </h2>
                  <p className="auth-screen-welcome-bonus">
                    <span
                      className="auth-screen-welcome-bonus__icon material-symbols-outlined"
                      aria-hidden
                    >
                      redeem
                    </span>
                    <span className="auth-screen-welcome-bonus__text">
                      Si aún no tienes cuenta, se creará una con 5.000 DCC Coins.
                    </span>
                  </p>
                </div>
              </div>

              {error ? (
                <p className="login-error" role="alert">
                  {error}
                </p>
              ) : null}

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label className="font-meta label-sm">Nombre de usuario</label>
                  <div className="input-field-wrapper">
                    <input
                      name="username"
                      type="text"
                      autoComplete="username"
                      placeholder="DCC_FAN_27"
                      className="login-input"
                      required
                    />
                    <div className="input-focus-line line-primary"></div>
                  </div>
                </div>

                <div className="input-group">
                  <label className="font-meta label-sm label-tertiary">
                    Llave de acceso
                  </label>
                  <div className="input-field-wrapper">
                    <input
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className="login-input"
                      required
                    />
                    <div className="input-focus-line line-accent"></div>
                  </div>
                </div>

                <button type="submit" className="login-submit-btn">
                  <span className="btn-text">Entrar al VIP</span>
                  <span className="material-symbols-outlined">bolt</span>
                </button>
              </form>

              <p className="auth-screen-info font-meta label-sm">
                * Tu llave de acceso será guardada la primera vez que ingreses.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
