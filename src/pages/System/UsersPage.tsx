import { useState } from "react";
import { PageHeader } from "../../components/layout";
import { Badge, DataTable, Select, useToast } from "../../components/ui";
import { useAsync } from "../../hooks/useAsync";
import { userService } from "../../services/mock/userService";
import { AppUser, UserRole } from "../../types/user";

const ROLE_OPTIONS: UserRole[] = ["Administrator", "Operator", "Viewer"];

/** Users (§15): mock RBAC — role changes update the local mock user store. */
export function UsersPage() {
  const { data: users, loading, refetch } = useAsync(() => userService.list(), []);
  const toast = useToast();
  const [updating, setUpdating] = useState<string | null>(null);

  async function handleRoleChange(user: AppUser, role: UserRole) {
    setUpdating(user.id);
    try {
      await userService.update(user.id, { role });
      toast.show(`${user.username} is now ${role} (simulated).`, "success");
      refetch();
    } finally {
      setUpdating(null);
    }
  }

  return (
    <>
      <PageHeader title="Users" subtitle="Role-based access control (mock)" />
      <DataTable<AppUser>
        columns={[
          { key: "username", header: "Username", sortValue: (u) => u.username, render: (u) => <span className="mono">{u.username}</span> },
          { key: "fullName", header: "Full Name", render: (u) => u.fullName },
          {
            key: "role",
            header: "Role",
            render: (u) => (
              <Select
                options={ROLE_OPTIONS.map((r) => ({ value: r, label: r }))}
                value={u.role}
                disabled={updating === u.id}
                onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                style={{ maxWidth: 160 }}
              />
            ),
          },
          { key: "permissions", header: "Permissions", render: (u) => <span className="text-sm text-secondary">{u.permissions.join(", ")}</span> },
          { key: "lastLogin", header: "Last Login", render: (u) => <span className="text-muted">{u.lastLogin}</span> },
          { key: "status", header: "Status", render: (u) => <Badge tone={u.status === "active" ? "online" : "offline"}>{u.status}</Badge> },
        ]}
        rows={users || []}
        getRowId={(u) => u.id}
        loading={loading}
        emptyTitle="No users"
        emptyBody="No users are configured."
      />
    </>
  );
}
