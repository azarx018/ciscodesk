import { useState } from "react";
import { PageHeader } from "../../components/layout";
import { Button, ConfirmDialog, DataTable, Input, Modal, useToast } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { routingService } from "../../services/mock/routingService";
import { StaticRoute } from "../../types/routing";

const emptyForm = { destination: "", prefix: "24", nextHop: "", adminDistance: "1", description: "" };

/** Static Routes (§10): editor with sequence of Destination/Prefix/Next Hop/AD/Description. */
export function StaticRoutesPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data: routes, loading, refetch } = useAsync(() => routingService.listStaticRoutes(deviceId!), [deviceId]);
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<StaticRoute | null>(null);

  async function handleCreate() {
    if (!deviceId || !form.destination || !form.nextHop) return;
    setSaving(true);
    try {
      await routingService.addStaticRoute({
        deviceId,
        destination: form.destination,
        prefix: Number(form.prefix),
        nextHop: form.nextHop,
        adminDistance: Number(form.adminDistance),
        description: form.description || undefined,
      });
      toast.show("Static route added (simulated).", "success");
      setModalOpen(false);
      setForm(emptyForm);
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    await routingService.removeStaticRoute(pendingDelete.id);
    toast.show("Static route removed (simulated).", "success");
    setPendingDelete(null);
    refetch();
  }

  return (
    <>
      <PageHeader
        title="Static Routes"
        subtitle={selectedDevice?.hostname}
        actions={<Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>Add Route</Button>}
      />

      <DataTable<StaticRoute>
        columns={[
          { key: "destination", header: "Destination", render: (r) => <span className="mono">{r.destination}/{r.prefix}</span> },
          { key: "nextHop", header: "Next Hop", render: (r) => <span className="mono">{r.nextHop}</span> },
          { key: "ad", header: "Admin Distance", align: "right", render: (r) => r.adminDistance },
          { key: "description", header: "Description", render: (r) => r.description || <span className="text-muted">—</span> },
          {
            key: "actions",
            header: "",
            align: "right",
            render: (r) => (
              <Button size="sm" variant="ghost" onClick={() => setPendingDelete(r)}>
                Delete
              </Button>
            ),
          },
        ]}
        rows={routes || []}
        getRowId={(r) => r.id}
        loading={loading}
        emptyTitle="No static routes"
        emptyBody="Add a static route to direct traffic for a specific destination."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add static route"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate} disabled={saving || !form.destination || !form.nextHop}>
              {saving ? "Adding…" : "Add"}
            </Button>
          </>
        }
      >
        <div className="flex-col gap-3">
          <Input label="Destination" mono value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="10.0.6.0" />
          <Input label="Prefix Length" type="number" value={form.prefix} onChange={(e) => setForm({ ...form, prefix: e.target.value })} />
          <Input label="Next Hop" mono value={form.nextHop} onChange={(e) => setForm({ ...form, nextHop: e.target.value })} placeholder="10.255.0.6" />
          <Input label="Administrative Distance" type="number" value={form.adminDistance} onChange={(e) => setForm({ ...form, adminDistance: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional" />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete static route"
        message={`This will remove the route to ${pendingDelete?.destination}/${pendingDelete?.prefix}. This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
