export type AclAction = "permit" | "deny";
export type AclProtocol = "ip" | "tcp" | "udp" | "icmp";

export interface AclRule {
  id: string;
  deviceId: string;
  aclName: string;
  sequence: number;
  action: AclAction;
  protocol: AclProtocol;
  source: string;
  destination: string;
  sourcePort?: string;
  destinationPort?: string;
  logging: boolean;
}

export interface NatEntry {
  id: string;
  deviceId: string;
  insideInterface: string;
  outsideInterface: string;
  localAddress: string;
  globalAddress: string;
  type: "static" | "dynamic" | "pat";
  status: "active" | "inactive";
}

export type PortSecurityViolationMode = "protect" | "restrict" | "shutdown";

export interface PortSecurityEntry {
  id: string;
  deviceId: string;
  interfaceName: string;
  status: "enabled" | "disabled";
  maxMac: number;
  learnedMac: number;
  violationMode: PortSecurityViolationMode;
  violationCount: number;
}
