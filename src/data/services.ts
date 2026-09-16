import { DhcpPool, DnsConfig, NtpServer, SnmpConfig } from "../types/service";

export const DHCP_POOLS: DhcpPool[] = [
  { id: "dhcp-1", deviceId: "core-sw-01", name: "DATA-POOL", network: "10.10.0.0/24", gateway: "10.10.0.1", dns: ["10.0.0.53", "1.1.1.1"], leaseRangeStart: "10.10.0.50", leaseRangeEnd: "10.10.0.250", activeLeases: 96, totalAddresses: 201 },
  { id: "dhcp-2", deviceId: "core-sw-01", name: "VOICE-POOL", network: "10.20.0.0/24", gateway: "10.20.0.1", dns: ["10.0.0.53"], leaseRangeStart: "10.20.0.20", leaseRangeEnd: "10.20.0.200", activeLeases: 34, totalAddresses: 181 },
  { id: "dhcp-3", deviceId: "core-sw-01", name: "GUEST-POOL", network: "10.30.0.0/24", gateway: "10.30.0.1", dns: ["1.1.1.1", "8.8.8.8"], leaseRangeStart: "10.30.0.10", leaseRangeEnd: "10.30.0.250", activeLeases: 12, totalAddresses: 241 },
];

export const DNS_CONFIGS: DnsConfig[] = [
  {
    deviceId: "core-rtr-01",
    servers: ["10.0.0.53", "1.1.1.1"],
    lookupStatus: "operational",
    entries: [
      { id: "dns-1", deviceId: "core-rtr-01", hostname: "core-rtr-01.lab.local", ip: "10.0.0.1", type: "A" },
      { id: "dns-2", deviceId: "core-rtr-01", hostname: "core-sw-01.lab.local", ip: "10.0.0.2", type: "A" },
    ],
  },
];

export const NTP_SERVERS: NtpServer[] = [
  { id: "ntp-1", deviceId: "core-rtr-01", address: "10.0.0.53", stratum: 2, offsetMs: 0.4, synchronized: true },
  { id: "ntp-2", deviceId: "core-rtr-01", address: "pool.ntp.org", stratum: 3, offsetMs: 12.1, synchronized: true },
  { id: "ntp-3", deviceId: "edge-rtr-01", address: "10.0.0.53", stratum: 2, offsetMs: 890.2, synchronized: false },
];

export const SNMP_CONFIGS: SnmpConfig[] = [
  {
    deviceId: "core-rtr-01",
    version: "v2c",
    status: "enabled",
    maskedCommunity: "••••••••",
    targets: [{ id: "snmp-t1", address: "10.0.0.50", port: 162 }],
  },
  {
    deviceId: "core-sw-01",
    version: "v3",
    status: "enabled",
    maskedCommunity: "••••••••",
    targets: [{ id: "snmp-t2", address: "10.0.0.50", port: 162 }],
  },
];
