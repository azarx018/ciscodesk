import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}

export function Modal({ open, onClose, title, children, footer, width = 560 }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="cd-modal-backdrop" onMouseDown={onClose}>
      <div
        className="cd-modal"
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="cd-modal-header">
          <span className="cd-modal-title">{title}</span>
          <button className="cd-modal-close" onClick={onClose} aria-label="Close dialog">
            ✕
          </button>
        </div>
        <div className="cd-modal-body">{children}</div>
        {footer && <div className="cd-modal-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
