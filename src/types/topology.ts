export interface TopologyNode {
  id: string;
  deviceId: string;
  hostname: string;
  type: "router" | "switch";
  status: "online" | "warning" | "error" | "offline";
  managementIp: string;
  x: number;
  y: number;
}

export interface TopologyLink {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceInterface: string;
  targetInterface: string;
  status: "up" | "down" | "degraded";
  speed: string;
}
