import { useState } from "react";
import "./ArtistFormModal.css";

export default function ArtistFormModal({
  initialValues = null,
  isOpen,
  onClose,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <ArtistFormModalContent
      initialValues={initialValues}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}

function ArtistFormModalContent({ initialValues, onClose, onSubmit }) {
  const [formData, setFormData] = useState(() => ({
    name: initialValues?.name || "",
    hype_level: initialValues?.hype_level || 1,
    genres: initialValues?.genres || "",
    price: initialValues?.price || "",
    image_url: initialValues?.image_url || "",
  }));
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const nextErrors = {};

    if (!String(formData.name).trim()) nextErrors.name = "El nombre es obligatorio.";
    if (!String(formData.hype_level).trim()) nextErrors.hype_level = "El hype level es obligatorio.";
    if (!String(formData.genres).trim()) nextErrors.genres = "Los géneros son obligatorios.";
    if (!String(formData.price).trim()) nextErrors.price = "El precio es obligatorio.";
    if (!String(formData.image_url).trim()) nextErrors.image_url = "La URL de imagen es obligatoria.";

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      ...formData,
      name: String(formData.name).trim(),
      genres: String(formData.genres).trim(),
      price: String(formData.price).trim(),
      image_url: String(formData.image_url).trim(),
    });
  };

  return (
    <div className="artistFormModal__overlay" onClick={onClose}>
      <form className="artistFormModal__content" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="artistFormModal__close" onClick={onClose}>X</button>
        <h2>{initialValues ? "Editar artista" : "Crear artista"}</h2>

        <label>
          Nombre
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
          />
          {fieldErrors.name ? <span className="artistFormModal__error">{fieldErrors.name}</span> : null}
        </label>

        <label>
          Hype level
          <input
            type="number"
            min="1"
            max="100"
            value={formData.hype_level}
            onChange={(e) => updateField("hype_level", e.target.value)}
            required
          />
          {fieldErrors.hype_level ? <span className="artistFormModal__error">{fieldErrors.hype_level}</span> : null}
        </label>

        <label>
          Géneros
          <input
            type="text"
            value={formData.genres}
            onChange={(e) => updateField("genres", e.target.value)}
            placeholder="rock, pop"
            required
          />
          {fieldErrors.genres ? <span className="artistFormModal__error">{fieldErrors.genres}</span> : null}
        </label>

        <label>
          Precio
          <input
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => updateField("price", e.target.value)}
            required
          />
          {fieldErrors.price ? <span className="artistFormModal__error">{fieldErrors.price}</span> : null}
        </label>

        <label>
          URL de imagen
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => updateField("image_url", e.target.value)}
            required
          />
          {fieldErrors.image_url ? <span className="artistFormModal__error">{fieldErrors.image_url}</span> : null}
        </label>

        <button type="submit" className="artistFormModal__submit">
          {initialValues ? "Guardar cambios" : "Crear artista"}
        </button>
      </form>
    </div>
  );
}
