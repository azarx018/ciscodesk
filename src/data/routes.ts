import { BgpNeighbor, BgpProcess, OspfNeighbor, OspfProcess, RouteEntry, StaticRoute } from "../types/routing";

export const ROUTES: RouteEntry[] = [
  { id: "rt-1", deviceId: "core-rtr-01", protocol: "connected", prefix: "203.0.113.0/30", nextHop: "—", interfaceName: "GigabitEthernet0/0/0", metric: 0, adminDistance: 0 },
  { id: "rt-2", deviceId: "core-rtr-01", protocol: "connected", prefix: "10.255.0.0/30", nextHop: "—", interfaceName: "GigabitEthernet0/0/2", metric: 0, adminDistance: 0 },
  { id: "rt-3", deviceId: "core-rtr-01", protocol: "ospf", prefix: "10.10.0.0/24", nextHop: "10.255.0.2", interfaceName: "GigabitEthernet0/0/2", metric: 20, adminDistance: 110 },
  { id: "rt-4", deviceId: "core-rtr-01", protocol: "ospf", prefix: "10.20.0.0/24", nextHop: "10.255.0.2", interfaceName: "GigabitEthernet0/0/2", metric: 20, adminDistance: 110 },
  { id: "rt-5", deviceId: "core-rtr-01", protocol: "static", prefix: "10.0.4.0/24", nextHop: "10.255.0.6", interfaceName: "GigabitEthernet0/0/3", metric: 0, adminDistance: 1 },
  { id: "rt-6", deviceId: "core-rtr-01", protocol: "bgp", prefix: "0.0.0.0/0", nextHop: "203.0.113.1", interfaceName: "GigabitEthernet0/0/0", metric: 0, adminDistance: 20 },
  { id: "rt-7", deviceId: "core-sw-01", protocol: "connected", prefix: "10.10.0.0/24", nextHop: "—", interfaceName: "Vlan10", metric: 0, adminDistance: 0 },
  { id: "rt-8", deviceId: "core-sw-01", protocol: "connected", prefix: "10.20.0.0/24", nextHop: "—", interfaceName: "Vlan20", metric: 0, adminDistance: 0 },
  { id: "rt-9", deviceId: "core-sw-01", protocol: "connected", prefix: "10.30.0.0/24", nextHop: "—", interfaceName: "Vlan30", metric: 0, adminDistance: 0 },
  { id: "rt-10", deviceId: "core-sw-01", protocol: "ospf", prefix: "0.0.0.0/0", nextHop: "10.255.0.1", interfaceName: "TenGigabitEthernet1/0/1", metric: 20, adminDistance: 110 },
];

export const STATIC_ROUTES: StaticRoute[] = [
  { id: "sr-1", deviceId: "core-rtr-01", destination: "10.0.4.0", prefix: 24, nextHop: "10.255.0.6", adminDistance: 1, description: "BRANCH-SW-01 via EDGE-RTR-01" },
  { id: "sr-2", deviceId: "core-rtr-01", destination: "0.0.0.0", prefix: 0, nextHop: "198.51.100.1", adminDistance: 210, description: "Floating default via secondary ISP" },
];

export const OSPF_PROCESSES: OspfProcess[] = [
  { deviceId: "core-rtr-01", processId: 1, routerId: "10.255.255.1", areas: ["0.0.0.0"] },
  { deviceId: "core-sw-01", processId: 1, routerId: "10.255.255.2", areas: ["0.0.0.0"] },
];

export const OSPF_NEIGHBORS: OspfNeighbor[] = [
  { id: "ospf-1", deviceId: "core-rtr-01", neighborId: "10.255.255.2", address: "10.255.0.2", interfaceName: "GigabitEthernet0/0/2", area: "0.0.0.0", state: "Full", uptime: "17d 03h 58m" },
  { id: "ospf-2", deviceId: "core-sw-01", neighborId: "10.255.255.1", address: "10.255.0.1", interfaceName: "TenGigabitEthernet1/0/1", area: "0.0.0.0", state: "Full", uptime: "17d 03h 58m" },
];

export const BGP_PROCESSES: BgpProcess[] = [{ deviceId: "core-rtr-01", localAs: 65001, routerId: "10.255.255.1" }];

export const BGP_NEIGHBORS: BgpNeighbor[] = [
  { id: "bgp-1", deviceId: "core-rtr-01", neighborIp: "203.0.113.1", remoteAs: 64500, state: "Established", prefixesReceived: 1, prefixesAdvertised: 4, uptime: "17d 03h 40m" },
  { id: "bgp-2", deviceId: "core-rtr-01", neighborIp: "198.51.100.1", remoteAs: 64501, state: "Idle", prefixesReceived: 0, prefixesAdvertised: 0, uptime: "—" },
];
