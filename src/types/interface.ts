export type InterfaceStatus = "up" | "down" | "admin-down";
export type InterfaceMode = "access" | "trunk" | "routed";

export interface NetworkInterface {
  id: string;
  deviceId: string;
  name: string; // e.g. GigabitEthernet0/1
  description: string;
  status: InterfaceStatus;
  protocol: "up" | "down";
  speed: string; // "1000" (Mbps) or "auto"
  duplex: "full" | "half" | "auto";
  ipv4?: string;
  prefix?: number;
  vlan?: number;
  mode: InterfaceMode;
  rxBps: number;
  txBps: number;
  rxErrors: number;
  txErrors: number;
  crcErrors: number;
}

export interface InterfaceConfigDraft {
  description: string;
  ipv4: string;
  prefix: number;
  adminStatus: "up" | "down";
  speed: string;
  duplex: "full" | "half" | "auto";
  mode: InterfaceMode;
  vlan?: number;
}
