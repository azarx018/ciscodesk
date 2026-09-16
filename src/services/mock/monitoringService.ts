import { LOGS } from "../../data/logs";
import { HealthSnapshot, LogEntry, LogSeverity, ResourceHistory } from "../../types/monitoring";
import { DEVICES } from "../../data/devices";
import { INTERFACES_BY_DEVICE } from "../../data/interfaces";
import { cloneData, simulateRequest } from "./mockClient";

function buildHistory(current: number): number[] {
  const points: number[] = [];
  let v = current;
  for (let i = 23; i >= 0; i--) {
    v = Math.max(2, Math.min(98, v + (Math.random() - 0.5) * 10));
    points.unshift(Math.round(v));
  }
  points[points.length - 1] = current;
  return points;
}

export const monitoringService = {
  listLogs(deviceId: string, severity?: LogSeverity): Promise<LogEntry[]> {
    const filtered = LOGS.filter((l) => l.deviceId === deviceId && (!severity || l.severity === severity));
    return simulateRequest(cloneData(filtered));
  },

  getTraffic(deviceId: string, interfaceName: string) {
    const iface = INTERFACES_BY_DEVICE[deviceId]?.find((i) => i.name === interfaceName);
    if (!iface) return simulateRequest(null as never, { failWith: "Interface not found" });
    const now = Date.now();
    const samples = Array.from({ length: 12 }).map((_, i) => ({
      timestamp: new Date(now - (11 - i) * 5 * 60_000).toISOString(),
      rxBps: Math.round(iface.rxBps * (0.7 + Math.random() * 0.6)),
      txBps: Math.round(iface.txBps * (0.7 + Math.random() * 0.6)),
    }));
    return simulateRequest({
      deviceId,
      interfaceName,
      packets: Math.round(iface.rxBps / 800),
      errors: iface.rxErrors + iface.txErrors + iface.crcErrors,
      utilizationPercent: Math.min(100, Math.round((iface.rxBps / 1_000_000_000) * 100)),
      samples,
    });
  },

  getResourceHistory(deviceId: string, metric: "cpu" | "memory"): Promise<ResourceHistory> {
    const device = DEVICES.find((d) => d.id === deviceId);
    const current = metric === "cpu" ? device?.cpu ?? 0 : device?.memory ?? 0;
    const history = buildHistory(current).map((value, i) => ({
      timestamp: new Date(Date.now() - (23 - i) * 5 * 60_000).toISOString(),
      value,
    }));
    return simulateRequest({
      deviceId,
      metric,
      current,
      average: Math.round(history.reduce((s, h) => s + h.value, 0) / history.length),
      peak: Math.max(...history.map((h) => h.value)),
      history,
    });
  },

  getHealth(deviceId: string): Promise<HealthSnapshot> {
    const device = DEVICES.find((d) => d.id === deviceId);
    if (!device) return simulateRequest(null as never, { failWith: "Device not found" });
    const interfaces = INTERFACES_BY_DEVICE[deviceId] ?? [];
    return simulateRequest({
      deviceId,
      cpu: device.cpu,
      memory: device.memory,
      temperature: device.temperature,
      power: device.status === "offline" ? "failed" : "normal",
      fans: device.status === "warning" ? "degraded" : "normal",
      storagePercent: 42,
      uptime: device.uptime,
      interfacesUp: interfaces.filter((i) => i.status === "up").length,
      interfacesDown: interfaces.filter((i) => i.status !== "up").length,
    });
  },
};
