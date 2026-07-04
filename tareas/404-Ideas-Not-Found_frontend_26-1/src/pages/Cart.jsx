import { useState, useEffect } from 'react';
import './Cart.css';

const API_URL = import.meta.env.VITE_API_URL;

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [userDirection, setUserDirection] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    calle: '',
    numero: '',
    ciudad: '',
    comuna: '',
    region: '',
    codigoPostal: '',
  });
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  });

  useEffect(() => {
    // Carga el carrito y la dirección del usuario al mismo tiempo
    const fetchAll = async () => {
      try {
        const [cartRes, userRes] = await Promise.all([
          fetch(`${API_URL}/cart`, { headers: authHeaders() }),
          fetch(`${API_URL}/user/me`, { headers: authHeaders() }),
        ]);

        if (!cartRes.ok) throw new Error('No se pudo cargar el carrito.');
        const cartJson = await cartRes.json();
        setCartItems(cartJson.data.cartItems ?? []);

        if (userRes.ok) {
          const userJson = await userRes.json();
          setUserDirection(userJson.data?.userDirection ?? null);
        }
      } catch (err) {
        setError(err.message || 'Error al cargar el carrito.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleUpdateQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return;
    try {
      const res = await fetch(`${API_URL}/cart/${cartItemId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error('No se pudo actualizar la cantidad.');
      setCartItems((prev) =>
        prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
      );
    } catch (err) {
      setError(err.message || 'Error al actualizar la cantidad.');
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const res = await fetch(`${API_URL}/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('No se pudo eliminar el producto.');
      setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
    } catch (err) {
      setError(err.message || 'Error al eliminar el producto.');
    }
  };

  const handleCheckoutClick = () => {
    setError('');
    if (!userDirection) {
      setShowAddressForm(true);
    } else {
      placeOrder();
    }
  };

  const placeOrder = async () => {
    setCheckoutLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: authHeaders(),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'No se pudo crear la orden.');
      }
      setCartItems([]);
      setShowAddressForm(false);
      setOrderSuccess(true);
    } catch (err) {
      setError(err.message || 'Error al crear la orden.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setCheckoutLoading(true);
    setError('');
    try {
      const patchRes = await fetch(`${API_URL}/user/me/data`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(addressForm),
      });
      if (!patchRes.ok) {
        const body = await patchRes.json().catch(() => ({}));
        throw new Error(body.message || 'No se pudo guardar la dirección.');
      }
      setUserDirection(addressForm);
      await placeOrder();
    } catch (err) {
      setError(err.message || 'Error al guardar la dirección.');
      setCheckoutLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    const textPattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (name === 'numero' && (!/^\d*$/.test(value) || value.length > 10)) return;
    if (name === 'codigoPostal' && (!/^\d*$/.test(value) || value.length > 7)) return;
    if (['calle', 'ciudad', 'comuna', 'region'].includes(name) && !textPattern.test(value)) return;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const itemPrice = (item) =>
    (Number(item.variante.product.precioBase) + Number(item.variante.extraPrice)) * item.quantity;

  const total = cartItems.reduce((acc, item) => acc + itemPrice(item), 0);

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">Mi Carrito</h1>

        {error && (
          <div className="cart-error" role="alert">
            {error}
            <button className="cart-error-close" onClick={() => setError('')}>×</button>
          </div>
        )}

        {orderSuccess && (
          <div className="cart-success" role="status">
            ¡Tu orden fue creada con éxito! Pronto recibirás más información.
          </div>
        )}

        {loading ? (
          <div className="cart-loading">
            <span className="cart-spinner" />
            Cargando carrito…
          </div>
        ) : cartItems.length === 0 ? (
          <div className="cart-empty">
            <p className="cart-empty-icon">🛒</p>
            <p className="cart-empty-text">Tu carrito está vacío.</p>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {cartItems.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <span className="cart-item-badge">Talla: {item.variante?.talla ?? '—'}</span>
                    <span className="cart-item-badge">Color: {item.variante?.color ?? '—'}</span>
                  </div>

                  <div className="cart-item-controls">
                    <button
                      className="cart-qty-btn"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="cart-qty">{item.quantity}</span>
                    <button
                      className="cart-qty-btn"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <span className="cart-item-price">
                    {itemPrice(item).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
                  </span>

                  <button
                    className="cart-remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>

            <div className="cart-footer">
              <span className="cart-total-label">Total</span>
              <span className="cart-total-value">${total.toLocaleString('es-CL')}</span>
            </div>

            {!showAddressForm && (
              <button
                className="cart-checkout-btn"
                onClick={handleCheckoutClick}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <><span className="cart-spinner cart-spinner--sm" /> Procesando…</>
                ) : (
                  'Finalizar compra'
                )}
              </button>
            )}

            {showAddressForm && (
              <div className="cart-address-panel">
                <h2 className="cart-address-title">Dirección de envío</h2>
                <p className="cart-address-subtitle">
                  No tenemos tu dirección registrada. Ingresala para continuar.
                </p>
                <form className="cart-address-form" onSubmit={handleAddressSubmit} noValidate>
                  <div className="cart-address-row">
                    <div className="cart-field">
                      <label className="cart-field-label" htmlFor="calle">Calle</label>
                      <input
                        id="calle"
                        name="calle"
                        className="cart-field-input"
                        value={addressForm.calle}
                        onChange={handleAddressChange}
                        required
                        placeholder="Ej: Av. Libertador"
                      />
                    </div>
                    <div className="cart-field cart-field--sm">
                      <label className="cart-field-label" htmlFor="numero">Número</label>
                      <input
                        id="numero"
                        name="numero"
                        className="cart-field-input"
                        value={addressForm.numero}
                        onChange={handleAddressChange}
                        required
                        placeholder="1234"
                      />
                    </div>
                  </div>

                  <div className="cart-address-row">
                    <div className="cart-field">
                      <label className="cart-field-label" htmlFor="ciudad">Ciudad</label>
                      <input
                        id="ciudad"
                        name="ciudad"
                        className="cart-field-input"
                        value={addressForm.ciudad}
                        onChange={handleAddressChange}
                        required
                        placeholder="Ej: Santiago"
                      />
                    </div>
                    <div className="cart-field">
                      <label className="cart-field-label" htmlFor="comuna">Comuna</label>
                      <input
                        id="comuna"
                        name="comuna"
                        className="cart-field-input"
                        value={addressForm.comuna}
                        onChange={handleAddressChange}
                        required
                        placeholder="Ej: Providencia"
                      />
                    </div>
                  </div>

                  <div className="cart-address-row">
                    <div className="cart-field">
                      <label className="cart-field-label" htmlFor="region">Región</label>
                      <input
                        id="region"
                        name="region"
                        className="cart-field-input"
                        value={addressForm.region}
                        onChange={handleAddressChange}
                        required
                        placeholder="Ej: Metropolitana"
                      />
                    </div>
                    <div className="cart-field cart-field--sm">
                      <label className="cart-field-label" htmlFor="codigoPostal">Código postal</label>
                      <input
                        id="codigoPostal"
                        name="codigoPostal"
                        className="cart-field-input"
                        value={addressForm.codigoPostal}
                        onChange={handleAddressChange}
                        placeholder="Ej: 7500000"
                      />
                    </div>
                  </div>

                  <div className="cart-address-actions">
                    <button
                      type="button"
                      className="cart-address-cancel"
                      onClick={() => { setShowAddressForm(false); setError(''); }}
                      disabled={checkoutLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="cart-checkout-btn"
                      disabled={checkoutLoading}
                    >
                      {checkoutLoading ? (
                        <><span className="cart-spinner cart-spinner--sm" /> Procesando…</>
                      ) : (
                        'Confirmar y finalizar compra'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}