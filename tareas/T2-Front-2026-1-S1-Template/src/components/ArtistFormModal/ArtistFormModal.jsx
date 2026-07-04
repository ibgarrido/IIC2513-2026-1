import { useState } from "react";
import {
  buildArtistBody,
  validateArtistPayload,
} from "../../utils/artistValidation";
import "./ArtistFormModal.css";

const empty = {
  name: "",
  hypeLevel: "",
  genres: "",
  price: "",
  image_url: "",
};

function valuesFromInitial(initialValues) {
  if (!initialValues) return { ...empty };
  return {
    name: initialValues.name ?? "",
    hypeLevel:
      initialValues.hypeLevel !== undefined && initialValues.hypeLevel !== null
        ? String(initialValues.hypeLevel)
        : "",
    genres: initialValues.genres ?? "",
    price:
      initialValues.price !== undefined && initialValues.price !== null
        ? String(initialValues.price)
        : "",
    image_url: initialValues.image_url ?? "",
  };
}

export default function ArtistFormModal({
  initialValues = null,
  onSubmit,
  submitLabel = "Guardar",
  loading = false,
  formId = "artist-form",
}) {
  const [values, setValues] = useState(() => valuesFromInitial(initialValues));
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((er) => {
        const next = { ...er };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validateArtistPayload(values);
    setErrors(v);
    if (Object.keys(v).length) return;
    onSubmit(buildArtistBody(values));
  };

  return (
    <form id={formId} className="artist-form" onSubmit={handleSubmit} noValidate>
      <div className="artist-form-field">
        <label className="artist-form-label" htmlFor={`${formId}-name`}>
          Nombre
        </label>
        <input
          id={`${formId}-name`}
          className="artist-form-input"
          value={values.name}
          onChange={handleChange("name")}
          maxLength={120}
          autoComplete="off"
        />
        {errors.name ? <span className="artist-form-error">{errors.name}</span> : null}
      </div>

      <div className="artist-form-row">
        <div className="artist-form-field">
          <label className="artist-form-label" htmlFor={`${formId}-hype`}>
            Hype (1–100)
          </label>
          <input
            id={`${formId}-hype`}
            type="number"
            min={1}
            max={100}
            step={1}
            className="artist-form-input"
            value={values.hypeLevel}
            onChange={handleChange("hypeLevel")}
          />
          {errors.hypeLevel ? (
            <span className="artist-form-error">{errors.hypeLevel}</span>
          ) : null}
        </div>
        <div className="artist-form-field">
          <label className="artist-form-label" htmlFor={`${formId}-price`}>
            Precio (50–2000 LC)
          </label>
          <input
            id={`${formId}-price`}
            type="number"
            min={50}
            max={2000}
            step={1}
            className="artist-form-input"
            value={values.price}
            onChange={handleChange("price")}
          />
          {errors.price ? (
            <span className="artist-form-error">{errors.price}</span>
          ) : null}
        </div>
      </div>

      <div className="artist-form-field">
        <label className="artist-form-label" htmlFor={`${formId}-genres`}>
          Géneros
        </label>
        <input
          id={`${formId}-genres`}
          className="artist-form-input"
          value={values.genres}
          onChange={handleChange("genres")}
          maxLength={200}
          placeholder="Ej. Synthwave, Indie Pop"
        />
        {errors.genres ? (
          <span className="artist-form-error">{errors.genres}</span>
        ) : null}
      </div>

      <div className="artist-form-field">
        <label className="artist-form-label" htmlFor={`${formId}-url`}>
          URL de imagen
        </label>
        <input
          id={`${formId}-url`}
          type="url"
          className="artist-form-input"
          value={values.image_url}
          onChange={handleChange("image_url")}
          placeholder="https://"
          autoComplete="off"
        />
        {errors.image_url ? (
          <span className="artist-form-error">{errors.image_url}</span>
        ) : null}
      </div>

      <button type="submit" className="artist-form-submit" disabled={loading}>
        {loading ? "Enviando…" : submitLabel}
      </button>
    </form>
  );
}
