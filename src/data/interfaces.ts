import { NetworkInterface } from "../types/interface";

let counter = 0;
function nextId(prefix: string): string {
  counter += 1;
  return `${prefix}-if-${counter}`;
}

function iface(partial: Omit<NetworkInterface, "id">): NetworkInterface {
  return { id: nextId(partial.deviceId), ...partial };
}

/**
 * Fills out the remaining, unremarkable ports on a device so the
 * interface count matches Device.interfaceCount, without hand-typing
 * dozens of near-identical rows. Notable ports (uplinks, SVIs, WAN)
 * are declared explicitly below and passed in as `existing`.
 */
function fillRemainingSwitchports(
  deviceId: string,
  totalCount: number,
  existing: NetworkInterface[],
  namePrefix: string,
  defaultVlan: number
): NetworkInterface[] {
  const used = new Set(existing.map((i) => i.name));
  const out = [...existing];
  let n = 1;
  while (out.length < totalCount) {
    const name = `${namePrefix}0/${n}`;
    n += 1;
    if (used.has(name)) continue;
    const isUp = Math.random() > 0.35;
    out.push(
      iface({
        deviceId,
        name,
        description: "",
        status: isUp ? "up" : "down",
        protocol: isUp ? "up" : "down",
        speed: "1000",
        duplex: "full",
        vlan: defaultVlan,
        mode: "access",
        rxBps: isUp ? Math.floor(Math.random() * 5_000_000) : 0,
        txBps: isUp ? Math.floor(Math.random() * 3_000_000) : 0,
        rxErrors: 0,
        txErrors: 0,
        crcErrors: 0,
      })
    );
  }
  return out.slice(0, totalCount);
}

// --- CORE-RTR-01 (Cisco ASR1001-X, 24 interfaces) -----------------------
const coreRtr01Notable: NetworkInterface[] = [
  iface({
    deviceId: "core-rtr-01",
    name: "GigabitEthernet0/0/0",
    description: "ISP-UPLINK-PRIMARY",
    status: "up",
    protocol: "up",
    speed: "1000",
    duplex: "full",
    ipv4: "203.0.113.2",
    prefix: 30,
    mode: "routed",
    rxBps: 412_000_000,
    txBps: 88_000_000,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
  iface({
    deviceId: "core-rtr-01",
    name: "GigabitEthernet0/0/1",
    description: "ISP-UPLINK-SECONDARY",
    status: "up",
    protocol: "up",
    speed: "1000",
    duplex: "full",
    ipv4: "198.51.100.2",
    prefix: 30,
    mode: "routed",
    rxBps: 21_000_000,
    txBps: 9_000_000,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
  iface({
    deviceId: "core-rtr-01",
    name: "GigabitEthernet0/0/2",
    description: "TO-CORE-SW-01",
    status: "up",
    protocol: "up",
    speed: "1000",
    duplex: "full",
    ipv4: "10.255.0.1",
    prefix: 30,
    mode: "routed",
    rxBps: 180_000_000,
    txBps: 210_000_000,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
  iface({
    deviceId: "core-rtr-01",
    name: "GigabitEthernet0/0/3",
    description: "TO-EDGE-RTR-01",
    status: "down",
    protocol: "down",
    speed: "1000",
    duplex: "full",
    ipv4: "10.255.0.5",
    prefix: 30,
    mode: "routed",
    rxBps: 0,
    txBps: 0,
    rxErrors: 12,
    txErrors: 0,
    crcErrors: 3,
  }),
  iface({
    deviceId: "core-rtr-01",
    name: "Loopback0",
    description: "OSPF/BGP router-id",
    status: "up",
    protocol: "up",
    speed: "auto",
    duplex: "full",
    ipv4: "10.255.255.1",
    prefix: 32,
    mode: "routed",
    rxBps: 0,
    txBps: 0,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
];
export const CORE_RTR_01_INTERFACES = fillRemainingSwitchports(
  "core-rtr-01",
  24,
  coreRtr01Notable,
  "GigabitEthernet0/1/",
  1
).map((i) => (i.mode === "access" && !i.description ? { ...i, mode: "routed" as const, vlan: undefined } : i));

// --- CORE-SW-01 (Catalyst 9300-48P, 48 interfaces) ----------------------
const coreSw01Notable: NetworkInterface[] = [
  iface({
    deviceId: "core-sw-01",
    name: "TenGigabitEthernet1/0/1",
    description: "TO-CORE-RTR-01",
    status: "up",
    protocol: "up",
    speed: "10000",
    duplex: "full",
    ipv4: "10.255.0.2",
    prefix: 30,
    mode: "routed",
    rxBps: 210_000_000,
    txBps: 180_000_000,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
  iface({
    deviceId: "core-sw-01",
    name: "TenGigabitEthernet1/0/2",
    description: "TO-ACCESS-SW-01",
    status: "up",
    protocol: "up",
    speed: "10000",
    duplex: "full",
    vlan: 99,
    mode: "trunk",
    rxBps: 95_000_000,
    txBps: 112_000_000,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
  iface({
    deviceId: "core-sw-01",
    name: "TenGigabitEthernet1/0/3",
    description: "TO-BRANCH-SW-01 (VPN)",
    status: "down",
    protocol: "down",
    speed: "10000",
    duplex: "full",
    vlan: 99,
    mode: "trunk",
    rxBps: 0,
    txBps: 0,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
  iface({
    deviceId: "core-sw-01",
    name: "Vlan10",
    description: "Data-SVI",
    status: "up",
    protocol: "up",
    speed: "auto",
    duplex: "full",
    ipv4: "10.10.0.1",
    prefix: 24,
    vlan: 10,
    mode: "routed",
    rxBps: 0,
    txBps: 0,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
  iface({
    deviceId: "core-sw-01",
    name: "Vlan20",
    description: "Voice-SVI",
    status: "up",
    protocol: "up",
    speed: "auto",
    duplex: "full",
    ipv4: "10.20.0.1",
    prefix: 24,
    vlan: 20,
    mode: "routed",
    rxBps: 0,
    txBps: 0,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
  iface({
    deviceId: "core-sw-01",
    name: "Vlan30",
    description: "Guest-SVI",
    status: "up",
    protocol: "up",
    speed: "auto",
    duplex: "full",
    ipv4: "10.30.0.1",
    prefix: 24,
    vlan: 30,
    mode: "routed",
    rxBps: 0,
    txBps: 0,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
];
export const CORE_SW_01_INTERFACES = fillRemainingSwitchports(
  "core-sw-01",
  48,
  coreSw01Notable,
  "GigabitEthernet1/0/",
  10
);

// --- ACCESS-SW-01 (Catalyst 2960X-24TS-L, 24 interfaces) ----------------
const accessSw01Notable: NetworkInterface[] = [
  iface({
    deviceId: "access-sw-01",
    name: "GigabitEthernet0/24",
    description: "UPLINK-TO-CORE-SW-01",
    status: "up",
    protocol: "up",
    speed: "1000",
    duplex: "full",
    vlan: 99,
    mode: "trunk",
    rxBps: 112_000_000,
    txBps: 95_000_000,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
  iface({
    deviceId: "access-sw-01",
    name: "GigabitEthernet0/1",
    description: "Reception-desk",
    status: "up",
    protocol: "up",
    speed: "1000",
    duplex: "full",
    vlan: 10,
    mode: "access",
    rxBps: 2_100_000,
    txBps: 900_000,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
  iface({
    deviceId: "access-sw-01",
    name: "GigabitEthernet0/2",
    description: "IP-Phone + PC",
    status: "up",
    protocol: "up",
    speed: "1000",
    duplex: "full",
    vlan: 20,
    mode: "access",
    rxBps: 640_000,
    txBps: 610_000,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
];
export const ACCESS_SW_01_INTERFACES = fillRemainingSwitchports(
  "access-sw-01",
  24,
  accessSw01Notable,
  "GigabitEthernet0/",
  10
);

// --- EDGE-RTR-01 (ISR4331, 8 interfaces) --------------------------------
export const EDGE_RTR_01_INTERFACES: NetworkInterface[] = [
  iface({
    deviceId: "edge-rtr-01",
    name: "GigabitEthernet0/0/0",
    description: "TO-CORE-RTR-01",
    status: "up",
    protocol: "down",
    speed: "1000",
    duplex: "full",
    ipv4: "10.255.0.6",
    prefix: 30,
    mode: "routed",
    rxBps: 0,
    txBps: 0,
    rxErrors: 340,
    txErrors: 12,
    crcErrors: 87,
  }),
  iface({
    deviceId: "edge-rtr-01",
    name: "GigabitEthernet0/0/1",
    description: "MPLS-WAN",
    status: "down",
    protocol: "down",
    speed: "1000",
    duplex: "full",
    ipv4: "192.0.2.9",
    prefix: 30,
    mode: "routed",
    rxBps: 0,
    txBps: 0,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
  ...Array.from({ length: 6 }).map((_, i) =>
    iface({
      deviceId: "edge-rtr-01",
      name: `GigabitEthernet0/1/${i}`,
      description: "",
      status: "admin-down",
      protocol: "down",
      speed: "1000",
      duplex: "auto",
      mode: "routed",
      rxBps: 0,
      txBps: 0,
      rxErrors: 0,
      txErrors: 0,
      crcErrors: 0,
    })
  ),
];

// --- BRANCH-SW-01 (Catalyst 2960L-12PS-LL, 12 interfaces) ---------------
const branchSw01Notable: NetworkInterface[] = [
  iface({
    deviceId: "branch-sw-01",
    name: "GigabitEthernet0/12",
    description: "UPLINK-VPN-TO-CORE",
    status: "down",
    protocol: "down",
    speed: "1000",
    duplex: "full",
    vlan: 99,
    mode: "trunk",
    rxBps: 0,
    txBps: 0,
    rxErrors: 0,
    txErrors: 0,
    crcErrors: 0,
  }),
];
export const BRANCH_SW_01_INTERFACES = fillRemainingSwitchports(
  "branch-sw-01",
  12,
  branchSw01Notable,
  "GigabitEthernet0/",
  10
).map((i) => ({ ...i, status: "down" as const, protocol: "down" as const, rxBps: 0, txBps: 0 }));

export const INTERFACES_BY_DEVICE: Record<string, NetworkInterface[]> = {
  "core-rtr-01": CORE_RTR_01_INTERFACES,
  "core-sw-01": CORE_SW_01_INTERFACES,
  "access-sw-01": ACCESS_SW_01_INTERFACES,
  "edge-rtr-01": EDGE_RTR_01_INTERFACES,
  "branch-sw-01": BRANCH_SW_01_INTERFACES,
};
