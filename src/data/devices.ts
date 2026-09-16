import { Device } from "../types/device";

/**
 * Placeholder mock devices for the Phase 2 shell (device switcher,
 * command palette "switch device" entries). Phase 3 replaces this
 * with a full mock device dataset served through deviceService.
 */
export const DEVICES: Device[] = [
  {
    id: "core-rtr-01",
    hostname: "CORE-RTR-01",
    managementIp: "10.0.0.1",
    platform: "Cisco IOS XE",
    osVersion: "17.09.04a",
    status: "online",
    uptime: "17d 04h 12m",
    lastSeen: "just now",
  },
  {
    id: "core-sw-01",
    hostname: "CORE-SW-01",
    managementIp: "10.0.0.2",
    platform: "Cisco IOS XE",
    osVersion: "17.06.05",
    status: "online",
    uptime: "44d 11h 02m",
    lastSeen: "just now",
  },
  {
    id: "access-sw-01",
    hostname: "ACCESS-SW-01",
    managementIp: "10.0.1.10",
    platform: "Cisco IOS",
    osVersion: "15.2(7)E9",
    status: "warning",
    uptime: "3d 02h 40m",
    lastSeen: "1m ago",
  },
  {
    id: "edge-rtr-01",
    hostname: "EDGE-RTR-01",
    managementIp: "203.0.113.1",
    platform: "Cisco IOS XE",
    osVersion: "17.09.02",
    status: "error",
    uptime: "0d 00h 12m",
    lastSeen: "6m ago",
  },
  {
    id: "branch-sw-01",
    hostname: "BRANCH-SW-01",
    managementIp: "10.0.4.5",
    platform: "Cisco IOS",
    osVersion: "15.2(7)E7",
    status: "offline",
    uptime: "—",
    lastSeen: "2h ago",
  },
];
