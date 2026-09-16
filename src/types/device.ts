export type DeviceStatus = "online" | "warning" | "error" | "offline";
export type ConnectionMethod = "SSH" | "NETCONF" | "RESTCONF" | "Auto Detect";
export type DeviceGroup = "Core" | "Distribution" | "Access" | "Branches" | "Labs";

export interface Device {
  id: string;
  name: string;
  hostname: string;
  managementIp: string;
  platform: string;
  osVersion: string;
  status: DeviceStatus;
  uptime: string;
  cpu: number;
  memory: number;
  temperature: number;
  lastSeen: string;
  group: DeviceGroup;
  interfaceCount: number;
  model: string;
  serial: string;
}

/** Result shape of the simulated "Test Connection" discovery step in Add Device (§6). */
export interface DeviceDiscoveryResult {
  hostname: string;
  platform: string;
  interfaces: number;
  cpu: number;
  memory: number;
}

export interface AddDeviceInput {
  name: string;
  hostnameOrIp: string;
  connectionMethod: ConnectionMethod;
  port: number;
  username: string;
  authMethod: "Password" | "SSH Key" | "Token";
  credential: string;
  description?: string;
  group: DeviceGroup;
}
