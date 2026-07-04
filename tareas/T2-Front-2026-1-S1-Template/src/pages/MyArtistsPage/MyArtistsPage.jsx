import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  createArtist,
  deleteArtist,
  fetchMyArtistsPage,
  sellArtist,
  updateArtist,
} from "../../api/artists";
import ArtistCard from "../../components/ArtistCard/ArtistCard";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import ArtistFormModal from "../../components/ArtistFormModal/ArtistFormModal";
import ConfirmActionModal from "../../components/ConfirmActionModal/ConfirmActionModal";
import SearchBar from "../../components/SearchBar/SearchBar";
import StatusMessageModal from "../../components/StatusMessageModal/StatusMessageModal";
import { getApiErrorMessage } from "../../utils/apiError";
import { scrollDashboardToTop } from "../../utils/scrollDashboard";
import {
  artistImageUrl,
  artistOwnerId,
  genresToDisplay,
} from "../../utils/artistFromApi";
import "./MyArtistsPage.css";

const PAGE_SIZE = 12;

const PLACEHOLDER_IMG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect fill="#1a1a1a" width="400" height="400"/><text x="50%" y="50%" fill="#FF007A" font-family="sans-serif" font-size="18" text-anchor="middle" dominant-baseline="middle">DCC</text></svg>`
  );

function mapMine(a) {
  const genresStr = genresToDisplay(a.genres);
  const img = artistImageUrl(a, PLACEHOLDER_IMG);
  const hype = a.hypeLevel ?? 50;
  return {
    id: a.id,
    name: a.name,
    genre: genresStr,
    genres: genresStr,
    hype,
    hypeLevel: hype,
    price: a.price ?? 0,
    img,
    image_url: a.imageUrl || a.image_url || "",
    ownerUsername: null,
    ownerId: artistOwnerId(a),
  };
}

export default function MyArtistsPage() {
  const { user, setUser } = useOutletContext() ?? {};
  const [rawList, setRawList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [savingNew, setSavingNew] = useState(false);
  const [pendingCreate, setPendingCreate] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [busyId, setBusyId] = useState(null);
  const [notice, setNotice] = useState({ text: "", variant: "neutral" });
  const [statusResult, setStatusResult] = useState(null);
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState(null);
  const skipPageScrollRef = useRef(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editSaveBody, setEditSaveBody] = useState(null);
  const [sellTarget, setSellTarget] = useState(null);

  const handleSearch = () => {
    const nextQuery = search.trim();
    setPage(1);
    setSearchQuery(nextQuery);
  };

  const load = useCallback(async () => {
    setLoading(true);
    setNotice({ text: "", variant: "neutral" });
    try {
      const res = await fetchMyArtistsPage(page, PAGE_SIZE, searchQuery);
      setRawList(Array.isArray(res.data) ? res.data : []);
      setMeta(res.meta ?? null);
    } catch {
      setNotice({
        text: "No se pudieron cargar tus artistas.",
        variant: "err",
      });
      setRawList([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    // Rely on meta.totalPages from the API now
  }, [rawList.length]);

  useEffect(() => {
    if (skipPageScrollRef.current) {
      skipPageScrollRef.current = false;
      return;
    }
    scrollDashboardToTop();
  }, [page]);

  const runEditSave = async (body) => {
    if (!editing) return;
    setBusyId(editing.id);
    setNotice({ text: "", variant: "neutral" });
    try {
      await updateArtist(editing.id, body);
      setEditing(null);
      await load();
      setStatusResult({ success: true, title: "¡ACTUALIZACIÓN EXITOSA!", message: "El artista ha sido actualizado correctamente." });
    } catch (e) {
      setStatusResult({ success: false, title: "¡ERROR AL ACTUALIZAR!", message: getApiErrorMessage(e) });
    } finally {
      setBusyId(null);
    }
  };

  const confirmEditSave = () => {
    if (!editSaveBody) return;
    const body = editSaveBody;
    setEditSaveBody(null);
    runEditSave(body);
  };

  const runCreateSave = async (body) => {
    setSavingNew(true);
    setNotice({ text: "", variant: "neutral" });
    try {
      await createArtist(body);
      setCreating(false);
      await load();
      setStatusResult({ success: true, title: "¡CREACIÓN EXITOSA!", message: "El artista ha sido creado exitosamente." });
      setFormKey((k) => k + 1);
    } catch (e) {
      setStatusResult({ success: false, title: "¡ERROR AL CREAR!", message: getApiErrorMessage(e) });
    } finally {
      setSavingNew(false);
    }
  };

  const confirmCreateSave = () => {
    if (!pendingCreate) return;
    const body = pendingCreate;
    setPendingCreate(null);
    runCreateSave(body);
  };

  const closeModal = () => {
    setEditing(null);
    setCreating(false);
    setEditSaveBody(null);
    setPendingCreate(null);
  };

  const requestSell = (id) => {
    const row = rawList.find((x) => x.id === id);
    setSellTarget({
      id,
      name: row?.name ?? "este artista",
    });
  };

  const confirmSell = async () => {
    if (!sellTarget) return;
    const { id } = sellTarget;
    setSellTarget(null);
    setBusyId(id);
    setNotice({ text: "", variant: "neutral" });
    try {
      const res = await sellArtist(id);
      if (typeof res?.newBalance === "number") {
        setUser?.((prev) => {
          if (!prev) return prev;
          const updated = { ...prev, balance: res.newBalance };
          localStorage.setItem("user", JSON.stringify(updated));
          return updated;
        });
      }
      await load();
      setStatusResult({
        success: true,
        title: "¡PUBLICACIÓN EXITOSA!",
        message: res?.message || "El artista ahora es visible en el mercado general para otros managers."
      });
    } catch (e) {
      setStatusResult({ success: false, title: "¡ERROR AL PUBLICAR!", message: getApiErrorMessage(e) });
    } finally {
      setBusyId(null);
    }
  };

  const requestDelete = (id) => {
    const row = rawList.find((x) => x.id === id);
    setDeleteTarget({
      id,
      name: row?.name ?? "este artista",
    });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const { id } = deleteTarget;
    setDeleteTarget(null);
    setBusyId(id);
    setNotice({ text: "", variant: "neutral" });
    try {
      await deleteArtist(id);
      await load();
      setStatusResult({ success: true, title: "¡ELIMINACIÓN EXITOSA!", message: "El artista ha sido eliminado del sistema." });
    } catch (e) {
      setStatusResult({ success: false, title: "¡ERROR AL ELIMINAR!", message: getApiErrorMessage(e) });
    } finally {
      setBusyId(null);
    }
  };

  const list = useMemo(() => rawList.map(mapMine), [rawList]);
  const totalPages = meta?.totalPages ?? 1;
  const currentPage = meta?.currentPage ?? page;

  return (
    <main className="my-artists-page">
      <header className="my-artists-page-header">
        <h1 className="font-headline my-artists-page-title">
          <span className="my-artists-highlight">Artistas</span> contratados
        </h1>

        <div className="my-artists-header-row">
          <div className="my-artists-profile-section">
            {user ? (
              <div className="my-artists-profile-info">
                <UserAvatar
                  user={user}
                  size="md"
                  className="my-artists-profile-avatar"
                />
                <div className="my-artists-profile-details">
                  <h2 className="my-artists-profile-name">{user.username}</h2>
                  <p className="my-artists-profile-balance">
                    Saldo: {typeof user.balance === "number" ? `${user.balance.toLocaleString()} LC` : "..."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="my-artists-profile-info" />
            )}
          </div>

          <div className="my-artists-actions">
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={handleSearch}
              placeholder="Buscar tus artistas…"
              ariaLabel="Buscar tus artistas"
              className="my-artists-search-box"
            />

            <button
              type="button"
              className="my-artists-create-btn"
              onClick={() => setCreating(true)}
            >
              <span className="material-symbols-outlined">add</span>
              Crear artista
            </button>
          </div>
        </div>
      </header>

      {notice.text ? (
        <p className={`my-artists-notice my-artists-notice--${notice.variant}`}>
          {notice.text}
        </p>
      ) : null}

      {loading ? (
        <p className="my-artists-muted">Cargando…</p>
      ) : list.length === 0 ? (
        <p className="my-artists-muted">
          Aún no tienes artistas. Créalos desde Mi perfil.
        </p>
      ) : (
        <>
          <div className="my-artists-grid">
            {list.map((artist) => (
              <div className="my-artists-card-cell" key={artist.id}>
                <ArtistCard
                  artist={artist}
                  variant="managed"
                  currentUserId={user?.id}
                  busyId={busyId}
                  onSell={requestSell}
                  onEdit={(a) => setEditing(rawList.find((x) => x.id === a.id))}
                  onDelete={requestDelete}
                />
              </div>
            ))}
          </div>
          {totalPages > 1 ? (
            <div className="my-artists-pagination">
              <button
                type="button"
                className="my-artists-pagination-btn"
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Anterior
              </button>
              <span className="my-artists-pagination-meta">
                Página {currentPage} de {totalPages}
                {meta?.totalItems ? ` · ${meta.totalItems} artistas` : ""}
              </span>
              <button
                type="button"
                className="my-artists-pagination-btn"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setPage((p) => (p < totalPages ? p + 1 : p))
                }
              >
                Siguiente
              </button>
            </div>
          ) : null}
        </>
      )}

      {editing || creating ? (
        <div
          className="my-artists-modal-overlay"
          role="presentation"
          onClick={closeModal}
        >
          <div
            className="my-artists-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="my-artists-edit-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="my-artists-modal-head">
              <h2 id="my-artists-edit-title" className="font-headline">
                {creating ? "Crear artista" : "Editar artista"}
              </h2>
              <button
                type="button"
                className="my-artists-modal-close"
                onClick={closeModal}
                aria-label="Cerrar"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {creating ? (
              <ArtistFormModal
                key={`create-${formKey}`}
                formId="create-artist"
                submitLabel="Crear artista"
                loading={savingNew}
                onSubmit={(body) => setPendingCreate(body)}
              />
            ) : (
              <ArtistFormModal
                key={`edit-${editing.id}`}
                formId="edit-artist"
                initialValues={{
                  name: editing.name,
                  hypeLevel: editing.hypeLevel,
                  genres: editing.genres,
                  price: editing.price,
                  image_url: editing.image_url,
                }}
                submitLabel="Guardar cambios"
                loading={busyId === editing.id}
                onSubmit={(body) => setEditSaveBody(body)}
              />
            )}
          </div>
        </div>
      ) : null}

      <ConfirmActionModal
        open={Boolean(pendingCreate)}
        title="¿Confirmar creación?"
        message="¿Seguro que quieres crear este artista con los datos ingresados?"
        confirmLabel="Sí, crear"
        cancelLabel="No"
        onCancel={() => setPendingCreate(null)}
        onConfirm={confirmCreateSave}
      />

      <ConfirmActionModal
        open={Boolean(deleteTarget)}
        variant="danger"
        title="¿Eliminar artista?"
        message={
          deleteTarget ? (
            <>
              ¿Estás seguro de que quieres eliminar a{" "}
              <strong>{deleteTarget.name}</strong>? Esta acción no se puede
              deshacer.
            </>
          ) : null
        }
        confirmLabel="Sí, eliminar"
        cancelLabel="No"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />

      <ConfirmActionModal
        open={Boolean(editSaveBody)}
        title="¿Guardar cambios?"
        message="¿Confirmar que quieres aplicar estos cambios al artista?"
        confirmLabel="Sí, guardar"
        cancelLabel="No"
        onCancel={() => setEditSaveBody(null)}
        onConfirm={confirmEditSave}
      />

      <ConfirmActionModal
        open={Boolean(sellTarget)}
        title="¿Publicar en el mercado?"
        message={
          sellTarget ? (
            <>
              ¿Seguro que quieres publicar a{" "}
              <strong>{sellTarget.name}</strong> en el mercado general?
            </>
          ) : null
        }
        confirmLabel="Sí, publicar"
        cancelLabel="No"
        onCancel={() => setSellTarget(null)}
        onConfirm={confirmSell}
      />

      <StatusMessageModal
        open={Boolean(statusResult)}
        success={statusResult?.success}
        title={statusResult?.title}
        message={statusResult?.message}
        onClose={() => setStatusResult(null)}
      />
    </main>
  );
}
