import { DHCP_POOLS, DNS_CONFIGS, NTP_SERVERS, SNMP_CONFIGS } from "../../data/services";
import { cloneData, simulateRequest } from "./mockClient";

/** Named to avoid clashing with the `services/` folder itself — covers DHCP/DNS/NTP/SNMP (§12). */
export const networkServicesService = {
  listDhcpPools(deviceId: string) {
    return simulateRequest(cloneData(DHCP_POOLS.filter((p) => p.deviceId === deviceId)));
  },
  getDns(deviceId: string) {
    return simulateRequest(cloneData(DNS_CONFIGS.find((d) => d.deviceId === deviceId) ?? null));
  },
  listNtp(deviceId: string) {
    return simulateRequest(cloneData(NTP_SERVERS.filter((n) => n.deviceId === deviceId)));
  },
  getSnmp(deviceId: string) {
    return simulateRequest(cloneData(SNMP_CONFIGS.find((s) => s.deviceId === deviceId) ?? null));
  },
};
