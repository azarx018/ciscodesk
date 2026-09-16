import { Backup, ConfigHistoryEntry, ConfigSnapshot, FirmwareInfo } from "../types/system";

export const BACKUPS: Backup[] = [
  { id: "bk-1", deviceId: "core-rtr-01", label: "Nightly backup", timestamp: "2026-09-17T00:00:00Z", status: "completed", sizeKb: 84, user: "admin" },
  { id: "bk-2", deviceId: "core-rtr-01", label: "Pre-change backup", timestamp: "2026-09-15T14:22:00Z", status: "completed", sizeKb: 83, user: "n.wardana" },
  { id: "bk-3", deviceId: "core-sw-01", label: "Nightly backup", timestamp: "2026-09-17T00:00:00Z", status: "completed", sizeKb: 61, user: "admin" },
  { id: "bk-4", deviceId: "branch-sw-01", label: "Nightly backup", timestamp: "2026-09-17T00:00:00Z", status: "failed", sizeKb: 0, user: "admin" },
];

export const FIRMWARE: FirmwareInfo[] = [
  { deviceId: "core-rtr-01", currentVersion: "17.09.04a", availableVersion: "17.09.05", releaseStatus: "update-available", imageName: "asr1001x-universalk9.17.09.05.SPA.bin", imageSizeMb: 842 },
  { deviceId: "core-sw-01", currentVersion: "17.06.05", availableVersion: null, releaseStatus: "up-to-date", imageName: "cat9k_iosxe.17.06.05.SPA.bin", imageSizeMb: 690 },
  { deviceId: "access-sw-01", currentVersion: "15.2(7)E9", availableVersion: "15.2(7)E10", releaseStatus: "update-available", imageName: "c2960x-universalk9-mz.152-7.E10.bin", imageSizeMb: 24 },
  { deviceId: "edge-rtr-01", currentVersion: "17.09.02", availableVersion: "17.09.05", releaseStatus: "update-available", imageName: "isr4300-universalk9.17.09.05.SPA.bin", imageSizeMb: 610 },
  { deviceId: "branch-sw-01", currentVersion: "15.2(7)E7", availableVersion: null, releaseStatus: "unsupported", imageName: "c2960l-universalk9-mz.152-7.E7.bin", imageSizeMb: 18 },
];

export const CONFIG_SNAPSHOTS: ConfigSnapshot[] = [
  {
    deviceId: "core-rtr-01",
    running: `hostname CORE-RTR-01
!
interface GigabitEthernet0/0/0
 description ISP-UPLINK-PRIMARY
 ip address 203.0.113.2 255.255.255.252
 no shutdown
!
router ospf 1
 router-id 10.255.255.1
 network 10.255.0.0 0.0.0.3 area 0
!
end`,
    startup: `hostname CORE-RTR-01
!
interface GigabitEthernet0/0/0
 description ISP-UPLINK-PRIMARY
 ip address 203.0.113.2 255.255.255.252
 no shutdown
!
end`,
    lastChanged: "2026-09-16T18:00:00Z",
  },
];

export const CONFIG_HISTORY: ConfigHistoryEntry[] = [
  { id: "cfg-1", deviceId: "core-rtr-01", timestamp: "2026-09-16T18:00:00Z", user: "admin", summary: "Added OSPF network statement for area 0" },
  { id: "cfg-2", deviceId: "core-rtr-01", timestamp: "2026-09-10T09:12:00Z", user: "n.wardana", summary: "Updated description on GigabitEthernet0/0/0" },
];
