import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout";
import { Badge, Button, ConfirmDialog, DataTable, Input, StatusIndicator, useToast } from "../../components/ui";
import { Icon } from "../../components/icons/Icon";
import { useDevices } from "../../hooks/useDevices";
import { deviceService } from "../../services/mock/deviceService";
import { Device } from "../../types/device";
import { formatPercent } from "../../utils/formatters";

/** All Devices (§6): searchable, sortable, selectable inventory table. */
export function AllDevicesPage() {
  const { devices, loading, refetch } = useDevices();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return devices;
    return devices.filter(
      (d) => d.hostname.toLowerCase().includes(q) || d.managementIp.includes(q) || d.platform.toLowerCase().includes(q)
    );
  }, [devices, query]);

  async function handleBulkDelete() {
    await Promise.all(selected.map((id) => deviceService.remove(id)));
    toast.show(`${selected.length} device(s) removed (simulated).`, "success");
    setSelected([]);
    setConfirmOpen(false);
    refetch();
  }

  return (
    <>
      <PageHeader
        title="All Devices"
        subtitle={`${devices.length} device${devices.length === 1 ? "" : "s"} in inventory`}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={refetch}>
              Refresh
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate("/devices/add")}>
              Add Device
            </Button>
          </>
        }
      />

      <div className="cd-toolbar">
        <div className="cd-toolbar-search">
          <Input placeholder="Search hostname, IP, platform…" icon={<Icon.search size={14} />} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {selected.length > 0 && (
        <div className="cd-bulk-bar">
          <span>{selected.length} selected</span>
          <span className="grow" />
          <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
            Delete selected
          </Button>
        </div>
      )}

      <DataTable<Device>
        columns={[
          { key: "hostname", header: "Hostname", sortValue: (d) => d.hostname, render: (d) => <span className="mono">{d.hostname}</span> },
          { key: "ip", header: "Management IP", sortValue: (d) => d.managementIp, render: (d) => <span className="mono">{d.managementIp}</span> },
          { key: "platform", header: "Platform", sortValue: (d) => d.platform, render: (d) => d.platform },
          { key: "os", header: "OS Version", render: (d) => <span className="mono">{d.osVersion}</span> },
          { key: "uptime", header: "Uptime", render: (d) => <span className="mono">{d.uptime}</span> },
          { key: "status", header: "Status", sortValue: (d) => d.status, render: (d) => <StatusIndicator tone={d.status} label={d.status} /> },
          { key: "cpu", header: "CPU", sortValue: (d) => d.cpu, align: "right", render: (d) => formatPercent(d.cpu) },
          { key: "memory", header: "Memory", sortValue: (d) => d.memory, align: "right", render: (d) => formatPercent(d.memory) },
          { key: "lastSeen", header: "Last Seen", render: (d) => <span className="text-muted">{d.lastSeen}</span> },
          { key: "group", header: "Group", render: (d) => <Badge tone="outline">{d.group}</Badge> },
        ]}
        rows={filtered}
        getRowId={(d) => d.id}
        loading={loading}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        emptyTitle="No devices match your search"
        emptyBody="Try a different hostname, IP, or platform."
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete devices"
        message={`This will remove ${selected.length} device(s) from CiscoDesk's local mock inventory. This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleBulkDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
