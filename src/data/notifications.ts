import { AppNotification } from "../types/notification";

export const NOTIFICATIONS: AppNotification[] = [
  { id: "n1", message: "Device Offline — BRANCH-SW-01", severity: "error", timestamp: "2m ago", read: false },
  { id: "n2", message: "Interface Down — EDGE-RTR-01 Gi0/0/0", severity: "error", timestamp: "6m ago", read: false },
  { id: "n3", message: "High CPU — ACCESS-SW-01 (68%)", severity: "warning", timestamp: "22m ago", read: false },
  { id: "n4", message: "Configuration Changed — CORE-RTR-01", severity: "info", timestamp: "2h ago", read: true },
  { id: "n5", message: "Backup Completed — CORE-SW-01", severity: "success", timestamp: "5h ago", read: true },
  { id: "n6", message: "New Device Added — BRANCH-SW-01", severity: "info", timestamp: "1d ago", read: true },
];
