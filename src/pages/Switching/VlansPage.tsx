import { useState } from "react";
import { PageHeader } from "../../components/layout";
import { Badge, Button, DataTable, Input, Modal, useToast } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { switchingService } from "../../services/mock/switchingService";
import { Vlan } from "../../types/vlan";

/** VLANs (§9): create/edit/delete + port assignment view, scoped to the selected device. */
export function VlansPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data: vlans, loading, refetch } = useAsync(() => switchingService.listVlans(deviceId!), [deviceId]);
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ vlanId: "", name: "" });
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!deviceId || !form.vlanId || !form.name) return;
    setSaving(true);
    try {
      await switchingService.createVlan({ deviceId, vlanId: Number(form.vlanId), name: form.name, status: "active", ports: [] });
      toast.show(`VLAN ${form.vlanId} created (simulated).`, "success");
      setModalOpen(false);
      setForm({ vlanId: "", name: "" });
      refetch();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(vlan: Vlan) {
    await switchingService.deleteVlan(vlan.id);
    toast.show(`VLAN ${vlan.vlanId} deleted (simulated).`, "success");
    refetch();
  }

  return (
    <>
      <PageHeader
        title="VLANs"
        subtitle={selectedDevice ? selectedDevice.hostname : undefined}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={refetch}>Refresh</Button>
            <Button variant="primary" size="sm" onClick={() => setModalOpen(true)}>Create</Button>
          </>
        }
      />

      <DataTable<Vlan>
        columns={[
          { key: "vlanId", header: "VLAN ID", sortValue: (v) => v.vlanId, render: (v) => <span className="mono">{v.vlanId}</span> },
          { key: "name", header: "Name", sortValue: (v) => v.name, render: (v) => v.name },
          { key: "status", header: "Status", render: (v) => <Badge tone={v.status === "active" ? "online" : "offline"}>{v.status}</Badge> },
          { key: "ports", header: "Ports", render: (v) => (v.ports.length ? <span className="mono text-sm">{v.ports.join(", ")}</span> : <span className="text-muted">—</span>) },
          {
            key: "actions",
            header: "",
            align: "right",
            render: (v) => (
              <Button size="sm" variant="ghost" onClick={() => handleDelete(v)}>
                Delete
              </Button>
            ),
          },
        ]}
        rows={vlans || []}
        getRowId={(v) => v.id}
        loading={loading}
        emptyTitle="No VLANs configured"
        emptyBody="Create a VLAN to start segmenting traffic on this device."
      />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create VLAN"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreate} disabled={saving || !form.vlanId || !form.name}>
              {saving ? "Creating…" : "Create"}
            </Button>
          </>
        }
      >
        <div className="flex-col gap-3">
          <Input label="VLAN ID" type="number" value={form.vlanId} onChange={(e) => setForm({ ...form, vlanId: e.target.value })} placeholder="40" />
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="LAB" />
        </div>
      </Modal>
    </>
  );
}
