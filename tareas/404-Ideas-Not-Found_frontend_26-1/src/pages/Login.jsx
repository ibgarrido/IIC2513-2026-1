import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.nombre);
      window.dispatchEvent(new Event('storage'));
      navigate('/catalog');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al iniciar sesión';
      setError(msg);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Iniciar sesión</h1>
        <p className="login-subtitle">Ingresa tus credenciales para continuar.</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="login-button">
            Continuar
          </button>
        </form>

        <div className="login-footer">
          <span>¿No tienes cuenta? <a href="/register">Regístrate</a></span>
        </div>
      </div>
    </div>
  );
}
