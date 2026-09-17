import { Device } from "../../types/device";
import { INTERFACES_BY_DEVICE } from "../../data/interfaces";
import { simulateRequest } from "./mockClient";

/**
 * Canned CLI responses for the Terminal mock (§16). Keyed by command
 * prefix so "show ip route" and "show ip route ospf" both resolve.
 * Never executes anything — text generation only.
 */
export function runCommand(device: Device, raw: string): Promise<string> {
  const cmd = raw.trim().toLowerCase();
  const interfaces = INTERFACES_BY_DEVICE[device.id] ?? [];

  if (!cmd) return simulateRequest("");

  if (cmd === "?" || cmd === "help") {
    return simulateRequest(
      [
        "Available commands:",
        "  show version",
        "  show interfaces",
        "  show ip interface brief",
        "  show ip route",
        "  show vlan brief",
        "  show cdp neighbors",
        "  show running-config",
        "  clear",
      ].join("\n")
    );
  }

  if (cmd === "show version") {
    return simulateRequest(
      [
        `Cisco IOS XE Software, ${device.platform}`,
        `${device.model}, Serial Number: ${device.serial}`,
        `Version ${device.osVersion}`,
        `${device.hostname} uptime is ${device.uptime}`,
      ].join("\n")
    );
  }

  if (cmd === "show interfaces" || cmd === "show int") {
    return simulateRequest(
      interfaces
        .slice(0, 10)
        .map(
          (i) =>
            `${i.name} is ${i.status}, line protocol is ${i.protocol}\n  Description: ${i.description || "-"}\n  ${i.ipv4 ? `Internet address is ${i.ipv4}/${i.prefix}` : "No IP address configured"}`
        )
        .join("\n")
    );
  }

  if (cmd === "show ip interface brief" || cmd === "show ip int brief") {
    const header = "Interface              IP-Address      Status                Protocol";
    const rows = interfaces
      .slice(0, 14)
      .map((i) => `${i.name.padEnd(23)}${(i.ipv4 || "unassigned").padEnd(16)}${i.status.padEnd(22)}${i.protocol}`);
    return simulateRequest([header, ...rows].join("\n"));
  }

  if (cmd === "show ip route") {
    return simulateRequest(
      [
        "Codes: C - connected, S - static, O - OSPF, B - BGP",
        "",
        "Gateway of last resort is 203.0.113.1 to network 0.0.0.0",
        "",
        "B*   0.0.0.0/0 [20/0] via 203.0.113.1",
        "C    10.255.0.0/30 is directly connected, GigabitEthernet0/0/2",
        "O    10.10.0.0/24 [110/20] via 10.255.0.2, GigabitEthernet0/0/2",
      ].join("\n")
    );
  }

  if (cmd === "show vlan brief") {
    return simulateRequest(
      [
        "VLAN Name                             Status    Ports",
        "---- -------------------------------- --------- -------------------------------",
        "1    default                          active",
        "10   DATA                             active    Gi1/0/3, Gi1/0/4, Gi1/0/5",
        "20   VOICE                            active    Gi1/0/6, Gi1/0/7",
        "99   MGMT-NATIVE                      active    Te1/0/2, Te1/0/3",
      ].join("\n")
    );
  }

  if (cmd === "show cdp neighbors") {
    return simulateRequest(
      [
        "Capability Codes: R - Router, S - Switch",
        "Device ID        Local Intrfce   Capability  Platform  Port ID",
        "CORE-SW-01        Gig 0/0/2       S           C9300     Ten 1/0/1",
      ].join("\n")
    );
  }

  if (cmd === "show running-config" || cmd === "show run") {
    return simulateRequest(
      [
        `hostname ${device.hostname}`,
        "!",
        `interface ${interfaces[0]?.name ?? "GigabitEthernet0/0"}`,
        ` description ${interfaces[0]?.description || "-"}`,
        " no shutdown",
        "!",
        "end",
      ].join("\n")
    );
  }

  return simulateRequest(`% Invalid input detected at '^' marker.\n% Unknown command or computer name, or unable to find computer address`, {
    latencyMs: 150,
  });
}

export const TERMINAL_SUGGESTIONS = [
  "show version",
  "show interfaces",
  "show ip interface brief",
  "show ip route",
  "show vlan brief",
  "show cdp neighbors",
  "show running-config",
];
