import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Profile() {
    const [userData, setUserData] = useState({
        nombre: '',
        email: '',
        calle: '',
        numero: '',
        ciudad: '',
        comuna: '',
        region: '',
        codigoPostal: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${API_URL}/user/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const user = response.data.data;
                const dir = user.userDirection || {};

                setUserData({
                    nombre: user.username || user.nombre || '', 
                    email: user.email || '',
                    calle: dir.calle || '',
                    numero: dir.numero || '',
                    ciudad: dir.ciudad || '',
                    comuna: dir.comuna || '',
                    region: dir.region || '',
                    codigoPostal: dir.codigoPostal || ''
                });
            } catch (err) {
                console.error("Error al cargar el perfil:", err);
                setError('No se pudo cargar la información del perfil.');
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const textPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
        if (name === 'numero' && (!/^\d*$/.test(value) || value.length >= 10)) return;
        if (name === 'codigoPostal' && (!/^\d*$/.test(value) || value.length > 7)) return;
        if (['calle', 'ciudad', 'comuna', 'region'].includes(name) && !textPattern.test(value)) return;
        setUserData({ ...userData, [name]: value });
        setError('');
        setSuccessMessage('');
    };

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const alphanumericRegex = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúÑñ]+$/;
        const numericRegex = /^\d+$/;
        const lettersRegex = /^[a-zA-Z\sÁÉÍÓÚáéíóúÑñ]+$/;
        const postalCodeRegex = /^\d{7}$/;

        if (userData.email && !emailRegex.test(userData.email)) {
            return "El correo debe tener un formato válido (ej: algo@dominio.com).";
        }
        if (userData.calle && !alphanumericRegex.test(userData.calle)) {
            return "La calle solo puede contener letras y números.";
        }
        if (userData.numero && !numericRegex.test(userData.numero)) {
            return "El número de dirección debe contener solo números.";
        }
        if (userData.comuna && !lettersRegex.test(userData.comuna)) {
            return "La comuna solo puede contener letras.";
        }
        if (userData.ciudad && !lettersRegex.test(userData.ciudad)) {
            return "La ciudad solo puede contener letras.";
        }
        if (userData.region && !lettersRegex.test(userData.region)) {
            return "La región solo puede contener letras.";
        }
        if (userData.codigoPostal && !postalCodeRegex.test(userData.codigoPostal)) {
            return "El código postal debe tener exactamente 7 números.";
        }

        return null; 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            
            await axios.patch(`${API_URL}/user/me/data`, 
                { 
                    email: userData.email,
                    calle: userData.calle,
                    numero: userData.numero,
                    ciudad: userData.ciudad,
                    comuna: userData.comuna,
                    region: userData.region,
                    codigoPostal: userData.codigoPostal
                }, 
                config
            );

            setSuccessMessage('¡Perfil actualizado con éxito!');
        } catch (err) {
            console.error("Error al actualizar:", err);
            setError(err.response?.data?.error || 'Hubo un error al actualizar tu perfil.');
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2 className="profile-title">Mi Perfil</h2>
                <p className="profile-subtitle">Actualiza tu información personal.</p>

                <form onSubmit={handleSubmit} className="profile-form">
                    <h3 className="profile-section-title">Información Personal</h3>
                    
                    <div className="form-group">
                        <label className="profile-name">Nombre</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre completo"
                            value={userData.nombre}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label className="profile-name">Correo Electrónico</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Correo electrónico"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <h3 className="profile-section-title" style={{ marginTop: '20px' }}>Dirección de Envío</h3>
                    
                    <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 2 }}>
                            <label className="profile-name">Calle</label>
                            <input
                                type="text"
                                name="calle"
                                placeholder="Ej: Av. Pajaritos"
                                value={userData.calle}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="profile-name">Número</label>
                            <input
                                type="text"
                                name="numero"
                                placeholder="Ej: 742"
                                value={userData.numero}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="profile-name">Comuna</label>
                            <input
                                type="text"
                                name="comuna"
                                placeholder="Comuna"
                                value={userData.comuna}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="profile-name">Ciudad</label>
                            <input
                                type="text"
                                name="ciudad"
                                placeholder="Ciudad"
                                value={userData.ciudad}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <label className="profile-name">Región</label>
                            <input
                                type="text"
                                name="region"
                                placeholder="Región"
                                value={userData.region}
                                onChange={handleChange}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label className="profile-name">Código Postal</label>
                            <input
                                type="text"
                                name="codigoPostal"
                                placeholder="Ej: 9250000"
                                value={userData.codigoPostal}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    
                    {error && <p className="error-message" style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
                    {successMessage && <p className="success-message" style={{ color: 'green', marginTop: '15px' }}>{successMessage}</p>}
                    
                    <button type="submit" className="profile-button" style={{ marginTop: '20px' }}>Actualizar Perfil</button>
                </form>
            </div>
        </div>
    );
}