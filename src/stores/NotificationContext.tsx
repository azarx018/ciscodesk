import { createContext, ReactNode, useContext, useState } from "react";

export type NotificationSeverity = "info" | "warning" | "error" | "success";

export interface AppNotification {
  id: string;
  message: string;
  severity: NotificationSeverity;
  timestamp: string;
  read: boolean;
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}

const INITIAL: AppNotification[] = [
  { id: "n1", message: "Device Offline — BRANCH-SW-01", severity: "error", timestamp: "2m ago", read: false },
  { id: "n2", message: "Interface Down — EDGE-RTR-01 Gi0/2", severity: "error", timestamp: "6m ago", read: false },
  { id: "n3", message: "High CPU — ACCESS-SW-01 (68%)", severity: "warning", timestamp: "22m ago", read: false },
  { id: "n4", message: "Configuration Changed — CORE-RTR-01", severity: "info", timestamp: "2h ago", read: true },
  { id: "n5", message: "Backup Completed — CORE-SW-01", severity: "success", timestamp: "5h ago", read: true },
  { id: "n6", message: "New Device Added — BRANCH-SW-01", severity: "info", timestamp: "1d ago", read: true },
];

/** Mock notification feed for the topbar bell. Phase 3+ can wire this to real alert events. */
export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }
  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, markRead }}>
      {children}
    </NotificationContext.Provider>
  );
}
