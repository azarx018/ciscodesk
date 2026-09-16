export type NotificationSeverity = "info" | "warning" | "error" | "success";

export interface AppNotification {
  id: string;
  message: string;
  severity: NotificationSeverity;
  timestamp: string;
  read: boolean;
}
