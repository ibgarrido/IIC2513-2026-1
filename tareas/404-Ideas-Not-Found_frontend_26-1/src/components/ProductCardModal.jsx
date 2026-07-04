import { useState } from 'react';
import './ProductCardModal.css';

export default function ProductCardModal({ producto, onClose }) {
  const tieneVariantes = producto.variantes?.length > 0;

  const [selectedTalla, setSelectedTalla] = useState(
    tieneVariantes ? producto.variantes[0].talla : null
  );
  const [selectedVariante, setSelectedVariante] = useState(
    tieneVariantes ? producto.variantes[0] : null
  );
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const tallasUnicas = tieneVariantes
    ? [...new Set(producto.variantes.map((v) => v.talla))]
    : [];

  const coloresPorTalla = tieneVariantes
    ? producto.variantes.filter((v) => v.talla === selectedTalla)
    : [];

  function handleTallaClick(talla) {
    setSelectedTalla(talla);
    const primera = producto.variantes.find((v) => v.talla === talla);
    setSelectedVariante(primera);
    setFeedback(null);
  }

  function handleColorClick(variante) {
    setSelectedVariante(variante);
    setFeedback(null);
  }

  const precioFinal =
    Number(producto.precioBase) + Number(selectedVariante?.precio_extra ?? 0);

  const precioFormateado = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(precioFinal);

  async function handleComprar() {
    setLoading(true);
    setFeedback(null);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ varianteId: selectedVariante?.id ?? null, quantity: 1 }),
      });
      if (!res.ok) throw new Error('Error al agregar al carrito');
      setFeedback({ type: 'success', msg: 'Producto agregado al carrito' });
    } catch (err) {
      setFeedback({ type: 'error', msg: err.message || 'Error inesperado' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div
          className="modal-card-img"
          style={
            producto.image_url
              ? { backgroundImage: `url(${producto.image_url})` }
              : { background: 'linear-gradient(135deg, #B1C4BE, #8FA89E)' }
          }
        />

        <div className="modal-card-body">
          <span className="modal-category">
            {producto.categoria?.nombre ?? 'Sin categoría'}
          </span>
          <h3 className="modal-name">{producto.nombre}</h3>
          <p className="modal-description">{producto.descripcion}</p>
          <p className="modal-price">{precioFormateado}</p>

          {tieneVariantes && (
            <>
              <div className="modal-variant-group">
                <span className="modal-variant-label">Talla</span>
                <div className="modal-variant-buttons">
                  {tallasUnicas.map((talla) => (
                    <button
                      key={talla}
                      className={`modal-variant-btn${selectedTalla === talla ? ' selected' : ''}`}
                      onClick={() => handleTallaClick(talla)}
                    >
                      {talla}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-variant-group">
                <span className="modal-variant-label">Color</span>
                <div className="modal-variant-buttons">
                  {coloresPorTalla.map((v) => (
                    <button
                      key={v.id}
                      className={`modal-variant-btn${selectedVariante?.id === v.id ? ' selected' : ''}`}
                      onClick={() => handleColorClick(v)}
                    >
                      {v.color}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {feedback && (
            <p className={`modal-feedback modal-feedback--${feedback.type}`}>
              {feedback.msg}
            </p>
          )}

          <button
            className="modal-btn-primary"
            onClick={handleComprar}
            disabled={loading}
          >
            {loading ? 'Procesando…' : 'Comprar'}
          </button>
        </div>
      </div>
    </div>
  );
}
