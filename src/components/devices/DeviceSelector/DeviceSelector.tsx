import { useEffect, useRef, useState } from "react";
import { useDeviceContext } from "../../../stores/DeviceContext";
import { StatusIndicator } from "../../ui";
import { Icon } from "../../icons/Icon";
import "./DeviceSelector.css";

/**
 * Topbar device switcher. Always makes the currently selected device
 * obvious (hostname + management IP), and lists hostname / management
 * IP / platform / status / last seen for every device, per §5.
 */
export function DeviceSelector() {
  const { devices, selectedDevice, selectDevice } = useDeviceContext();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  if (!selectedDevice) {
    return <div className="cd-device-selector cd-device-selector-loading">Loading devices…</div>;
  }

  return (
    <div className="cd-device-selector" ref={ref}>
      <button className="cd-device-trigger" onClick={() => setOpen((o) => !o)} aria-haspopup="listbox" aria-expanded={open}>
        <StatusIndicator tone={selectedDevice.status} />
        <span className="cd-device-info">
          <span className="cd-device-name mono">{selectedDevice.hostname}</span>
          <span className="cd-device-meta">{selectedDevice.managementIp} · {selectedDevice.platform}</span>
        </span>
        <Icon.chevronDown size={14} />
      </button>

      {open && (
        <div className="cd-device-menu" role="listbox">
          <div className="cd-device-menu-label">Switch device</div>
          {devices.map((d) => (
            <button
              key={d.id}
              role="option"
              aria-selected={d.id === selectedDevice.id}
              className={["cd-device-option", d.id === selectedDevice.id ? "cd-device-option-active" : ""].join(" ")}
              onClick={() => {
                selectDevice(d.id);
                setOpen(false);
              }}
            >
              <StatusIndicator tone={d.status} />
              <span className="cd-device-option-info">
                <span className="cd-device-name mono">{d.hostname}</span>
                <span className="cd-device-meta">
                  {d.managementIp} · {d.platform} · {d.osVersion}
                </span>
              </span>
              <span className="cd-device-lastseen">{d.lastSeen}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
