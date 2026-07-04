import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { artistOwnerId, genresToDisplay } from "../../utils/artistFromApi";
import { fetchArtistById, fetchArtists, addFavorite, removeFavorite } from "../../api/artists";
import { fetchReviewsByArtist, createReview } from "../../api/reviews";
import "./ArtistCardModal.css";

function StarRating({ rating }) {
  return (
    <span className="artist-modal-review-stars" aria-label={`${rating} de 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`material-symbols-outlined fill-icon star-icon ${
            i <= rating ? "star-filled" : "star-empty"
          }`}
        >
          star
        </span>
      ))}
    </span>
  );
}

function StarSelector({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <span className="artist-modal-star-selector">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className={`star-selector-btn material-symbols-outlined fill-icon ${
            i <= (hover || value) ? "star-filled" : "star-empty"
          }`}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
        >
          star
        </button>
      ))}
    </span>
  );
}

export default function ArtistCardModal({
  artist,
  open,
  onClose,
  variant,
  managedMode,
  currentUserId,
  busyId,
  onBuy,
  onSell,
  onEdit,
  onDelete,
}) {
  const [favoriteCount, setFavoriteCount] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsMeta, setReviewsMeta] = useState(null);
  const [loadingExtra, setLoadingExtra] = useState(false);

  // Favorite state
  const [isFavorited, setIsFavorited] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);

  // Expanded reviews panel
  const [showExpandedReviews, setShowExpandedReviews] = useState(false);

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const loadReviews = (artistId) => {
    return fetchReviewsByArtist(artistId, 1, 50).catch(() => null);
  };

  useEffect(() => {
    if (!open || !artist?.id) return;

    let cancelled = false;
    setLoadingExtra(true);
    setFavoriteCount(null);
    setReviews([]);
    setReviewsMeta(null);
    setShowReviewForm(false);
    setShowExpandedReviews(false);
    setReviewRating(0);
    setReviewComment("");
    setReviewError("");
    setIsFavorited(false);

    const isLoggedIn = currentUserId != null;

    Promise.all([
      fetchArtistById(artist.id).catch(() => null),
      loadReviews(artist.id),
      isLoggedIn
        ? fetchArtists(1, 200, false, "", true).catch(() => null)
        : Promise.resolve(null),
    ]).then(([artistData, reviewsData, favData]) => {
      if (cancelled) return;
      if (artistData) {
        setFavoriteCount(artistData.favoriteCount ?? 0);
      }
      if (reviewsData) {
        setReviews(reviewsData.data ?? []);
        setReviewsMeta(reviewsData.meta ?? null);
      }
      if (favData?.data) {
        const favIds = favData.data.map((a) => a.id);
        setIsFavorited(favIds.includes(artist.id));
      }
      setLoadingExtra(false);
    });

    return () => {
      cancelled = true;
    };
  }, [open, artist?.id]);

  const handleSubmitReview = async () => {
    if (reviewRating < 1 || reviewRating > 5) {
      setReviewError("Selecciona un rating entre 1 y 5.");
      return;
    }
    setReviewError("");
    setSubmittingReview(true);
    try {
      await createReview({
        artistId: artist.id,
        rating: reviewRating,
        comment: reviewComment.trim() || null,
      });
      // Reload reviews
      const reviewsData = await loadReviews(artist.id);
      if (reviewsData) {
        setReviews(reviewsData.data ?? []);
        setReviewsMeta(reviewsData.meta ?? null);
      }
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewComment("");
    } catch (e) {
      const msg =
        e?.response?.data?.error || "Error al crear la review.";
      setReviewError(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (togglingFav) return;
    setTogglingFav(true);
    try {
      if (isFavorited) {
        await removeFavorite(artist.id);
        setIsFavorited(false);
        setFavoriteCount((c) => Math.max(0, (c ?? 1) - 1));
      } else {
        await addFavorite(artist.id);
        setIsFavorited(true);
        setFavoriteCount((c) => (c ?? 0) + 1);
      }
    } catch {
      // 409 = already favorited, 404 = not in favorites
    } finally {
      setTogglingFav(false);
    }
  };

  if (!open) return null;

  const onMarket = artistOwnerId(artist) == null;
  const isLoggedIn = currentUserId != null;

  const isOwner =
    currentUserId != null &&
    artistOwnerId(artist) != null &&
    String(artistOwnerId(artist)) === String(currentUserId);

  const buyDisabled =
    busyId === artist.id ||
    !onMarket;

  const displayGenre = artist.genre || genresToDisplay(artist.genres);

  return createPortal(
    <div className={`artist-modal-overlay${showExpandedReviews && reviews.length > 0 ? " artist-modal-overlay--expanded" : ""}`} role="presentation" onClick={onClose}>
      <div
        className="artist-modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="artist-modal-close" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="artist-modal-header">
          <img src={artist.img} alt="" className="artist-modal-img" />
          <div className="artist-modal-overlay-fade"></div>
          {artist.hype > 0 ? (
            <div className="artist-modal-hype-badge">
              <span className="material-symbols-outlined fill-icon">bolt</span>
              <span className="label-xs font-bold">Hype Level: {artist.hype}</span>
            </div>
          ) : null}
        </div>

        <div className="artist-modal-body">
          <span
            className="label-xs accent-primary-text font-bold tracking-spaced"
            style={{ textTransform: "uppercase" }}
          >
            {displayGenre || "Sin género"}
          </span>
          <h2 className="font-headline artist-modal-name">{artist.name}</h2>

          <div className="artist-modal-info-row">
            <div className="price-tag artist-modal-price-tag">
              <span className="label-xs accent-muted">Precio</span>
              <span className="font-headline artist-price">
                {artist.price.toLocaleString()}{" "}
                <span className="artist-price-unit">LC</span>
              </span>
            </div>

            <div className="artist-modal-favorites-area">
              {favoriteCount != null && (
                <div className="artist-modal-favorites">
                  <span className="material-symbols-outlined fill-icon fav-icon">
                    favorite
                  </span>
                  <span className="label-xs font-bold">
                    {favoriteCount} {favoriteCount === 1 ? "favorito" : "favoritos"}
                  </span>
                </div>
              )}
              {isLoggedIn && (
                <button
                  type="button"
                  className={`artist-modal-fav-btn ${isFavorited ? "artist-modal-fav-btn--active" : ""}`}
                  onClick={handleToggleFavorite}
                  disabled={togglingFav}
                  title={isFavorited ? "Quitar de favoritos" : "Agregar a favoritos"}
                >
                  <span className="material-symbols-outlined fill-icon">
                    {isFavorited ? "heart_minus" : "heart_plus"}
                  </span>
                </button>
              )}
            </div>
          </div>

          {reviews.length > 0 && !showExpandedReviews && (
            <div className="artist-modal-reviews">
              <h3 className="artist-modal-reviews-title">
                <span className="material-symbols-outlined">reviews</span>
                Reviews ({reviewsMeta?.totalItems ?? reviews.length})
              </h3>
              <ul className="artist-modal-reviews-list">
                {reviews.slice(0, 3).map((review) => (
                  <li key={review.id} className="artist-modal-review-item">
                    <div className="artist-modal-review-header">
                      <span className="artist-modal-review-user">
                        {review.user?.username ?? "Anónimo"}
                      </span>
                      <StarRating rating={review.rating} />
                    </div>
                    {review.comment && (
                      <p className="artist-modal-review-comment">
                        {review.comment}
                      </p>
                    )}
                    <span className="artist-modal-review-date">
                      {new Date(review.createdAt).toLocaleDateString("es-CL")}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="artist-modal-review-buttons">
            {isOwner && !showReviewForm && (
              <button
                type="button"
                className="book-btn book-btn--ghost artist-modal-add-review-btn"
                onClick={() => setShowReviewForm(true)}
              >
                <span className="material-symbols-outlined">edit_note</span>
                Dejar una review
              </button>
            )}
            {reviews.length > 0 && (
              <button
                type="button"
                className="book-btn book-btn--ghost artist-modal-add-review-btn"
                onClick={() => setShowExpandedReviews(!showExpandedReviews)}
              >
                <span className="material-symbols-outlined">
                  {showExpandedReviews ? "collapse_all" : "expand_all"}
                </span>
                {showExpandedReviews ? "Cerrar Reviews" : "Ver Reviews"}
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="artist-modal-review-form">
              <h4 className="artist-modal-review-form-title">Nueva Review</h4>
              <div className="artist-modal-review-form-rating">
                <span className="label-xs">Rating:</span>
                <StarSelector value={reviewRating} onChange={setReviewRating} />
              </div>
              <textarea
                className="artist-modal-review-form-textarea"
                placeholder="Escribe un comentario (opcional)"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
              />
              {reviewError && (
                <p className="artist-modal-review-form-error">{reviewError}</p>
              )}
              <div className="artist-modal-review-form-actions">
                <button
                  type="button"
                  className="book-btn"
                  disabled={submittingReview || reviewRating === 0}
                  onClick={handleSubmitReview}
                >
                  {submittingReview ? "Enviando..." : "Enviar Review"}
                </button>
                <button
                  type="button"
                  className="book-btn book-btn--ghost"
                  onClick={() => {
                    setShowReviewForm(false);
                    setReviewError("");
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="artist-modal-actions">
            {variant === "marketplace" ? (
              <>
                {onMarket ? (
                  <button
                    type="button"
                    className="book-btn"
                    disabled={buyDisabled}
                    onClick={() => {
                      onBuy?.(artist);
                      onClose();
                    }}
                  >
                    Comprar
                  </button>
                ) : null}
                {!onMarket && isOwner ? (
                  <button
                    type="button"
                    className="book-btn book-btn--secondary"
                    disabled={busyId === artist.id}
                    onClick={() => {
                      onSell?.(artist.id);
                      onClose();
                    }}
                  >
                    Vender al mercado
                  </button>
                ) : null}
              </>
            ) : (
              <div className="artist-card-buttons artist-card-buttons--managed">
                <button
                  type="button"
                  className="book-btn book-btn--secondary"
                  disabled={busyId === artist.id}
                  onClick={() => {
                    onSell?.(artist.id);
                    onClose();
                  }}
                >
                  Publicar en el mercado
                </button>
                {managedMode === "full" ? (
                  <div className="artist-card-buttons artist-card-buttons--row">
                    <button
                      type="button"
                      className="book-btn book-btn--ghost"
                      disabled={busyId === artist.id}
                      onClick={() => {
                        onEdit?.(artist);
                        onClose();
                      }}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="book-btn book-btn--danger"
                      disabled={busyId === artist.id}
                      onClick={() => {
                        onDelete?.(artist.id);
                        onClose();
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <p className="artist-card-managed-hint">
                    Para editar o borrar, entra a <strong>Contratados</strong>.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

        {showExpandedReviews && reviews.length > 0 && (
          <div
            className="artist-modal-expanded-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="artist-modal-expanded-header">
              <h3 className="artist-modal-expanded-title">
                <span className="material-symbols-outlined">reviews</span>
                Reviews ({reviewsMeta?.totalItems ?? reviews.length})
              </h3>
              <button
                type="button"
                className="artist-modal-expanded-close"
                onClick={() => setShowExpandedReviews(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <ul className="artist-modal-expanded-list">
              {reviews.map((review) => (
                <li key={review.id} className="artist-modal-review-item">
                  <div className="artist-modal-review-header">
                    <span className="artist-modal-review-user">
                      {review.user?.username ?? "Anónimo"}
                    </span>
                    <StarRating rating={review.rating} />
                  </div>
                  {review.comment && (
                    <p className="artist-modal-review-comment">
                      {review.comment}
                    </p>
                  )}
                  <span className="artist-modal-review-date">
                    {new Date(review.createdAt).toLocaleDateString("es-CL")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
    </div>,
    document.body
  );
}
