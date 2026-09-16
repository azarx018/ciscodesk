import { InterfaceConfigDraft, NetworkInterface } from "../../types/interface";
import { INTERFACES_BY_DEVICE } from "../../data/interfaces";
import { cloneData, simulateRequest } from "./mockClient";

const store: Record<string, NetworkInterface[]> = cloneData(INTERFACES_BY_DEVICE);

export const interfaceService = {
  list(deviceId: string): Promise<NetworkInterface[]> {
    return simulateRequest(cloneData(store[deviceId] ?? []));
  },

  get(deviceId: string, interfaceId: string): Promise<NetworkInterface> {
    const found = store[deviceId]?.find((i) => i.id === interfaceId);
    if (!found) return simulateRequest(null as never, { failWith: "Interface not found" });
    return simulateRequest(cloneData(found));
  },

  /** Config preview step — returns a Cisco-style config block, does not apply anything (§8, §29). */
  previewConfig(current: NetworkInterface, draft: InterfaceConfigDraft): Promise<string> {
    const lines = [
      `interface ${current.name}`,
      ` description ${draft.description || current.description || "-"}`,
      draft.ipv4 ? ` ip address ${draft.ipv4} ${prefixToMask(draft.prefix)}` : null,
      draft.mode === "trunk" ? " switchport mode trunk" : null,
      draft.mode === "access" && draft.vlan ? ` switchport access vlan ${draft.vlan}` : null,
      draft.speed !== "auto" ? ` speed ${draft.speed}` : null,
      draft.duplex !== "auto" ? ` duplex ${draft.duplex}` : null,
      draft.adminStatus === "up" ? " no shutdown" : " shutdown",
    ].filter(Boolean);
    return simulateRequest(lines.join("\n"), { latencyMs: 250 });
  },

  /** Simulated apply — never touches a real device (§8, §33). Occasionally simulates validation failure. */
  applyConfig(deviceId: string, interfaceId: string, draft: InterfaceConfigDraft): Promise<NetworkInterface> {
    const list = store[deviceId];
    const idx = list?.findIndex((i) => i.id === interfaceId) ?? -1;
    if (!list || idx === -1) {
      return simulateRequest(null as never, { failWith: "Interface not found" });
    }
    if (draft.ipv4 && !isValidIPv4(draft.ipv4)) {
      return simulateRequest(null as never, { failWith: "Configuration validation failed — invalid IPv4 address" });
    }
    const updated: NetworkInterface = {
      ...list[idx],
      description: draft.description,
      ipv4: draft.ipv4 || undefined,
      prefix: draft.ipv4 ? draft.prefix : undefined,
      status: draft.adminStatus === "up" ? "up" : "admin-down",
      protocol: draft.adminStatus === "up" ? "up" : "down",
      speed: draft.speed,
      duplex: draft.duplex,
      mode: draft.mode,
      vlan: draft.mode === "access" ? draft.vlan : undefined,
    };
    list[idx] = updated;
    return simulateRequest(cloneData(updated), { latencyMs: 600 });
  },
};

function prefixToMask(prefix: number): string {
  const bits = Array.from({ length: 32 }, (_, i) => (i < prefix ? 1 : 0));
  const octets = [0, 1, 2, 3].map((o) =>
    parseInt(bits.slice(o * 8, o * 8 + 8).join(""), 2).toString()
  );
  return octets.join(".");
}

function isValidIPv4(value: string): boolean {
  const m = value.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  return !!m && m.slice(1).every((o) => Number(o) >= 0 && Number(o) <= 255);
}
