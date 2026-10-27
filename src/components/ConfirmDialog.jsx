import { useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, title, description, confirmLabel = 'Confirmar', onCancel, onConfirm }) {
  const ref = useRef(null);
  const cancelRef = useRef(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.activeElement;
    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
    return () => {
      if (dialog.open) dialog.close();
      if (previous?.isConnected && typeof previous.focus === 'function') previous.focus();
    };
  }, [open]);
  async function confirm() {
    if (busy) return;
    setBusy(true);
    try { await onConfirm(); }
    finally { setBusy(false); }
  }
  return (
    <dialog ref={ref} className="confirm-dialog" aria-labelledby="dialog-title" aria-describedby="dialog-description" onCancel={(event) => { event.preventDefault(); if (!busy) onCancel(); }}>
      <div className="dialog-icon"><AlertTriangle size={25} aria-hidden="true"/></div>
      <h2 id="dialog-title">{title}</h2>
      <p id="dialog-description">{description}</p>
      <div className="dialog-actions">
        <button ref={cancelRef} type="button" className="btn btn-secondary" disabled={busy} onClick={onCancel}>Cancelar</button>
        <button type="button" className="btn btn-danger" disabled={busy} onClick={confirm}>{busy ? 'Excluindo…' : confirmLabel}</button>
      </div>
    </dialog>
  );
}
