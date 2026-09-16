import { TopologyLink, TopologyNode } from "../types/topology";

/** Mirrors the 5 mock devices, arranged core → distribution → access/branch (§14). */
export const TOPOLOGY_NODES: TopologyNode[] = [
  { id: "node-core-rtr-01", deviceId: "core-rtr-01", hostname: "CORE-RTR-01", type: "router", status: "online", managementIp: "10.0.0.1", x: 320, y: 40 },
  { id: "node-core-sw-01", deviceId: "core-sw-01", hostname: "CORE-SW-01", type: "switch", status: "online", managementIp: "10.0.0.2", x: 320, y: 170 },
  { id: "node-access-sw-01", deviceId: "access-sw-01", hostname: "ACCESS-SW-01", type: "switch", status: "warning", managementIp: "10.0.1.10", x: 160, y: 300 },
  { id: "node-edge-rtr-01", deviceId: "edge-rtr-01", hostname: "EDGE-RTR-01", type: "router", status: "error", managementIp: "203.0.113.1", x: 480, y: 300 },
  { id: "node-branch-sw-01", deviceId: "branch-sw-01", hostname: "BRANCH-SW-01", type: "switch", status: "offline", managementIp: "10.0.4.5", x: 480, y: 420 },
];

export const TOPOLOGY_LINKS: TopologyLink[] = [
  { id: "link-1", sourceNodeId: "node-core-rtr-01", targetNodeId: "node-core-sw-01", sourceInterface: "Gi0/0/2", targetInterface: "Te1/0/1", status: "up", speed: "1G" },
  { id: "link-2", sourceNodeId: "node-core-sw-01", targetNodeId: "node-access-sw-01", sourceInterface: "Te1/0/2", targetInterface: "Gi0/24", status: "up", speed: "10G" },
  { id: "link-3", sourceNodeId: "node-core-rtr-01", targetNodeId: "node-edge-rtr-01", sourceInterface: "Gi0/0/3", targetInterface: "Gi0/0/0", status: "down", speed: "1G" },
  { id: "link-4", sourceNodeId: "node-core-sw-01", targetNodeId: "node-branch-sw-01", sourceInterface: "Te1/0/3", targetInterface: "Gi0/12", status: "down", speed: "10G" },
];
