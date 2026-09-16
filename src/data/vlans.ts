import { MacAddressEntry, StpVlanState, Vlan } from "../types/vlan";

/**
 * VLANs 10/20/30/99 are used consistently across interfaces.ts
 * (access port VLAN assignment, SVIs), macTable.ts, and stp.ts —
 * per §23, related pages must agree with each other.
 */
export const VLANS: Vlan[] = [
  { id: "core-sw-01-vlan-1", deviceId: "core-sw-01", vlanId: 1, name: "default", status: "active", ports: [] },
  {
    id: "core-sw-01-vlan-10",
    deviceId: "core-sw-01",
    vlanId: 10,
    name: "DATA",
    status: "active",
    ports: ["GigabitEthernet1/0/3", "GigabitEthernet1/0/4", "GigabitEthernet1/0/5"],
  },
  {
    id: "core-sw-01-vlan-20",
    deviceId: "core-sw-01",
    vlanId: 20,
    name: "VOICE",
    status: "active",
    ports: ["GigabitEthernet1/0/6", "GigabitEthernet1/0/7"],
  },
  {
    id: "core-sw-01-vlan-30",
    deviceId: "core-sw-01",
    vlanId: 30,
    name: "GUEST",
    status: "active",
    ports: ["GigabitEthernet1/0/8"],
  },
  {
    id: "core-sw-01-vlan-99",
    deviceId: "core-sw-01",
    vlanId: 99,
    name: "MGMT-NATIVE",
    status: "active",
    ports: ["TenGigabitEthernet1/0/2", "TenGigabitEthernet1/0/3"],
  },
  {
    id: "access-sw-01-vlan-10",
    deviceId: "access-sw-01",
    vlanId: 10,
    name: "DATA",
    status: "active",
    ports: ["GigabitEthernet0/1", "GigabitEthernet0/3", "GigabitEthernet0/4"],
  },
  {
    id: "access-sw-01-vlan-20",
    deviceId: "access-sw-01",
    vlanId: 20,
    name: "VOICE",
    status: "active",
    ports: ["GigabitEthernet0/2"],
  },
  {
    id: "access-sw-01-vlan-30",
    deviceId: "access-sw-01",
    vlanId: 30,
    name: "GUEST",
    status: "suspended",
    ports: [],
  },
  {
    id: "access-sw-01-vlan-99",
    deviceId: "access-sw-01",
    vlanId: 99,
    name: "MGMT-NATIVE",
    status: "active",
    ports: ["GigabitEthernet0/24"],
  },
];

export const MAC_TABLE: MacAddressEntry[] = [
  { id: "mac-1", deviceId: "access-sw-01", macAddress: "58:8B:8D:12:AA:01", vlan: 10, interfaceName: "GigabitEthernet0/1", type: "dynamic", age: 4 },
  { id: "mac-2", deviceId: "access-sw-01", macAddress: "58:8B:8D:12:AA:02", vlan: 20, interfaceName: "GigabitEthernet0/2", type: "dynamic", age: 1 },
  { id: "mac-3", deviceId: "access-sw-01", macAddress: "58:8B:8D:12:AA:03", vlan: 10, interfaceName: "GigabitEthernet0/3", type: "dynamic", age: 12 },
  { id: "mac-4", deviceId: "access-sw-01", macAddress: "00:1A:2B:99:FE:10", vlan: 99, interfaceName: "GigabitEthernet0/24", type: "static", age: 0 },
  { id: "mac-5", deviceId: "core-sw-01", macAddress: "AC:F2:C5:6D:11:0A", vlan: 10, interfaceName: "GigabitEthernet1/0/3", type: "dynamic", age: 7 },
  { id: "mac-6", deviceId: "core-sw-01", macAddress: "AC:F2:C5:6D:11:0B", vlan: 20, interfaceName: "GigabitEthernet1/0/6", type: "dynamic", age: 2 },
  { id: "mac-7", deviceId: "core-sw-01", macAddress: "00:1A:2B:99:FE:01", vlan: 99, interfaceName: "TenGigabitEthernet1/0/2", type: "static", age: 0 },
];

export const STP_STATE: StpVlanState[] = [
  {
    id: "stp-core-sw-01-10",
    deviceId: "core-sw-01",
    vlan: 10,
    rootBridge: "32778.ACF2.C56D.1100",
    rootPort: null,
    bridgeId: "32778.ACF2.C56D.1100",
    ports: [
      { interfaceName: "TenGigabitEthernet1/0/1", role: "designated", state: "forwarding", pathCost: 4 },
      { interfaceName: "TenGigabitEthernet1/0/2", role: "designated", state: "forwarding", pathCost: 4 },
      { interfaceName: "GigabitEthernet1/0/3", role: "designated", state: "forwarding", pathCost: 19 },
    ],
  },
  {
    id: "stp-access-sw-01-10",
    deviceId: "access-sw-01",
    vlan: 10,
    rootBridge: "32778.ACF2.C56D.1100",
    rootPort: "GigabitEthernet0/24",
    bridgeId: "32778.588B.8D12.AA00",
    ports: [
      { interfaceName: "GigabitEthernet0/24", role: "root", state: "forwarding", pathCost: 19 },
      { interfaceName: "GigabitEthernet0/1", role: "designated", state: "forwarding", pathCost: 19 },
      { interfaceName: "GigabitEthernet0/3", role: "designated", state: "forwarding", pathCost: 19 },
    ],
  },
];
