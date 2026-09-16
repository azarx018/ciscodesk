export type LogSeverity = "info" | "warning" | "error" | "critical";

export interface LogEntry {
  id: string;
  deviceId: string;
  timestamp: string;
  severity: LogSeverity;
  source: string;
  message: string;
}

export interface TrafficSample {
  timestamp: string;
  rxBps: number;
  txBps: number;
}

export interface InterfaceTrafficSeries {
  deviceId: string;
  interfaceName: string;
  packets: number;
  errors: number;
  utilizationPercent: number;
  samples: TrafficSample[];
}

export interface ResourceSample {
  timestamp: string;
  value: number;
}

export interface ResourceHistory {
  deviceId: string;
  metric: "cpu" | "memory";
  current: number;
  average: number;
  peak: number;
  history: ResourceSample[];
}

export interface HealthSnapshot {
  deviceId: string;
  cpu: number;
  memory: number;
  temperature: number;
  power: "normal" | "degraded" | "failed";
  fans: "normal" | "degraded" | "failed";
  storagePercent: number;
  uptime: string;
  interfacesUp: number;
  interfacesDown: number;
}
