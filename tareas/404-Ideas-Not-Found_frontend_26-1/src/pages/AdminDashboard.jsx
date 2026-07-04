import { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const API_URL = import.meta.env.VITE_API_URL;
const ALL_STATUSES = ['recibido', 'confirmado', 'procesando', 'embalando', 'enviado', 'terminado'];

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios
      .get(`${API_URL}/order`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setOrders(res.data.data || res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error cargando órdenes:', err);
        setError('No se pudieron cargar las órdenes.');
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (orderId, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.patch(
        `${API_URL}/order/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, statuses: [...(o.statuses || []), { status }] }
            : o
        )
      );
    } catch (err) {
      console.error('Error actualizando estado:', err);
    }
  };

  const getCurrentStatus = (statuses) => {
    if (!statuses || statuses.length === 0) return 'recibido';
    return statuses[statuses.length - 1].status;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">Panel de Administración</h1>
      {orders.length === 0 ? (
        <p className="admin-empty">No hay órdenes registradas.</p>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Total</th>
                <th>Estado actual</th>
                <th>Cambiar estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const currentStatus = getCurrentStatus(order.statuses);
                const currentIndex = ALL_STATUSES.indexOf(currentStatus);
                const nextStatuses = ALL_STATUSES.slice(currentIndex + 1);
                const userName =
                  order.user?.nombre ||
                  order.usuario?.nombre ||
                  order.user?.email ||
                  order.usuario?.email ||
                  '—';
                return (
                  <tr key={order.id}>
                    <td className="admin-id">{order.id.toString().substring(0, 8)}</td>
                    <td>{userName}</td>
                    <td>${Number(order.total).toLocaleString('es-CL')}</td>
                    <td>
                      <span className={`status-badge status-${currentStatus}`}>
                        {currentStatus}
                      </span>
                    </td>
                    <td>
                      {nextStatuses.length > 0 ? (
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) handleStatusChange(order.id, e.target.value);
                          }}
                          className="status-select"
                        >
                          <option value="" disabled>Cambiar a...</option>
                          {nextStatuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="status-final">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
