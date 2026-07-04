import { useCallback, useEffect, useState } from "react";
import { buildUserUpdateBody } from "../../api/users";
import { userProfileImageRaw } from "../../utils/userFromApi";
import "../ArtistFormModal/ArtistFormModal.css";
import "../../pages/MyArtistsPage/MyArtistsPage.css";

export default function ProfileEditModal({
  open,
  onClose,
  user,
  saving,
  onValidatedSubmit,
  onValidationError,
}) {
  const [formUsername, setFormUsername] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formPassword2, setFormPassword2] = useState("");
  const [formErrors, setFormErrors] = useState({});

  const reset = useCallback(() => {
    if (!user) return;
    setFormUsername(user.username ?? "");
    setFormImage(userProfileImageRaw(user));
    setFormPassword("");
    setFormPassword2("");
    setFormErrors({});
  }, [user]);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.id) {
      onValidationError?.(
        "No se encontró tu usuario. Vuelve a iniciar sesión."
      );
      return;
    }
    const err = {};
    const u = formUsername.trim();
    if (!u) err.username = "Ingresa un nombre de usuario.";
    if (formPassword || formPassword2) {
      if (formPassword.length < 4)
        err.password = "La contraseña debe tener al menos 4 caracteres.";
      if (formPassword !== formPassword2)
        err.password2 = "Las contraseñas no coinciden.";
    }
    setFormErrors(err);
    if (Object.keys(err).length) return;

    const body = buildUserUpdateBody(user, {
      username: formUsername,
      image: formImage,
      password: formPassword,
    });
    if (Object.keys(body).length === 0) {
      onValidationError?.("Modifica al menos un campo antes de guardar.");
      return;
    }
    onValidatedSubmit(body);
  };

  return (
    <div
      className="my-artists-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="my-artists-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-edit-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="my-artists-modal-head">
          <h2 id="profile-edit-title" className="font-headline">
            Editar perfil
          </h2>
          <button
            type="button"
            className="my-artists-modal-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form className="artist-form" onSubmit={handleSubmit} noValidate>
          <div className="artist-form-field">
            <label className="artist-form-label" htmlFor="profile-edit-username">
              Nombre de usuario
            </label>
            <input
              id="profile-edit-username"
              className="artist-form-input"
              value={formUsername}
              onChange={(e) => {
                setFormUsername(e.target.value);
                if (formErrors.username)
                  setFormErrors((x) => {
                    const n = { ...x };
                    delete n.username;
                    return n;
                  });
              }}
              autoComplete="username"
              maxLength={120}
            />
            {formErrors.username ? (
              <span className="artist-form-error">{formErrors.username}</span>
            ) : null}
          </div>

          <div className="artist-form-field">
            <label className="artist-form-label" htmlFor="profile-edit-image">
              URL de imagen de perfil
            </label>
            <input
              id="profile-edit-image"
              type="url"
              className="artist-form-input"
              value={formImage}
              onChange={(e) => setFormImage(e.target.value)}
              placeholder="https://… (vacío quita la foto)"
              autoComplete="off"
            />
          </div>

          <div className="artist-form-field">
            <label className="artist-form-label" htmlFor="profile-edit-password">
              Nueva contraseña (opcional)
            </label>
            <input
              id="profile-edit-password"
              type="password"
              className="artist-form-input"
              value={formPassword}
              onChange={(e) => {
                setFormPassword(e.target.value);
                if (formErrors.password)
                  setFormErrors((x) => {
                    const n = { ...x };
                    delete n.password;
                    return n;
                  });
              }}
              autoComplete="new-password"
            />
            {formErrors.password ? (
              <span className="artist-form-error">{formErrors.password}</span>
            ) : null}
          </div>

          <div className="artist-form-field">
            <label className="artist-form-label" htmlFor="profile-edit-password2">
              Repetir nueva contraseña
            </label>
            <input
              id="profile-edit-password2"
              type="password"
              className="artist-form-input"
              value={formPassword2}
              onChange={(e) => {
                setFormPassword2(e.target.value);
                if (formErrors.password2)
                  setFormErrors((x) => {
                    const n = { ...x };
                    delete n.password2;
                    return n;
                  });
              }}
              autoComplete="new-password"
            />
            {formErrors.password2 ? (
              <span className="artist-form-error">{formErrors.password2}</span>
            ) : null}
          </div>

          <button type="submit" className="artist-form-submit" disabled={saving}>
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}
