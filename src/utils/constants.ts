/** App-wide constants. Values here are UI-facing; nothing here talks to a real device. */

export const CONNECTION_METHODS = ["SSH", "NETCONF", "RESTCONF", "Auto Detect"] as const;
export type ConnectionMethod = (typeof CONNECTION_METHODS)[number];

export const DEVICE_GROUPS = ["Core", "Distribution", "Access", "Branches", "Labs"] as const;

export const USER_ROLES = ["Administrator", "Operator", "Viewer"] as const;

export const MOCK_LATENCY_MS = 350;
