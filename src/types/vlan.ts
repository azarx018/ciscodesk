export interface Vlan {
  id: string;
  deviceId: string;
  vlanId: number;
  name: string;
  status: "active" | "suspended";
  ports: string[]; // interface names assigned to this VLAN
}

export interface MacAddressEntry {
  id: string;
  deviceId: string;
  macAddress: string;
  vlan: number;
  interfaceName: string;
  type: "dynamic" | "static";
  age: number; // minutes, 0 for static
}

export type StpPortRole = "root" | "designated" | "alternate" | "backup" | "disabled";
export type StpPortState = "forwarding" | "blocking" | "listening" | "learning" | "disabled";

export interface StpVlanState {
  id: string;
  deviceId: string;
  vlan: number;
  rootBridge: string; // MAC/priority string
  rootPort: string | null;
  bridgeId: string;
  ports: {
    interfaceName: string;
    role: StpPortRole;
    state: StpPortState;
    pathCost: number;
  }[];
}
