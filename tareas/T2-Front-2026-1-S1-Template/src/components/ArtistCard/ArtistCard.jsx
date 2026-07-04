import { useState } from "react";
import "./ArtistCard.css";
import ArtistCardModal from "../ArtistCardModal/ArtistCardModal";

export default function ArtistCard({
  artist,
  variant = "marketplace",
  managedMode = "full",
  currentUserId,
  busyId,
  onBuy,
  onSell,
  onEdit,
  onDelete,
}) {
  const [showModal, setShowModal] = useState(false);



  return (
    <div className="artist-card-outer">
      <div className="artist-card-img-wrap">
        <img src={artist.img} alt="" className="artist-img" />
        <div className="card-overlay"></div>
        <div className="artist-info-overlap">
          <span className="label-xs accent-primary-text font-bold tracking-spaced">
            {artist.genre || "Sin género"}
          </span>
          <h3 className="font-headline artist-name">{artist.name}</h3>
        </div>
      </div>
      <div className="artist-card-footer">

        <div className="artist-card-actions">
          <div className="price-tag">
            <span className="label-xs accent-muted">Precio</span>
            <span className="font-headline artist-price">
              {artist.price.toLocaleString()}{" "}
              <span className="artist-price-unit">LC</span>
            </span>
          </div>
          <button
            type="button"
            className="book-btn view-artist-btn"
            onClick={() => setShowModal(true)}
          >
            Ver Artista
          </button>
        </div>
      </div>

      <ArtistCardModal
        open={showModal}
        onClose={() => setShowModal(false)}
        artist={artist}
        variant={variant}
        managedMode={managedMode}
        currentUserId={currentUserId}
        busyId={busyId}
        onBuy={onBuy}
        onSell={onSell}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
}
