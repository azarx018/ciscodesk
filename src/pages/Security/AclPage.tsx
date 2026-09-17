import { useMemo, useState } from "react";
import "./AclPage.css";
import { PageHeader } from "../../components/layout";
import { Badge, Button, Checkbox, ConfirmDialog, DataTable, Input, LoadingState, Modal, Select, useToast } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { securityService } from "../../services/mock/securityService";
import { AclRule } from "../../types/security";

const emptyForm = {
  sequence: "10",
  action: "permit" as AclRule["action"],
  protocol: "tcp" as AclRule["protocol"],
  source: "any",
  destination: "any",
  destinationPort: "",
  logging: false,
};

/** ACL (§11): visual rule editor grouped by ACL name, with a display-only generated config preview (§29). */
export function AclPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data: rules, loading, refetch } = useAsync(() => securityService.listAcls(deviceId!), [deviceId]);
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [activeAcl, setActiveAcl] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [previewByAcl, setPreviewByAcl] = useState<Record<string, string>>({});
  const [pendingDelete, setPendingDelete] = useState<AclRule | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, AclRule[]>();
    (rules || []).forEach((r) => {
      if (!map.has(r.aclName)) map.set(r.aclName, []);
      map.get(r.aclName)!.push(r);
    });
    return Array.from(map.entries()).map(([name, list]) => [name, list.sort((a, b) => a.sequence - b.sequence)] as const);
  }, [rules]);

  async function handleAddRule() {
    if (!deviceId || !activeAcl) return;
    await securityService.addAclRule({
      deviceId,
      aclName: activeAcl,
      sequence: Number(form.sequence),
      action: form.action,
      protocol: form.protocol,
      source: form.source,
      destination: form.destination,
      destinationPort: form.destinationPort || undefined,
      logging: form.logging,
    });
    toast.show(`Rule added to ${activeAcl} (simulated).`, "success");
    setModalOpen(false);
    setForm(emptyForm);
    refetch();
  }

  async function handleDelete() {
    if (!pendingDelete) return;
    await securityService.removeAclRule(pendingDelete.id);
    toast.show("Rule removed (simulated).", "success");
    setPendingDelete(null);
    refetch();
  }

  async function handlePreview(aclName: string) {
    const text = await securityService.previewAclConfig(deviceId!, aclName);
    setPreviewByAcl((p) => ({ ...p, [aclName]: text }));
  }

  return (
    <>
      <PageHeader title="ACL" subtitle={selectedDevice?.hostname} />

      {loading ? (
        <LoadingState label="Loading ACLs…" />
      ) : grouped.length === 0 ? (
        <div className="text-sm text-muted">No ACLs configured on this device.</div>
      ) : (
        <div className="cd-acl-groups">
          {grouped.map(([aclName, aclRules]) => (
            <section className="cd-panel" key={aclName}>
              <div className="cd-panel-header">
                <span className="cd-panel-title mono">{aclName}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => handlePreview(aclName)}>Preview config</Button>
                  <Button size="sm" variant="primary" onClick={() => { setActiveAcl(aclName); setForm({ ...emptyForm }); setModalOpen(true); }}>
                    Add rule
                  </Button>
                </div>
              </div>
              <div className="cd-panel-body">
                <DataTable<AclRule>
                  columns={[
                    { key: "seq", header: "Seq", render: (r) => r.sequence },
                    { key: "action", header: "Action", render: (r) => <Badge tone={r.action === "permit" ? "online" : "error"}>{r.action}</Badge> },
                    { key: "protocol", header: "Protocol", render: (r) => r.protocol },
                    { key: "source", header: "Source", render: (r) => <span className="mono">{r.source}</span> },
                    { key: "destination", header: "Destination", render: (r) => <span className="mono">{r.destination}{r.destinationPort ? `:${r.destinationPort}` : ""}</span> },
                    { key: "logging", header: "Logging", render: (r) => (r.logging ? <Badge tone="outline">log</Badge> : <span className="text-muted">—</span>) },
                    { key: "actions", header: "", align: "right", render: (r) => <Button size="sm" variant="ghost" onClick={() => setPendingDelete(r)}>Delete</Button> },
                  ]}
                  rows={aclRules}
                  getRowId={(r) => r.id}
                />
                {previewByAcl[aclName] && <div className="cd-config-preview" style={{ marginTop: 12 }}>{previewByAcl[aclName]}</div>}
              </div>
            </section>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Add rule to ${activeAcl ?? ""}`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddRule}>Add rule</Button>
          </>
        }
      >
        <div className="flex-col gap-3">
          <Input label="Sequence" type="number" value={form.sequence} onChange={(e) => setForm({ ...form, sequence: e.target.value })} />
          <Select label="Action" options={[{ value: "permit", label: "Permit" }, { value: "deny", label: "Deny" }]} value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value as AclRule["action"] })} />
          <Select label="Protocol" options={["ip", "tcp", "udp", "icmp"].map((p) => ({ value: p, label: p }))} value={form.protocol} onChange={(e) => setForm({ ...form, protocol: e.target.value as AclRule["protocol"] })} />
          <Input label="Source" mono value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="any / 10.0.0.0/8" />
          <Input label="Destination" mono value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="any / 10.0.0.1" />
          <Input label="Destination Port" value={form.destinationPort} onChange={(e) => setForm({ ...form, destinationPort: e.target.value })} placeholder="Optional" />
          <Checkbox label="Enable logging" checked={form.logging} onChange={(e) => setForm({ ...form, logging: e.target.checked })} />
        </div>
      </Modal>

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete ACL rule"
        message={`This will remove sequence ${pendingDelete?.sequence} from ${pendingDelete?.aclName} on ${selectedDevice?.hostname}. This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
