import { AppUser } from "../types/user";

export const USERS: AppUser[] = [
  { id: "u-1", username: "admin", fullName: "System Administrator", role: "Administrator", permissions: ["View", "Configure", "Backup", "Manage Users", "Terminal"], lastLogin: "just now", status: "active" },
  { id: "u-2", username: "n.wardana", fullName: "Nadia Wardana", role: "Operator", permissions: ["View", "Configure", "Backup", "Terminal"], lastLogin: "3h ago", status: "active" },
  { id: "u-3", username: "r.saputra", fullName: "Rizky Saputra", role: "Operator", permissions: ["View", "Configure", "Terminal"], lastLogin: "1d ago", status: "active" },
  { id: "u-4", username: "auditor", fullName: "Compliance Auditor", role: "Viewer", permissions: ["View"], lastLogin: "6d ago", status: "disabled" },
];
