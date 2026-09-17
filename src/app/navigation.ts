import { Icon } from "../components/icons/Icon";

export interface NavChild {
  id: string;
  label: string;
  path: string;
}

export interface NavGroup {
  id: string;
  label: string;
  icon: keyof typeof Icon;
  path?: string; // present on top-level links with no children
  children?: NavChild[];
}

/**
 * Single source of truth for the sidebar, breadcrumbs, and the
 * command palette's "navigate to" entries. Matches master prompt §3.
 */
export const NAV: NavGroup[] = [
  { id: "dashboard", label: "Dashboard", icon: "grid", path: "/dashboard" },
  {
    id: "devices",
    label: "Devices",
    icon: "layers",
    children: [
      { id: "all-devices", label: "All Devices", path: "/devices" },
      { id: "device-groups", label: "Device Groups", path: "/devices/groups" },
      { id: "add-device", label: "Add Device", path: "/devices/add" },
    ],
  },
  { id: "interfaces", label: "Interfaces", icon: "plug", path: "/interfaces" },
  {
    id: "switching",
    label: "Switching",
    icon: "switch",
    children: [
      { id: "vlans", label: "VLANs", path: "/switching/vlans" },
      { id: "mac-table", label: "MAC Address Table", path: "/switching/mac-table" },
      { id: "stp", label: "STP", path: "/switching/stp" },
    ],
  },
  {
    id: "routing",
    label: "Routing",
    icon: "route",
    children: [
      { id: "routing-table", label: "Routing Table", path: "/routing/table" },
      { id: "static-routes", label: "Static Routes", path: "/routing/static" },
      { id: "ospf", label: "OSPF", path: "/routing/ospf" },
      { id: "bgp", label: "BGP", path: "/routing/bgp" },
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: "shield",
    children: [
      { id: "acl", label: "ACL", path: "/security/acl" },
      { id: "nat", label: "NAT", path: "/security/nat" },
      { id: "port-security", label: "Port Security", path: "/security/port-security" },
    ],
  },
  {
    id: "services",
    label: "Services",
    icon: "server",
    children: [
      { id: "dhcp", label: "DHCP", path: "/services/dhcp" },
      { id: "dns", label: "DNS", path: "/services/dns" },
      { id: "ntp", label: "NTP", path: "/services/ntp" },
      { id: "snmp", label: "SNMP", path: "/services/snmp" },
    ],
  },
  {
    id: "monitoring",
    label: "Monitoring",
    icon: "activity",
    children: [
      { id: "traffic", label: "Traffic", path: "/monitoring/traffic" },
      { id: "cpu-memory", label: "CPU / Memory", path: "/monitoring/cpu-memory" },
      { id: "logs", label: "Logs", path: "/monitoring/logs" },
      { id: "health", label: "Health", path: "/monitoring/health" },
    ],
  },
  { id: "topology", label: "Topology", icon: "topology", path: "/topology" },
  {
    id: "system",
    label: "System",
    icon: "cog",
    children: [
      { id: "device-info", label: "Device Information", path: "/system/device-info" },
      { id: "users", label: "Users", path: "/system/users" },
      { id: "configuration", label: "Configuration", path: "/system/configuration" },
      { id: "backups", label: "Backups", path: "/system/backups" },
      { id: "firmware", label: "Firmware", path: "/system/firmware" },
    ],
  },
  { id: "terminal", label: "Terminal", icon: "terminal", path: "/terminal" },
];

export interface FlatNavEntry {
  id: string;
  label: string;
  path: string;
  icon: keyof typeof Icon;
  groupLabel: string | null;
}

export const FLAT_NAV: FlatNavEntry[] = (() => {
  const out: FlatNavEntry[] = [];
  NAV.forEach((group) => {
    if (group.path) out.push({ id: group.id, label: group.label, path: group.path, icon: group.icon, groupLabel: null });
    group.children?.forEach((child) =>
      out.push({ id: child.id, label: child.label, path: child.path, icon: group.icon, groupLabel: group.label })
    );
  });
  return out;
})();

export function findNavEntry(path: string): FlatNavEntry | undefined {
  const exact = FLAT_NAV.find((e) => e.path === path);
  if (exact) return exact;
  // Fall back to the longest static entry that's a parent of this path,
  // so dynamic child routes (e.g. /interfaces/:interfaceId) still
  // resolve to a real breadcrumb instead of "Not found".
  return FLAT_NAV.filter((e) => path.startsWith(`${e.path}/`)).sort((a, b) => b.path.length - a.path.length)[0];
}

export function crumbsForPath(path: string): { label: string }[] {
  const entry = findNavEntry(path);
  if (!entry) return [{ label: "Not found" }];
  if (entry.groupLabel) return [{ label: entry.groupLabel }, { label: entry.label }];
  return [{ label: entry.label }];
}
