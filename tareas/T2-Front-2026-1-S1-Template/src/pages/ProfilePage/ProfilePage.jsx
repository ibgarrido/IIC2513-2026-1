import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import ConfirmActionModal from "../../components/ConfirmActionModal/ConfirmActionModal";
import ProfileEditModal from "../../components/ProfileEditModal/ProfileEditModal";
import StatusMessageModal from "../../components/StatusMessageModal/StatusMessageModal";
import UserAvatar from "../../components/UserAvatar/UserAvatar";
import { deleteUser, updateUser } from "../../api/users";
import { getApiErrorMessage } from "../../utils/apiError";
import { normalizeUser } from "../../utils/userFromApi";
import "../MyArtistsPage/MyArtistsPage.css";
import "./ProfilePage.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useOutletContext() ?? {};

  const [editOpen, setEditOpen] = useState(false);
  const [pendingSaveBody, setPendingSaveBody] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusResult, setStatusResult] = useState(null);

  const closeEdit = () => {
    setEditOpen(false);
    setPendingSaveBody(null);
  };

  const confirmSave = async () => {
    if (!user?.id || !pendingSaveBody) return;
    setSaving(true);
    try {
      const response = await updateUser(user.id, pendingSaveBody);
      if (response?.user) {
        const normalized = normalizeUser(response.user);
        setUser?.(normalized);
        localStorage.setItem("user", JSON.stringify(normalized));
      }
      setPendingSaveBody(null);
      setEditOpen(false);
      setStatusResult({
        success: true,
        title: "Perfil actualizado",
        message: "Tus datos se guardaron correctamente.",
      });
    } catch (e) {
      setPendingSaveBody(null);
      setStatusResult({
        success: false,
        title: "No se pudo guardar",
        message: getApiErrorMessage(e),
      });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!user?.id) return;
    setDeleting(true);
    try {
      await deleteUser(user.id);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setDeleteConfirmOpen(false);
      navigate("/login", { replace: true });
    } catch (e) {
      setDeleteConfirmOpen(false);
      setStatusResult({
        success: false,
        title: "No se pudo eliminar la cuenta",
        message: getApiErrorMessage(e),
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="profile-page">
      <header className="profile-page-header">
        <h1 className="font-headline profile-page-title">
          <span className="profile-page-highlight">Mi</span> perfil
        </h1>
        {user && (
          <>
            <div className="profile-page-identity">
              <div className="profile-page-avatar-wrap">
                <UserAvatar user={user} size="lg" />
              </div>
              <div className="profile-page-details">
                <h2 className="profile-page-name">{user.username}</h2>
                <p className="profile-page-balance">
                  Saldo:{" "}
                  {typeof user.balance === "number"
                    ? `${user.balance.toLocaleString()} LC`
                    : "—"}
                </p>
              </div>
            </div>

            <div className="profile-page-actions">
              <button
                type="button"
                className="my-artists-create-btn"
                onClick={() => setEditOpen(true)}
              >
                <span className="material-symbols-outlined">edit</span>
                Editar perfil
              </button>
              <button
                type="button"
                className="my-artists-pagination-btn"
                style={{
                  borderColor: "var(--color-status-error, #c62828)",
                  color: "var(--color-status-error, #c62828)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <span className="material-symbols-outlined">person_off</span>
                Eliminar cuenta
              </button>
            </div>
          </>
        )}
      </header>

      <ProfileEditModal
        open={editOpen}
        onClose={closeEdit}
        user={user}
        saving={saving}
        onValidatedSubmit={setPendingSaveBody}
        onValidationError={(msg) =>
          setStatusResult({
            success: false,
            title: "No se puede guardar",
            message: msg,
          })
        }
      />

      <ConfirmActionModal
        open={Boolean(pendingSaveBody)}
        title="¿Guardar cambios?"
        message="¿Confirmar que quieres aplicar estos datos a tu perfil?"
        confirmLabel="Sí, guardar"
        cancelLabel="No"
        onCancel={() => setPendingSaveBody(null)}
        onConfirm={confirmSave}
      />

      <ConfirmActionModal
        open={deleteConfirmOpen}
        variant="danger"
        title="¿Eliminar tu cuenta?"
        message="Se borrarán tus datos, artistas y favoritos. Esta acción no se puede deshacer."
        confirmLabel={deleting ? "Eliminando…" : "Sí, eliminar"}
        cancelLabel="Cancelar"
        onCancel={() => !deleting && setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
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
