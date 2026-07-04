export function validateArtistPayload(values) {
  const errors = {};

  const name = (values.name ?? "").trim();
  if (!name) errors.name = "El nombre es obligatorio.";
  else if (name.length > 120) errors.name = "Máximo 120 caracteres.";

  const hypeRaw = values.hypeLevel;
  const hype =
    hypeRaw === "" || hypeRaw === undefined ? NaN : Number.parseInt(String(hypeRaw), 10);
  if (!Number.isFinite(hype) || !Number.isInteger(hype) || hype < 1 || hype > 100) {
    errors.hypeLevel = "Hype entre 1 y 100 (entero).";
  }

  const priceRaw = values.price;
  const price =
    priceRaw === "" || priceRaw === undefined ? NaN : Number.parseInt(String(priceRaw), 10);
  if (!Number.isFinite(price) || !Number.isInteger(price) || price < 50 || price > 2000) {
    errors.price = "Precio entre 50 y 2000 LollaCoins (entero).";
  }

  const genres = (values.genres ?? "").trim();
  if (!genres) errors.genres = "Indica géneros o estilos.";
  else if (genres.length > 200) errors.genres = "Máximo 200 caracteres.";

  const url = (values.image_url ?? "").trim();
  if (!url) errors.image_url = "La URL de imagen es obligatoria.";
  else {
    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        errors.image_url = "Usa http o https.";
      }
    } catch {
      errors.image_url = "Debe ser una URL válida (ej. https://…).";
    }
  }

  return errors;
}

export function buildArtistBody(values) {
  return {
    name: values.name.trim(),
    genres: values.genres.trim(),
    hypeLevel: Number.parseInt(String(values.hypeLevel), 10),
    price: Number.parseInt(String(values.price), 10),
    image_url: values.image_url.trim(),
  };
}
