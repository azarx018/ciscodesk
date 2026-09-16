export interface DhcpPool {
  id: string;
  deviceId: string;
  name: string;
  network: string;
  gateway: string;
  dns: string[];
  leaseRangeStart: string;
  leaseRangeEnd: string;
  activeLeases: number;
  totalAddresses: number;
}

export interface DnsEntry {
  id: string;
  deviceId: string;
  hostname: string;
  ip: string;
  type: "A" | "PTR" | "CNAME";
}

export interface DnsConfig {
  deviceId: string;
  servers: string[];
  lookupStatus: "operational" | "degraded" | "failed";
  entries: DnsEntry[];
}

export interface NtpServer {
  id: string;
  deviceId: string;
  address: string;
  stratum: number;
  offsetMs: number;
  synchronized: boolean;
}

export interface SnmpTarget {
  id: string;
  address: string;
  port: number;
}

export interface SnmpConfig {
  deviceId: string;
  version: "v2c" | "v3";
  status: "enabled" | "disabled";
  maskedCommunity: string; // e.g. "••••••••"
  targets: SnmpTarget[];
}
