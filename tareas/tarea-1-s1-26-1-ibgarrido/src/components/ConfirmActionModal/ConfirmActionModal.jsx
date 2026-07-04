import { useEffect } from "react";
import "./ArtistCardModal.css"; // Reutilizamos el CSS

export default function ConfirmActionModal({
  isOpen,
  onConfirm,
  onCancel,
  message,
}) {

  if (!isOpen) return null;
  
  return (
    <div>
      <h3>{message}</h3>
    </div>
  );
}


// no implementado.