import { LogEntry } from "../types/monitoring";

export const LOGS: LogEntry[] = [
  { id: "log-1", deviceId: "edge-rtr-01", timestamp: "2026-09-17T05:52:00Z", severity: "critical", source: "LINK", message: "Interface GigabitEthernet0/0/0, changed state to down" },
  { id: "log-2", deviceId: "edge-rtr-01", timestamp: "2026-09-17T05:52:03Z", severity: "error", source: "BGP", message: "neighbor 203.0.113.1 Down BGP Notification sent" },
  { id: "log-3", deviceId: "access-sw-01", timestamp: "2026-09-17T05:40:11Z", severity: "warning", source: "ENVMON", message: "CPU utilization at 68%, above threshold (65%)" },
  { id: "log-4", deviceId: "core-sw-01", timestamp: "2026-09-17T04:10:02Z", severity: "info", source: "CONFIG", message: "Configured from console by admin" },
  { id: "log-5", deviceId: "core-sw-01", timestamp: "2026-09-17T03:59:47Z", severity: "info", source: "STP", message: "VLAN0010 topology change, interface GigabitEthernet1/0/3" },
  { id: "log-6", deviceId: "branch-sw-01", timestamp: "2026-09-17T03:52:00Z", severity: "critical", source: "SYS", message: "Device unreachable — last poll failed after 3 retries" },
  { id: "log-7", deviceId: "access-sw-01", timestamp: "2026-09-17T02:30:00Z", severity: "warning", source: "PORTSEC", message: "Security violation occurred on Gi0/5, port disabled" },
  { id: "log-8", deviceId: "core-rtr-01", timestamp: "2026-09-16T22:12:09Z", severity: "info", source: "OSPF", message: "Nbr 10.255.255.2 on Gi0/0/2 from LOADING to FULL" },
  { id: "log-9", deviceId: "core-rtr-01", timestamp: "2026-09-16T18:00:00Z", severity: "info", source: "BACKUP", message: "Startup configuration backed up successfully" },
  { id: "log-10", deviceId: "edge-rtr-01", timestamp: "2026-09-16T12:00:00Z", severity: "error", source: "HW", message: "Temperature sensor reading above normal (61C)" },
];
