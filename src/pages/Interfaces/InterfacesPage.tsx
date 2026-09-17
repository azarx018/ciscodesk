import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InterfacesPage.css";
import { PageHeader } from "../../components/layout";
import { Badge, Button, DataTable, Input, StatusIndicator } from "../../components/ui";
import { Icon } from "../../components/icons/Icon";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useInterfaces } from "../../hooks/useInterfaces";
import { NetworkInterface } from "../../types/interface";
import { formatBytesPerSecond } from "../../utils/formatters";

const STATUS_TONE = { up: "online", down: "error", "admin-down": "offline" } as const;

/** All Interfaces (§8): dense per-interface table scoped to the selected device. */
export function InterfacesPage() {
  const { selectedDevice } = useDeviceContext();
  const { interfaces, loading, refetch } = useInterfaces(selectedDevice?.id);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return interfaces;
    return interfaces.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
  }, [interfaces, query]);

  return (
    <>
      <PageHeader
        title="Interfaces"
        subtitle={selectedDevice ? `All interfaces on ${selectedDevice.hostname}` : undefined}
        actions={
          <Button variant="ghost" size="sm" onClick={refetch}>
            Refresh
          </Button>
        }
      />

      <div className="cd-toolbar" style={{ marginBottom: 12 }}>
        <div style={{ maxWidth: 280, flex: 1 }}>
          <Input placeholder="Search name or description…" icon={<Icon.search size={14} />} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      <DataTable<NetworkInterface>
        columns={[
          {
            key: "name",
            header: "Interface",
            sortValue: (i) => i.name,
            render: (i) => (
              <button className="cd-if-name-link" onClick={() => navigate(`/interfaces/${i.id}`)}>
                {i.name}
              </button>
            ),
          },
          { key: "description", header: "Description", render: (i) => i.description || <span className="text-muted">—</span> },
          { key: "status", header: "Status", sortValue: (i) => i.status, render: (i) => <StatusIndicator tone={STATUS_TONE[i.status]} label={i.status} /> },
          { key: "protocol", header: "Protocol", render: (i) => i.protocol },
          { key: "speed", header: "Speed", render: (i) => (i.speed === "auto" ? "auto" : `${i.speed} Mb/s`) },
          { key: "duplex", header: "Duplex", render: (i) => i.duplex },
          { key: "ip", header: "IP", render: (i) => (i.ipv4 ? <span className="mono">{i.ipv4}/{i.prefix}</span> : <span className="text-muted">—</span>) },
          { key: "vlan", header: "VLAN", render: (i) => (i.vlan ? <Badge tone="outline">{i.vlan}</Badge> : <span className="text-muted">—</span>) },
          { key: "rx", header: "RX", align: "right", sortValue: (i) => i.rxBps, render: (i) => formatBytesPerSecond(i.rxBps) },
          { key: "tx", header: "TX", align: "right", sortValue: (i) => i.txBps, render: (i) => formatBytesPerSecond(i.txBps) },
        ]}
        rows={filtered}
        getRowId={(i) => i.id}
        loading={loading}
        emptyTitle="No interfaces match your search"
        emptyBody="Try a different interface name or description."
      />
    </>
  );
}
