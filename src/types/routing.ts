export type RouteProtocol = "connected" | "static" | "ospf" | "bgp" | "eigrp";

export interface RouteEntry {
  id: string;
  deviceId: string;
  protocol: RouteProtocol;
  prefix: string; // "10.0.1.0/24"
  nextHop: string;
  interfaceName: string;
  metric: number;
  adminDistance: number;
}

export interface StaticRoute {
  id: string;
  deviceId: string;
  destination: string;
  prefix: number;
  nextHop: string;
  adminDistance: number;
  description?: string;
}

export type OspfNeighborState = "Full" | "2-Way" | "Init" | "Down" | "ExStart" | "Exchange";

export interface OspfNeighbor {
  id: string;
  deviceId: string;
  neighborId: string;
  address: string;
  interfaceName: string;
  area: string;
  state: OspfNeighborState;
  uptime: string;
}

export interface OspfProcess {
  deviceId: string;
  processId: number;
  routerId: string;
  areas: string[];
}

export type BgpNeighborState = "Established" | "Idle" | "Connect" | "Active" | "OpenSent" | "OpenConfirm";

export interface BgpNeighbor {
  id: string;
  deviceId: string;
  neighborIp: string;
  remoteAs: number;
  state: BgpNeighborState;
  prefixesReceived: number;
  prefixesAdvertised: number;
  uptime: string;
}

export interface BgpProcess {
  deviceId: string;
  localAs: number;
  routerId: string;
}
