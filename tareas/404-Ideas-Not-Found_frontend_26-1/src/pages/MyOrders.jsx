import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css'; 

const API_URL = import.meta.env.VITE_API_URL;

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get(`${API_URL}/order`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setOrders(response.data.data);
            } catch (err) {
                console.error("Error al cargar pedidos:", err);
                setError('No se pudieron cargar tus pedidos.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const getCurrentStatus = (statuses) => {
        if (!statuses || statuses.length === 0) return 'Desconocido';
        return statuses[statuses.length - 1].status;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', minHeight: '100vh' }}>
                <h2 style={{ color: '#333' }}>Cargando pedidos...</h2>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px', paddingBottom: '50px', minHeight: '100vh', width: '100%' }}>
            
            <div className="profile-card" style={{ maxWidth: '800px', width: '90%', backgroundColor: '#fff', color: '#333', padding: '30px', borderRadius: '8px', margin: '0 auto' }}>
                
                <h2 className="profile-title" style={{ color: '#111', textAlign: 'center', marginBottom: '5px' }}>Mis Pedidos</h2>
                <p className="profile-subtitle" style={{ color: '#444', textAlign: 'center', marginBottom: '30px' }}>Revisa el historial y estado de tus compras.</p>

                {error && <p className="error-message" style={{ color: '#d9534f', textAlign: 'center' }}>{error}</p>}

                {/* --- LÓGICA DE MOSTRAR PEDIDOS --- */}
                {orders.length === 0 && !error ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#555' }}>
                        <p style={{ fontSize: '18px', fontStyle: 'italic' }}>No tienes pedidos actuales.</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map((order) => (
                            <div key={order.id} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginBottom: '15px' }}>
                                
                                {/* CABECERA DEL PEDIDO */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.2rem', color: '#222' }}>Pedido #{order.id}</h3>
                                        <p style={{ margin: '0', color: '#333' }}><strong>Total:</strong> ${order.total}</p>
                                        <p style={{ margin: '5px 0 0 0', color: '#333', textTransform: 'capitalize' }}>
                                            <strong>Estado:</strong> {getCurrentStatus(order.statuses)}
                                        </p>
                                    </div>
                                    <button 
                                        className="profile-button" 
                                        style={{ width: 'auto', padding: '8px 15px', fontSize: '14px', margin: 0, backgroundColor: '#262d35', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        onClick={() => toggleOrderDetails(order.id)}
                                    >
                                        {expandedOrderId === order.id ? 'Ocultar detalles' : 'Mostrar detalles'}
                                    </button>
                                </div>

                                {/* DETALLES DESPLEGABLES */}
                                {expandedOrderId === order.id && (
                                    <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f4f4f4', borderRadius: '5px', border: '1px solid #ddd', color: '#333' }}>
                                        
                                        <h4 style={{ margin: '0 0 10px 0', color: '#111' }}>Dirección de Envío</h4>
                                        {order.direction ? (
                                            <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: '#333' }}>
                                                {order.direction.calle} {order.direction.numero}, {order.direction.comuna}, {order.direction.ciudad} - {order.direction.region}
                                            </p>
                                        ) : (
                                            <p style={{ margin: '0 0 20px 0', fontSize: '0.95rem', color: '#555' }}>Dirección no disponible.</p>
                                        )}

                                        <h4 style={{ margin: '0 0 10px 0', color: '#111' }}>Artículos del Pedido</h4>
                                        {order.orderItems && order.orderItems.length > 0 ? (
                                            <ul style={{ paddingLeft: '0', listStyleType: 'none', margin: '0' }}>
                                                {order.orderItems.map(item => (
                                                    <li key={item.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #ccc' }}>
                                                        <div style={{ fontWeight: 'bold', color: '#222' }}>{item.productName}</div>
                                                        <div style={{ fontSize: '0.9rem', color: '#444' }}>
                                                            Talla: {item.varianteTalla} | Color: {item.varianteColor}
                                                        </div>
                                                        <div style={{ fontSize: '0.9rem', marginTop: '3px', color: '#333' }}>
                                                            Cantidad: {item.cantidad} x ${item.unitPrice}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p style={{ margin: '0', color: '#555' }}>No hay detalles de artículos.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}