export type UserRole = "Administrator" | "Operator" | "Viewer";
export type Permission = "View" | "Configure" | "Backup" | "Manage Users" | "Terminal";

export interface AppUser {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  permissions: Permission[];
  lastLogin: string;
  status: "active" | "disabled";
}
