import { useState } from 'react';
import './ProductCard.css';

const API_URL = import.meta.env.VITE_API_URL;

const ProductCard = ({ producto, onBuy }) => {
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', msg: string }

  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const varianteId = producto.variantes?.[0]?.id;

  const handleAddToCart = async () => {
    if (!varianteId) {
      setFeedback({ type: 'error', msg: 'Este producto no tiene variantes disponibles.' });
      return;
    }
    setAdding(true);
    setFeedback(null);
    try {
      const res = await fetch(`${API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ varianteId, quantity: 1 }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'No se pudo agregar al carrito.');
      }
      setFeedback({ type: 'success', msg: '¡Agregado al carrito!' });
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Error al agregar al carrito.' });
    } finally {
      setAdding(false);
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div className="product-card">
      <div
        className="product-card-img"
        style={
          producto.image_url
            ? { backgroundImage: `url(${producto.image_url})` }
            : { background: 'linear-gradient(135deg, #B1C4BE, #8FA89E)' }
        }
      />

      <div className="product-card-body">
        <span className="product-category">
          {producto.categoria?.nombre ?? 'Sin categoría'}
        </span>

        <h3 className="product-name">
          {producto.nombre}
        </h3>

        <p className="product-price">
          ${Number(producto.precioBase).toLocaleString('es-CL')}
        </p>

        <button
          className="btn-primary"
          style={{ width: '100%', marginTop: '1rem' }}
          onClick={() => onBuy(producto)}
        >
          Ver detalle
        </button>

        {isLoggedIn && (
          <button
            className="btn-add-cart"
            style={{ width: '100%', marginTop: '0.5rem' }}
            onClick={handleAddToCart}
            disabled={adding}
          >
            {adding ? 'Agregando…' : 'Agregar al carrito'}
          </button>
        )}

        {feedback && (
          <p className={`cart-feedback cart-feedback--${feedback.type}`}>
            {feedback.msg}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
