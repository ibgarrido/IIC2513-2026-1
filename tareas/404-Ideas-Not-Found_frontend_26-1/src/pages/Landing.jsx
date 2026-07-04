import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Landing.css';

const API_URL = import.meta.env.VITE_API_URL;

const features = [
  {
    icon: '🚚',
    title: 'Envío a todo Chile',
    desc: 'Despachamos desde Santiago a todo el país. Seguimiento en tiempo real de tu pedido.',
  },
  {
    icon: '↩️',
    title: 'Cambios sin drama',
    desc: 'Si la talla no es la correcta, te ayudamos a cambiarla sin costo adicional dentro de 15 días.',
  },
  {
    icon: '🔒',
    title: 'Pago 100% seguro',
    desc: 'Tus datos están protegidos. Aceptamos tarjetas, transferencia y más medios de pago.',
  },
];

const marqueeItems = [
  'Nueva colección 2026', 'Zapatillas urbanas',
  'Envío a todo Chile', 'Elige tu talla y color', 'Stock actualizado',
  'Nueva colección 2026', 'Zapatillas urbanas', 'Ideas Not Found',
  'Envío a todo Chile', 'Elige tu talla y color', 'Stock actualizado',
];

export default function Landing() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    //setLoading(true);
    axios
      .get(`${API_URL}/catalog`)
      .then((res) => {
        if (!cancelled) {
          setProductos(res.data.data.filter((p) => p.activo).slice(0, 3)); // Solo mostramos los primeros 6 productos destacados
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero-left">
          <span className="hero-tag">Temporada 2026</span>
          <h1 className="hero-title">
            Tu estilo,<br />
            <span className="accent">sin límites.</span>
          </h1>
          <p className="hero-subtitle">
            Zapatillas y ropa urbana seleccionada para quienes se mueven con intención.
            Encuentra tu talla, tu color, tu versión.
          </p>
          <div className="hero-actions">
            <Link to="/catalog" className="btn-primary">Ver colección</Link>
            <Link to="/register" className="btn-secondary">Crear cuenta</Link>
          </div>
        </div>

        <div className="hero-right">
          <div
            className="hero-image"
            style={{
              background: 'linear-gradient(135deg, #B1C4BE 0%, #8FA89E 50%, #6B8C80 100%)',
              width: '100%',
              height: '100%',
              display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
          <div className="hero-image-overlay" />
          <div className="hero-badge">
            <span className="badge-number">+200</span>
            <span className="badge-label">productos disponibles</span>
          </div>
        </div>
      </section>

      <div className="marquee-section">
        <div className="marquee-track">
          {marqueeItems.map((item, i) => (
            <span key={i} className="marquee-item">
              {item}
              <span className="marquee-dot" />
            </span>
          ))}
        </div>
      </div>

      <section className="catalog-section" id="catalogo">
        <div className="section-header">
          <div>
            <h2 className="section-title">Explora nuestro catálogo de productos</h2>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <p className="no-products">No se encontraron productos.</p>
        ) : (
          <>
            <div className="products-grid">
              {productos.map((p, i) => (
                <div className="product-card" key={i}>
                  <div
                    className="product-card-img"
                    style={
                      p.image_url
                        ? { backgroundImage: `url(${p.image_url})` }
                        : { background: 'linear-gradient(135deg, #B1C4BE, #8FA89E)' }
                    }
                  />
                  <div className="product-card-body">
                    <span className="product-category">
                      {p.categoria?.nombre ?? 'Sin categoría'}
                    </span>
                    <h3 className="product-name">{p.nombre}</h3>
                    <p className="product-price">
                      ${Number(p.precioBase).toLocaleString('es-CL')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <Link to="/register" className="btn-primary">Ver más</Link>
            </div>
          </>
        )}
      </section>

      <section className="features-section">
        <div className="section-header">
          <div>
            <p className="section-label">Por qué elegirnos</p>
            <h2 className="section-title">Comprar aquí<br />es fácil</h2>
          </div>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-item" key={i}>
              <div className="feature-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.icon}</div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}