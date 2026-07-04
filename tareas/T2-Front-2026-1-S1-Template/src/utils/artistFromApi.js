export function genresToDisplay(genres) {
  if (Array.isArray(genres)) return genres.filter(Boolean).join(", ");
  if (typeof genres === "string") return genres;
  return "";
}

export function artistImageUrl(artist, placeholder) {
  return artist?.imageUrl || artist?.image_url || placeholder;
}

export function artistOwnerId(artist) {
  if (artist == null) return null;
  return artist.ownerId ?? artist.owner?.id ?? null;
}
