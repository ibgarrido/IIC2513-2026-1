import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import Navbar from "../../components/Navbar/Navbar";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //const [error, setError] = useState(""); (NO lo usamos ya que si la cuenta no existe se crea)
  const navigate = useNavigate();


  // Source: https://dev.to/collegewap/react-axios-post-request-example-1dl3?url=https://dev.to/collegewap/react-axios-post-request-example-1dl3
  // Source: https://youtu.be/2QgpLKJl0pg?t=507
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://t1-back-2026-s1.onrender.com/api/login', {
        username: username,
        password: password
      });

      //console.log("Response completa:", response.data);// Debug

      // Guardar el token y username en localStorage (Para el GET  /me y para mantener sesión)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.user.username);


      navigate('/mercado');
    } catch (error) {
      //console.error('Error during login:', error); // Debug
      alert('Error al iniciar sesión. Por favor, verifica tus credenciales e intenta nuevamente.');
    }
  };

  return (

    <div className="login">
      <Navbar userProfile={null} />
      <div className="login__aurora" aria-hidden="true" />
      <div className="login__hero">
        <h1>DCCPalooza</h1>
        <div className='login__noaccount'>si aun no tienes cuenta, se consumiran 5000 DCC coins para crear una</div>
        <p>Ingresa tu nombre de usuario y llave de acceso para descubrir tu lineup ideal.</p>
      <form onSubmit={handleLogin} className="login__form">
        <input
          className="login__input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nombre de usuario"
        />
        <input
          className="login__input"
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Llave de acceso"
        />
        <div className="login__buttonContainer">
          <button className='login_button' type="submit">Entrar al VIP</button>
          <Link to="/" className="login__backButton">Volver al inicio</Link>
        </div>
      </form>
        <p>Tu llave de ingreso será guardada la primera vez que ingreses</p>
      </div>
    </div>
  );
}