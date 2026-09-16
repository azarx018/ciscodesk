import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { FLAT_NAV } from "../../../app/navigation";
import { useDeviceContext } from "../../../stores/DeviceContext";
import { Icon } from "../../icons/Icon";
import { StatusIndicator } from "../../ui";
import "./CommandPalette.css";

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

interface PaletteAction {
  id: string;
  label: string;
  group: string;
  run: () => void;
}

/** Ctrl+K command palette: jumps to any nav destination or switches the active device. */
export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { devices, selectDevice } = useDeviceContext();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const actions = useMemo<PaletteAction[]>(() => {
    const navActions: PaletteAction[] = FLAT_NAV.map((entry) => ({
      id: `nav-${entry.id}`,
      label: entry.groupLabel ? `${entry.groupLabel} / ${entry.label}` : entry.label,
      group: "Navigate",
      run: () => navigate(entry.path),
    }));
    const deviceActions: PaletteAction[] = devices.map((d) => ({
      id: `device-${d.id}`,
      label: `Switch to ${d.hostname}`,
      group: "Switch device",
      run: () => selectDevice(d.id),
    }));
    return [...navActions, ...deviceActions];
  }, [navigate, devices, selectDevice]);

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase();
    return actions.filter((a) => a.label.toLowerCase().includes(q));
  }, [actions, query]);

  useEffect(() => setActiveIndex(0), [query]);

  function run(action: PaletteAction) {
    action.run();
    onClose();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) run(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  }

  if (!open) return null;

  return createPortal(
    <div className="cd-cmdk-backdrop" onMouseDown={onClose}>
      <div className="cd-cmdk" role="dialog" aria-modal="true" aria-label="Command palette" onMouseDown={(e) => e.stopPropagation()}>
        <div className="cd-cmdk-input-row">
          <Icon.search size={15} />
          <input
            ref={inputRef}
            className="cd-cmdk-input"
            placeholder="Jump to a page or switch device…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <span className="cd-kbd">Esc</span>
        </div>
        <div className="cd-cmdk-list">
          {filtered.length === 0 ? (
            <div className="cd-cmdk-empty">No matches.</div>
          ) : (
            filtered.map((action, i) => (
              <button
                key={action.id}
                className={["cd-cmdk-item", i === activeIndex ? "cd-cmdk-item-active" : ""].filter(Boolean).join(" ")}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => run(action)}
              >
                <span className="cd-cmdk-item-group">{action.group}</span>
                <span>{action.label}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
