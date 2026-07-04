import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Landing.css';
import ProductCard from '../components/ProductCard';
import ProductCardModal from '../components/ProductCardModal';

const API_URL = import.meta.env.VITE_API_URL;

const priceIntervals = [
  { id: '0-20k', label: '$0 - $20.000', min: 0, max: 20000 },
  { id: '20k-40k', label: '$20.000 - $40.000', min: 20000, max: 40000 },
  { id: '40k-60k', label: '$40.000 - $60.000', min: 40000, max: 60000 },
  { id: '60k-80k', label: '$60.000 - $80.000', min: 60000, max: 80000 },
  { id: '80k-100k', label: '$80.000 - $100.000', min: 80000, max: 100000 },
  { id: '100k+', label: 'Más de $100.000', min: 100000, max: null },
];

export default function Catalog() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  
  // Estados para los filtros
  const [tipoFiltroActivo, setTipoFiltroActivo] = useState(null); // 'categoria' | 'precio' | null
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [precioSeleccionado, setPrecioSeleccionado] = useState(null);
  
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // Fetch de categorías
  useEffect(() => {
    axios.get(`${API_URL}/categoria`)
      .then(res => setCategorias(res.data.data || res.data))
      .catch(err => console.error("Error cargando categorías:", err));
  }, []);

  // Fetch del catálogo con los parámetros del request
  useEffect(() => {
    let cancelled = false;

    let queryParams = `?search=${search}&page=${page}&limit=9`;
    
    if (categoriaSeleccionada) {
      queryParams += `&categoriaId=${categoriaSeleccionada}`;
    }
    
    if (precioSeleccionado) {
      if (precioSeleccionado.min !== null) queryParams += `&precioMin=${precioSeleccionado.min}`;
      if (precioSeleccionado.max !== null) queryParams += `&precioMax=${precioSeleccionado.max}`;
    }

    axios
      .get(`${API_URL}/catalog${queryParams}`)
      .then((res) => {
        if (!cancelled) {
          setProductos(res.data.data.filter((p) => p.activo));
          setTotalPages(res.data.pagination.totalPages);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error cargando catálogo:", err);
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [search, page, categoriaSeleccionada, precioSeleccionado]); 

  const handleBuyClick = async (producto) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      try {
        await axios.post(
          `${API_URL}/cart`, 
          { productId: producto.id, quantity: 1 },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        console.log('Añadido al carrito:', producto.nombre);
      } catch (err) {
        console.error('Error al añadir al carrito:', err);
      }
    }
    setSelectedProduct(null);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="catalog-page" style={{ paddingTop: '0px', minHeight: '100vh' }}>
      <section className="catalog-section" id="catalogo">
        <div className="section-header">
          <div style={{ width: '100%', textAlign: 'center' }}>
            <h2 className="section-label">Explorar</h2>
          </div>
        </div>

        {/* --- CONTROLES DE UI: TIPO DE FILTRO --- */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '15px' }}>
          <span style={{ fontWeight: 'bold', alignSelf: 'center', color: '#111' }}>Filtrar por:</span>
          <button 
            onClick={() => setTipoFiltroActivo(tipoFiltroActivo === 'categoria' ? null : 'categoria')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #111',
              backgroundColor: tipoFiltroActivo === 'categoria' ? '#111' : 'transparent',
              color: tipoFiltroActivo === 'categoria' ? '#fff' : '#111',
              cursor: 'pointer'
            }}
          >
            Categoría
          </button>
          <button 
            onClick={() => setTipoFiltroActivo(tipoFiltroActivo === 'precio' ? null : 'precio')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #111',
              backgroundColor: tipoFiltroActivo === 'precio' ? '#111' : 'transparent',
              color: tipoFiltroActivo === 'precio' ? '#fff' : '#111',
              cursor: 'pointer'
            }}
          >
            Precio
          </button>
        </div>

        {/* --- OPCIONES DEL FILTRO SELECCIONADO --- */}
        {tipoFiltroActivo === 'categoria' && (
          <div className="filters-container" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => { setCategoriaSeleccionada(''); setPage(1); }}
              style={{ 
                padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc',
                backgroundColor: categoriaSeleccionada === '' ? '#111' : '#fff',
                color: categoriaSeleccionada === '' ? '#fff' : '#111', cursor: 'pointer'
              }}
            >
              Todas
            </button>
            {categorias.map(cat => (
              <button 
                key={cat.id}
                onClick={() => { setCategoriaSeleccionada(cat.id); setPage(1); }}
                style={{ 
                  padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc',
                  backgroundColor: categoriaSeleccionada === cat.id ? '#111' : '#fff',
                  color: categoriaSeleccionada === cat.id ? '#fff' : '#111', cursor: 'pointer'
                }}
              >
                {cat.nombre}
              </button>
            ))}
          </div>
        )}

        {tipoFiltroActivo === 'precio' && (
          <div className="filters-container" style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => { setPrecioSeleccionado(null); setPage(1); }}
              style={{ 
                padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc',
                backgroundColor: precioSeleccionado === null ? '#111' : '#fff',
                color: precioSeleccionado === null ? '#fff' : '#111', cursor: 'pointer'
              }}
            >
              Todos los precios
            </button>
            {priceIntervals.map(interval => (
              <button 
                key={interval.id}
                onClick={() => { setPrecioSeleccionado(interval); setPage(1); }}
                style={{ 
                  padding: '8px 16px', borderRadius: '20px', border: '1px solid #ccc',
                  backgroundColor: precioSeleccionado?.id === interval.id ? '#111' : '#fff',
                  color: precioSeleccionado?.id === interval.id ? '#fff' : '#111', cursor: 'pointer'
                }}
              >
                {interval.label}
              </button>
            ))}
          </div>
        )}

        {/* --- BUSCADOR --- */}
        <div className="search-bar-wrapper">
          <input
            className="search-bar"
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* --- RENDERIZADO DEL CATÁLOGO --- */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <p className="no-products" style={{ textAlign: 'center', marginTop: '20px' }}>
            No se encontraron productos con estos filtros.
          </p>
        ) : (
          <>
            <div className="products-grid">
              {productos.map((p) => (
                <ProductCard
                  key={p.id || p.nombre}
                  producto={p}
                  onBuy={() => setSelectedProduct(p)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '40px', paddingBottom: '40px' }}>
                <button 
                  onClick={handlePrevPage} 
                  disabled={page === 1}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: page === 1 ? '#ccc' : '#111',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Anterior
                </button>

                <span style={{ fontWeight: 'bold', color: '#333' }}>
                  Página {page} de {totalPages}
                </span>

                <button 
                  onClick={handleNextPage} 
                  disabled={page === totalPages}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: page === totalPages ? '#ccc' : '#111',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {selectedProduct && (
        <ProductCardModal
          producto={selectedProduct}
          onBuy={handleBuyClick}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}