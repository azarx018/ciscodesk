import { ACL_RULES, NAT_ENTRIES, PORT_SECURITY } from "../../data/security";
import { AclRule } from "../../types/security";
import { cloneData, simulateRequest } from "./mockClient";

let aclRules: AclRule[] = cloneData(ACL_RULES);

export const securityService = {
  listAcls(deviceId: string) {
    return simulateRequest(cloneData(aclRules.filter((r) => r.deviceId === deviceId)));
  },
  addAclRule(input: Omit<AclRule, "id">): Promise<AclRule> {
    const created: AclRule = { ...input, id: `acl-${Date.now()}` };
    aclRules = [...aclRules, created];
    return simulateRequest(cloneData(created));
  },
  removeAclRule(id: string) {
    aclRules = aclRules.filter((r) => r.id !== id);
    return simulateRequest({ id });
  },
  /** Display-only generated config preview for an ACL (§11, §29). */
  previewAclConfig(deviceId: string, aclName: string): Promise<string> {
    const rules = aclRules
      .filter((r) => r.deviceId === deviceId && r.aclName === aclName)
      .sort((a, b) => a.sequence - b.sequence);
    const lines = [
      `ip access-list extended ${aclName}`,
      ...rules.map((r) => {
        const portPart = r.destinationPort ? ` eq ${r.destinationPort}` : "";
        return ` ${r.sequence} ${r.action} ${r.protocol} ${r.source} ${r.destination}${portPart}${r.logging ? " log" : ""}`;
      }),
    ];
    return simulateRequest(lines.join("\n"), { latencyMs: 250 });
  },
  listNat(deviceId: string) {
    return simulateRequest(cloneData(NAT_ENTRIES.filter((n) => n.deviceId === deviceId)));
  },
  listPortSecurity(deviceId: string) {
    return simulateRequest(cloneData(PORT_SECURITY.filter((p) => p.deviceId === deviceId)));
  },
};
