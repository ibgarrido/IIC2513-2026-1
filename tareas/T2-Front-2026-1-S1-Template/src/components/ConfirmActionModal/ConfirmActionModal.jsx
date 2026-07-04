import { useEffect } from "react";
import "./ConfirmActionModal.css";

export default function ConfirmActionModal({
  open,
  title,
  message,
  confirmLabel = "Sí",
  cancelLabel = "No",
  onConfirm,
  onCancel,
  variant = "default",
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="confirm-modal-overlay"
      role="presentation"
      onClick={onCancel}
    >
      <div
        className={`confirm-modal confirm-modal--${variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-modal-title" className="confirm-modal-title">
          {title}
        </h2>
        <div className="confirm-modal-message">{message}</div>
        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-modal-btn confirm-modal-btn--cancel"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="confirm-modal-btn confirm-modal-btn--ok"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
