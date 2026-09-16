import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import "./Drawer.css";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
}

/** Side panel for record detail / edit flows that don't warrant a full page (e.g. quick device edit). */
export function Drawer({ open, onClose, title, children, footer, width = 420 }: DrawerProps) {
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
    <div className="cd-drawer-backdrop" onMouseDown={onClose}>
      <div
        className="cd-drawer"
        style={{ width }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="cd-drawer-header">
          <span className="cd-drawer-title">{title}</span>
          <button className="cd-drawer-close" onClick={onClose} aria-label="Close panel">
            ✕
          </button>
        </div>
        <div className="cd-drawer-body">{children}</div>
        {footer && <div className="cd-drawer-footer">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}
