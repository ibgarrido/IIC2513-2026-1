import { useEffect } from "react";
import "./StatusMessageModal.css";

export default function StatusMessageModal({
  isOpen,
  success,
  message,
  onClose,
}) {


  return (
    <div className="statusModal__overlay" onClick={onClose}>
    </div>
  );
}
