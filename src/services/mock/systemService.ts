import { BACKUPS, CONFIG_HISTORY, CONFIG_SNAPSHOTS, FIRMWARE } from "../../data/system";
import { Backup } from "../../types/system";
import { cloneData, simulateRequest } from "./mockClient";

let backups: Backup[] = cloneData(BACKUPS);

export const systemService = {
  getConfig(deviceId: string) {
    return simulateRequest({
      snapshot: cloneData(CONFIG_SNAPSHOTS.find((c) => c.deviceId === deviceId) ?? null),
      history: cloneData(CONFIG_HISTORY.filter((h) => h.deviceId === deviceId)),
    });
  },
  listBackups(deviceId: string): Promise<Backup[]> {
    return simulateRequest(cloneData(backups.filter((b) => b.deviceId === deviceId)));
  },
  createBackup(deviceId: string, user: string): Promise<Backup> {
    const created: Backup = {
      id: `bk-${Date.now()}`,
      deviceId,
      label: "Manual backup",
      timestamp: new Date().toISOString(),
      status: "completed",
      sizeKb: Math.round(60 + Math.random() * 30),
      user,
    };
    backups = [...backups, created];
    return simulateRequest(created, { latencyMs: 900 });
  },
  deleteBackup(id: string) {
    backups = backups.filter((b) => b.id !== id);
    return simulateRequest({ id });
  },
  getFirmware(deviceId: string) {
    return simulateRequest(cloneData(FIRMWARE.find((f) => f.deviceId === deviceId) ?? null));
  },
};
