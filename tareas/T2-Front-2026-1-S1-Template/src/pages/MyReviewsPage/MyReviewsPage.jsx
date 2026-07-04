import { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { fetchMyReviews, updateReview, deleteReview } from "../../api/reviews";
import { artistImageUrl } from "../../utils/artistFromApi";
import { scrollDashboardToTop } from "../../utils/scrollDashboard";
import "./MyReviewsPage.css";

const PAGE_SIZE = 10;

const PLACEHOLDER_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="#1a1a1a" width="400" height="400"/><text x="50%" y="50%" fill="#FF007A" font-family="sans-serif" font-size="18" text-anchor="middle" dominant-baseline="middle">DCC</text></svg>`
  );

function StarRating({ rating }) {
  return (
    <span className="my-reviews-stars" aria-label={`${rating} de 5`}>
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
    <span className="my-reviews-star-selector">
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

export default function MyReviewsPage() {
  const { user } = useOutletContext() ?? {};
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const skipPageScrollRef = useRef(true);

  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editError, setEditError] = useState("");
  const [saving, setSaving] = useState(false);

  const startEdit = (review) => {
    setEditingId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment ?? "");
    setEditError("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditError("");
  };

  const handleSaveEdit = async (reviewId) => {
    if (editRating < 1 || editRating > 5) {
      setEditError("Selecciona un rating entre 1 y 5.");
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      await updateReview(reviewId, {
        rating: editRating,
        comment: editComment.trim() || null,
      });
      setEditingId(null);
      await load();
    } catch (e) {
      const msg = e?.response?.data?.error || "Error al actualizar la review.";
      setEditError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta review?")) return;
    try {
      await deleteReview(reviewId);
      await load();
    } catch {
      setError("Error al eliminar la review.");
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchMyReviews(page, PAGE_SIZE);
      setReviews(Array.isArray(res.data) ? res.data : []);
      setMeta(res.meta ?? null);
    } catch {
      setError("No se pudieron cargar tus reviews.");
      setReviews([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (skipPageScrollRef.current) {
      skipPageScrollRef.current = false;
      return;
    }
    scrollDashboardToTop();
  }, [page]);

  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.currentPage ?? page;

  return (
    <main className="my-reviews-page">
      <header className="my-reviews-page-header">
        <h1 className="font-headline my-reviews-page-title">
          <span className="my-reviews-highlight">Mis</span> Reviews
        </h1>
        {user && (
          <p className="my-reviews-subtitle">
            Reviews creadas por <strong>{user.username}</strong>
          </p>
        )}
      </header>

      {error && (
        <p className="my-reviews-notice my-reviews-notice--err">{error}</p>
      )}

      {loading ? (
        <p className="my-reviews-muted">Cargando...</p>
      ) : reviews.length === 0 ? (
        <p className="my-reviews-muted">Aún no has creado reviews.</p>
      ) : (
        <>
          <div className="my-reviews-list">
            {reviews.map((review) => {
              const artistImg = artistImageUrl(review.artist, PLACEHOLDER_IMG);
              return (
                <article key={review.id} className="my-reviews-card">
                  <div className="my-reviews-card-artist">
                    <img
                      src={artistImg}
                      alt=""
                      className="my-reviews-card-artist-img"
                    />
                    <div className="my-reviews-card-artist-info">
                      <h3 className="my-reviews-card-artist-name">
                        {review.artist?.name ?? "Artista desconocido"}
                      </h3>
                      {editingId === review.id ? (
                        <StarSelector value={editRating} onChange={setEditRating} />
                      ) : (
                        <StarRating rating={review.rating} />
                      )}
                    </div>
                  </div>

                  {editingId === review.id ? (
                    <div className="my-reviews-edit-form">
                      <textarea
                        className="my-reviews-edit-textarea"
                        placeholder="Comentario (opcional)"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                      />
                      {editError && (
                        <p className="my-reviews-edit-error">{editError}</p>
                      )}
                      <div className="my-reviews-edit-actions">
                        <button
                          type="button"
                          className="book-btn"
                          disabled={saving || editRating === 0}
                          onClick={() => handleSaveEdit(review.id)}
                        >
                          {saving ? "Guardando..." : "Guardar"}
                        </button>
                        <button
                          type="button"
                          className="book-btn book-btn--ghost"
                          onClick={cancelEdit}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {review.comment && (
                        <p className="my-reviews-card-comment">{review.comment}</p>
                      )}
                      <div className="my-reviews-card-footer">
                        <span className="my-reviews-card-date">
                          {new Date(review.createdAt).toLocaleDateString("es-CL", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <div className="my-reviews-card-actions">
                          <button
                            type="button"
                            className="book-btn book-btn--ghost my-reviews-edit-btn"
                            onClick={() => startEdit(review)}
                          >
                            <span className="material-symbols-outlined">edit</span>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="book-btn book-btn--danger my-reviews-edit-btn"
                            onClick={() => handleDelete(review.id)}
                          >
                            <span className="material-symbols-outlined">delete</span>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="my-reviews-pagination">
              <button
                type="button"
                className="my-reviews-pagination-btn"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <span className="my-reviews-pagination-meta">
                Página {currentPage} de {totalPages}
                {meta?.totalItems ? ` · ${meta.totalItems} reviews` : ""}
              </span>
              <button
                type="button"
                className="my-reviews-pagination-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
