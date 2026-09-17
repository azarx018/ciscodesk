import { useState } from "react";
import { PageHeader } from "../../components/layout";
import { Badge, Button, ConfirmDialog, DataTable, useToast } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { systemService } from "../../services/mock/systemService";
import { Backup } from "../../types/system";

const STATUS_TONE = { completed: "online", failed: "error", "in-progress": "warning" } as const;

/** Backups (§15): create / restore / download / delete, all simulated. */
export function BackupsPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data: backups, loading, refetch } = useAsync(() => systemService.listBackups(deviceId!), [deviceId]);
  const toast = useToast();
  const [creating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Backup | null>(null);

  async function handleCreate() {
    if (!deviceId) return;
    setCreating(true);
    try {
      await systemService.createBackup(deviceId, "admin");
      toast.show("Backup created (simulated).", "success");
      refetch();
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    await systemService.deleteBackup(pendingDelete.id);
    toast.show("Backup deleted (simulated).", "success");
    setPendingDelete(null);
    refetch();
  }

  return (
    <>
      <PageHeader
        title="Backups"
        subtitle={selectedDevice?.hostname}
        actions={
          <Button variant="primary" size="sm" onClick={handleCreate} disabled={creating}>
            {creating ? "Creating…" : "Create Backup"}
          </Button>
        }
      />
      <DataTable<Backup>
        columns={[
          { key: "label", header: "Backup", render: (b) => b.label },
          { key: "timestamp", header: "Timestamp", sortValue: (b) => b.timestamp, render: (b) => new Date(b.timestamp).toLocaleString() },
          { key: "status", header: "Status", render: (b) => <Badge tone={STATUS_TONE[b.status]}>{b.status}</Badge> },
          { key: "size", header: "Size", align: "right", render: (b) => (b.sizeKb > 0 ? `${b.sizeKb} KB` : "—") },
          { key: "user", header: "User", render: (b) => b.user },
          {
            key: "actions",
            header: "",
            align: "right",
            render: (b) => (
              <div className="flex gap-2" style={{ justifyContent: "flex-end" }}>
                <Button size="sm" variant="ghost" onClick={() => toast.show(`Restoring from ${b.label} (simulated).`, "info")}>Restore</Button>
                <Button size="sm" variant="ghost" onClick={() => toast.show(`Downloading ${b.label} (simulated).`, "info")}>Download</Button>
                <Button size="sm" variant="ghost" onClick={() => setPendingDelete(b)}>Delete</Button>
              </div>
            ),
          },
        ]}
        rows={backups || []}
        getRowId={(b) => b.id}
        loading={loading}
        emptyTitle="No backups"
        emptyBody="Create a backup to save this device's current configuration."
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete backup"
        message={`This will permanently delete "${pendingDelete?.label}". This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
