import "./ArtistCardModal.css";



export default function ArtistCardModal({
  artist,
  isOpen,
  isOwnerView = false,
  onClose,
  onBuy,
  onSell,
  onEdit,
  onDelete,
}) {
  // Funcion para limitar el print de los generos.
  const formatGenres = (genres) => {
    if (!genres) return "";

    const genresArray = Array.isArray(genres) 
      ? genres 
      : genres.split(",").map(g => g.trim());

    if (genresArray.length > 2) {
      return `${genresArray.slice(0, 2).join(", ")}...`;
    }

    return genresArray.join(", ");
  };
  if (!isOpen || !artist) return null;

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal__content" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="modal__closeButton" onClick={onClose}>
          X
        </button>
        <img src={artist.image_url} alt={artist.name} className="modal__image" />
        <h2 className="modal__genre" style={{ color: "#ff9440" }}>
          {artist.genre}
        </h2>
        <h1 className="modal__name">{artist.name}</h1>
        <p className="modal__genre">{formatGenres(artist.genres)}</p>
        <p className="modal__price">{artist.price.toLocaleString("es-CL")} DCCoins</p>
        <p className="modal__hype">{artist.hype_level} hype</p>

        {!isOwnerView && (
          <>
            <button type="button" className="modal__actionButton" onClick={() => onBuy?.(artist.id)}>
              Contratar artista
            </button>
            <button type="button" className="modal__actionButton" onClick={onClose}>
              Cancelar
            </button>
          </>
        )}
        {isOwnerView && (
          <>
            <button type="button" className="modal__actionButton" onClick={() => onSell?.(artist.id)}>
              Publicar en el mercado
            </button>
            <button type="button" className="modal__actionButton" onClick={() => onEdit?.(artist.id)}>
              Editar
            </button>
            <button type="button" className="modal__deleteButton" onClick={() => onDelete?.(artist.id)}>
              Eliminar
            </button>
            <button type="button" className="modal__actionButton" onClick={onClose}>
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}
