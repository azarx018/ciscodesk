import { MAC_TABLE, STP_STATE, VLANS } from "../../data/vlans";
import { MacAddressEntry, StpVlanState, Vlan } from "../../types/vlan";
import { cloneData, simulateRequest } from "./mockClient";

let vlans: Vlan[] = cloneData(VLANS);

export const switchingService = {
  listVlans(deviceId: string): Promise<Vlan[]> {
    return simulateRequest(cloneData(vlans.filter((v) => v.deviceId === deviceId)));
  },
  createVlan(input: Omit<Vlan, "id">): Promise<Vlan> {
    const created: Vlan = { ...input, id: `${input.deviceId}-vlan-${input.vlanId}` };
    vlans = [...vlans, created];
    return simulateRequest(cloneData(created));
  },
  updateVlan(id: string, patch: Partial<Vlan>): Promise<Vlan> {
    const idx = vlans.findIndex((v) => v.id === id);
    if (idx === -1) return simulateRequest(null as never, { failWith: "VLAN not found" });
    vlans[idx] = { ...vlans[idx], ...patch };
    return simulateRequest(cloneData(vlans[idx]));
  },
  deleteVlan(id: string): Promise<{ id: string }> {
    vlans = vlans.filter((v) => v.id !== id);
    return simulateRequest({ id });
  },
  listMacTable(deviceId: string): Promise<MacAddressEntry[]> {
    return simulateRequest(cloneData(MAC_TABLE.filter((m) => m.deviceId === deviceId)));
  },
  listStp(deviceId: string): Promise<StpVlanState[]> {
    return simulateRequest(cloneData(STP_STATE.filter((s) => s.deviceId === deviceId)));
  },
};
