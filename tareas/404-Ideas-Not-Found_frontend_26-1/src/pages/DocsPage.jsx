import { useState } from 'react';
import './DocsPage.css';

export default function DocsPage() {
  // Estado para el componente dinámico (accordeon)
  const [activeSection, setActiveSection] = useState(null);

  const toggleSection = (index) => {
    // Si la sección ya está activa, la cerramos. Si no, la abrimos.
    setActiveSection(activeSection === index ? null : index);
  };

  const instructions = [
    {
      title: "Explorar categorías",
      content: "Navega por nuestra página de inicio para descubrir las últimas colecciones. Puedes filtrar por zapatillas, poleras o accesorios."
    },
    {
      title: "Crear una cuenta",
      content: "Dirígete a la sección 'Crear cuenta' en el menú principal. Llena tus datos para tener acceso a un historial de órdenes y guardar tus direcciones."
    },
    {
      title: "Proceso de compra",
      content: "Podrás añadir productos a tu carrito, seleccionar tu talla y proceder con un pago seguro mediante nuestra plataforma."
    }
    ,{
      title: "Panel de perfil de usuario",
      content: "Una vez registrado, puedes acceder a tu perfil para actualizar tu información personal, revisar tus órdenes y gestionar tus direcciones de envío."
    },
    {
      title: "Proceso de compra (Próximamente)",
      content: "Muy pronto podrás añadir productos a tu carrito, seleccionar tu talla y proceder con un pago seguro mediante nuestra plataforma."
    }

  ];

  return (
    <div className="docs-container">
      <div className="docs-header">
        <h1 className="docs-title">Cómo funciona</h1>
        <p className="docs-subtitle">
          Bienvenido a la guía de Ideas Not Found. Aprende a navegar por nuestra plataforma.
        </p>
      </div>

      <div className="docs-content">
        {/* Componente Dinámico: Acordeón */}
        <div className="accordion-container">
          {instructions.map((item, index) => (
            <div 
              key={index} 
              className={`accordion-item ${activeSection === index ? 'active' : ''}`}
            >
              <button 
                className="accordion-header" 
                onClick={() => toggleSection(index)}
              >
                {item.title}
                <span className="accordion-icon">
                  {activeSection === index ? '−' : '+'}
                </span>
              </button>
              
              {activeSection === index && (
                <div className="accordion-body">
                  <p>{item.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}