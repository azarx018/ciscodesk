import { AddDeviceInput, Device, DeviceDiscoveryResult } from "../../types/device";
import { DEVICES } from "../../data/devices";
import { cloneData, MockServiceError, simulateRequest } from "./mockClient";

let devices: Device[] = cloneData(DEVICES);

export const deviceService = {
  list(): Promise<Device[]> {
    return simulateRequest(cloneData(devices));
  },

  get(id: string): Promise<Device> {
    const found = devices.find((d) => d.id === id);
    if (!found) return simulateRequest(null as never, { failWith: `Device ${id} not found` });
    return simulateRequest(cloneData(found));
  },

  /** Simulates the "Test Connection" discovery step in Add Device (§6). */
  testConnection(hostnameOrIp: string): Promise<DeviceDiscoveryResult> {
    const unreachable = hostnameOrIp.trim().startsWith("0.");
    if (unreachable) {
      return simulateRequest(null as never, {
        latencyMs: 900,
        failWith: "Connection failed — device unreachable",
      });
    }
    return simulateRequest(
      {
        hostname: hostnameOrIp.toUpperCase(),
        platform: "Cisco IOS XE",
        interfaces: 24,
        cpu: Math.floor(10 + Math.random() * 30),
        memory: Math.floor(25 + Math.random() * 30),
      },
      { latencyMs: 900 }
    );
  },

  add(input: AddDeviceInput): Promise<Device> {
    const newDevice: Device = {
      id: input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      name: input.name,
      hostname: input.name,
      managementIp: input.hostnameOrIp,
      platform: "Cisco IOS XE",
      osVersion: "unknown",
      status: "online",
      uptime: "0d 00h 01m",
      cpu: Math.floor(10 + Math.random() * 20),
      memory: Math.floor(20 + Math.random() * 20),
      temperature: 38,
      lastSeen: "just now",
      group: input.group,
      interfaceCount: 24,
      model: "unknown",
      serial: "unknown",
    };
    devices = [...devices, newDevice];
    return simulateRequest(cloneData(newDevice));
  },

  remove(id: string): Promise<{ id: string }> {
    const exists = devices.some((d) => d.id === id);
    if (!exists) return simulateRequest(null as never, { failWith: `Device ${id} not found` });
    devices = devices.filter((d) => d.id !== id);
    return simulateRequest({ id });
  },
};

export { MockServiceError };
