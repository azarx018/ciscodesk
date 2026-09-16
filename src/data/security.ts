import { AclRule, NatEntry, PortSecurityEntry } from "../types/security";

export const ACL_RULES: AclRule[] = [
  { id: "acl-1", deviceId: "edge-rtr-01", aclName: "OUTSIDE-IN", sequence: 10, action: "deny", protocol: "ip", source: "10.0.0.0/8", destination: "any", logging: true },
  { id: "acl-2", deviceId: "edge-rtr-01", aclName: "OUTSIDE-IN", sequence: 20, action: "permit", protocol: "tcp", source: "any", destination: "203.0.113.2", destinationPort: "443", logging: false },
  { id: "acl-3", deviceId: "edge-rtr-01", aclName: "OUTSIDE-IN", sequence: 30, action: "permit", protocol: "tcp", source: "any", destination: "203.0.113.2", destinationPort: "22", logging: true },
  { id: "acl-4", deviceId: "edge-rtr-01", aclName: "OUTSIDE-IN", sequence: 1000, action: "deny", protocol: "ip", source: "any", destination: "any", logging: true },
  { id: "acl-5", deviceId: "core-sw-01", aclName: "GUEST-RESTRICT", sequence: 10, action: "deny", protocol: "ip", source: "10.30.0.0/24", destination: "10.10.0.0/24", logging: true },
  { id: "acl-6", deviceId: "core-sw-01", aclName: "GUEST-RESTRICT", sequence: 20, action: "deny", protocol: "ip", source: "10.30.0.0/24", destination: "10.20.0.0/24", logging: true },
  { id: "acl-7", deviceId: "core-sw-01", aclName: "GUEST-RESTRICT", sequence: 1000, action: "permit", protocol: "ip", source: "any", destination: "any", logging: false },
];

export const NAT_ENTRIES: NatEntry[] = [
  { id: "nat-1", deviceId: "edge-rtr-01", insideInterface: "GigabitEthernet0/1/0", outsideInterface: "GigabitEthernet0/0/0", localAddress: "10.0.4.0/24", globalAddress: "203.0.113.2", type: "pat", status: "active" },
  { id: "nat-2", deviceId: "core-rtr-01", insideInterface: "GigabitEthernet0/0/2", outsideInterface: "GigabitEthernet0/0/0", localAddress: "10.10.0.0/24", globalAddress: "203.0.113.2", type: "pat", status: "active" },
  { id: "nat-3", deviceId: "core-rtr-01", insideInterface: "GigabitEthernet0/0/2", outsideInterface: "GigabitEthernet0/0/1", localAddress: "10.20.10.5", globalAddress: "198.51.100.9", type: "static", status: "inactive" },
];

export const PORT_SECURITY: PortSecurityEntry[] = [
  { id: "psec-1", deviceId: "access-sw-01", interfaceName: "GigabitEthernet0/1", status: "enabled", maxMac: 2, learnedMac: 1, violationMode: "restrict", violationCount: 0 },
  { id: "psec-2", deviceId: "access-sw-01", interfaceName: "GigabitEthernet0/2", status: "enabled", maxMac: 3, learnedMac: 2, violationMode: "restrict", violationCount: 0 },
  { id: "psec-3", deviceId: "access-sw-01", interfaceName: "GigabitEthernet0/5", status: "enabled", maxMac: 1, learnedMac: 1, violationMode: "shutdown", violationCount: 3 },
];
