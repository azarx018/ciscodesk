export type DeviceStatus = "online" | "warning" | "error" | "offline";

/**
 * Minimal device model needed to drive the shell's device switcher in
 * Phase 2. Expanded with the full field set (interfaces, health
 * history, etc.) in Phase 3's data architecture.
 */
export interface Device {
  id: string;
  hostname: string;
  managementIp: string;
  platform: string;
  osVersion: string;
  status: DeviceStatus;
  uptime: string;
  lastSeen: string;
}
