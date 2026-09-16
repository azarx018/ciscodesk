import { useEffect, useRef, useState } from "react";
import { useNotifications } from "../../../stores/NotificationContext";
import { Icon } from "../../icons/Icon";
import "./NotificationsPanel.css";

const SEVERITY_ICON = {
  error: { icon: Icon.alertTri, color: "error" },
  warning: { icon: Icon.alertTri, color: "warning" },
  success: { icon: Icon.check, color: "online" },
  info: { icon: Icon.info, color: "offline" },
} as const;

export function NotificationsPanel() {
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="cd-notif" ref={ref}>
      <button className="cd-icon-btn" onClick={() => setOpen((o) => !o)} aria-label="Notifications">
        <Icon.bell size={16} />
        {unreadCount > 0 && <span className="cd-icon-btn-dot" />}
      </button>
      {open && (
        <div className="cd-notif-panel" role="menu">
          <div className="cd-notif-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button className="cd-notif-markall" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>
          <div className="cd-notif-list">
            {notifications.map((n) => {
              const meta = SEVERITY_ICON[n.severity];
              const Ic = meta.icon;
              return (
                <button
                  key={n.id}
                  className={["cd-notif-item", n.read ? "" : "cd-notif-item-unread"].filter(Boolean).join(" ")}
                  onClick={() => markRead(n.id)}
                >
                  <span className={`cd-notif-icon cd-notif-icon-${meta.color}`}>
                    <Ic size={13} />
                  </span>
                  <span className="cd-notif-main">
                    <span className="cd-notif-msg">{n.message}</span>
                    <span className="cd-notif-time">{n.timestamp}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
