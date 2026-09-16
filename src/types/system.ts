export interface Backup {
  id: string;
  deviceId: string;
  label: string;
  timestamp: string;
  status: "completed" | "failed" | "in-progress";
  sizeKb: number;
  user: string;
}

export interface FirmwareInfo {
  deviceId: string;
  currentVersion: string;
  availableVersion: string | null;
  releaseStatus: "up-to-date" | "update-available" | "unsupported";
  imageName: string;
  imageSizeMb: number;
}

export interface ConfigSnapshot {
  deviceId: string;
  running: string;
  startup: string;
  lastChanged: string;
}

export interface ConfigHistoryEntry {
  id: string;
  deviceId: string;
  timestamp: string;
  user: string;
  summary: string;
}
