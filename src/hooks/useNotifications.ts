/**
 * Public hook location for notifications (§20). The actual state
 * lives in stores/NotificationContext — re-exported here so pages
 * can `import { useNotifications } from "../hooks/useNotifications"`
 * without knowing it's context-backed rather than a separate store.
 */
export { useNotifications } from "../stores/NotificationContext";
export type { AppNotification, NotificationSeverity } from "../types/notification";
