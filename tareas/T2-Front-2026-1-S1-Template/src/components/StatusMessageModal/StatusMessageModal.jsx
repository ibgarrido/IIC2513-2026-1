import { useEffect } from "react";
import "./StatusMessageModal.css";

export default function StatusMessageModal({
  open,
  success,
  title,
  statusText,
  message,
  onClose,
  data = {},
  primaryActionText,
  onPrimaryAction,
  secondaryActionText,
  onSecondaryAction,
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="status-popup-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className={`status-popup status-popup--${success ? "success" : "error"}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="status-popup-icon-container">
          <div className="status-popup-icon-box">
            <span className="material-symbols-outlined status-popup-icon">
              {success ? "celebration" : "warning"}
            </span>
          </div>
        </div>

        <div className="status-popup-content">
          <p className="status-popup-status">
            {statusText || (success ? "ESTADO: CONFIRMADO" : "ALERTA: TRANSACCIÓN DENEGADA")}
          </p>

          <h2 className="status-popup-title font-headline">
            {title || (success ? "¡OPERACIÓN EXITOSA!" : "¡OPERACIÓN FALLIDA!")}
          </h2>

          <div className="status-popup-details">
            {message ? (
              <p style={{ color: "#fff", fontSize: "1.1rem", marginBottom: "1rem" }}>{message}</p>
            ) : success ? (
              <div className="status-popup-detail-box status-popup-detail-box--success">
                <div className="status-popup-detail-row">
                  <span className="status-popup-detail-label">COSTO DE RESERVA</span>
                  <span className="status-popup-detail-value">${data.bookingFee?.toLocaleString() || "0.00"}</span>
                </div>
              </div>
            ) : (
              <div className="status-popup-columns">
                <div className="status-popup-detail-box">
                  <span className="status-popup-detail-label">SALDO RESTANTE</span>
                  <span className="status-popup-detail-value">${data.remainingBalance?.toLocaleString() || "0.00"}</span>
                </div>
                <div className="status-popup-detail-box">
                  <span className="status-popup-detail-label">PRECIO DEL ARTISTA</span>
                  <span className="status-popup-detail-value status-popup-detail-value--error">
                    ${data.bookingPrice?.toLocaleString() || "0.00"}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="status-popup-actions">
            <button
              type="button"
              className="status-popup-btn"
              onClick={onPrimaryAction || onClose}
            >
              {primaryActionText || "ACEPTAR"}
            </button>
            {secondaryActionText && (
              <button
                type="button"
                className="status-popup-btn status-popup-btn--secondary"
                onClick={onSecondaryAction || onClose}
              >
                {secondaryActionText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
