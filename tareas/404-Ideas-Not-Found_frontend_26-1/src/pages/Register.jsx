import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'nombre' && !/^[a-zA-Z0-9_]*$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.nombre);
      window.dispatchEvent(new Event('storage'));
      navigate('/catalog');
    } catch (err) {
      const msg = err.response?.data?.error || 'Error al registrarse';
      setError(msg);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Crear cuenta</h2>
        <p className="register-subtitle">Únete y accede a tu historial de órdenes y más.</p>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre de usuario"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="alert-error">{error}</div>}

          <button type="submit" className="btn-submit">Registrarse</button>
        </form>

        <div className="register-footer">
          <span>¿Ya tienes cuenta? <Link to="/login" className="register-link">Inicia sesión</Link></span>
        </div>
      </div>
    </div>
  );
}
