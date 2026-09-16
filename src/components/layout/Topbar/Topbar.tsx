import { DeviceSelector } from "../../devices/DeviceSelector";
import { NotificationsPanel } from "../NotificationsPanel";
import { UserMenu } from "../UserMenu";
import { Icon } from "../../icons/Icon";
import { Tooltip } from "../../ui";
import { useTheme } from "../../../app/providers/ThemeProvider";
import "./Topbar.css";

export interface TopbarProps {
  onOpenPalette: () => void;
  onToggleMobileSidebar: () => void;
}

export function Topbar({ onOpenPalette, onToggleMobileSidebar }: TopbarProps) {
  const { theme, toggle } = useTheme();

  return (
    <div className="cd-topbar">
      <button className="cd-hamburger cd-icon-btn" onClick={onToggleMobileSidebar} aria-label="Toggle navigation">
        <Icon.menu size={16} />
      </button>

      <DeviceSelector />

      <button className="cd-topbar-search" onClick={onOpenPalette}>
        <Icon.search size={14} />
        <span className="grow" style={{ textAlign: "left" }}>Search or jump to…</span>
        <span className="cd-kbd">Ctrl K</span>
      </button>

      <Tooltip content="Frontend prototype — all data is simulated" side="bottom">
        <span className="cd-mock-badge">Mock data</span>
      </Tooltip>

      <div className="cd-topbar-actions">
        <button className="cd-icon-btn" onClick={toggle} aria-label="Toggle theme">
          {theme === "dark" ? <Icon.sun size={16} /> : <Icon.moon size={16} />}
        </button>
        <NotificationsPanel />
        <UserMenu />
      </div>
    </div>
  );
}
