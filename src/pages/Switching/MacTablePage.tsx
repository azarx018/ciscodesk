import { useMemo, useState } from "react";
import { PageHeader } from "../../components/layout";
import { Badge, DataTable, Input, Select } from "../../components/ui";
import { Icon } from "../../components/icons/Icon";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { switchingService } from "../../services/mock/switchingService";
import { MacAddressEntry } from "../../types/vlan";

/** MAC Address Table (§9): filterable by VLAN / interface / dynamic-static. */
export function MacTablePage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data: entries, loading } = useAsync(() => switchingService.listMacTable(deviceId!), [deviceId]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "dynamic" | "static">("all");

  const filtered = useMemo(() => {
    let rows = entries || [];
    if (typeFilter !== "all") rows = rows.filter((r) => r.type === typeFilter);
    const q = query.trim().toLowerCase();
    if (q) rows = rows.filter((r) => r.macAddress.toLowerCase().includes(q) || r.interfaceName.toLowerCase().includes(q));
    return rows;
  }, [entries, query, typeFilter]);

  return (
    <>
      <PageHeader title="MAC Address Table" subtitle={selectedDevice?.hostname} />

      <div className="cd-toolbar">
        <div className="cd-toolbar-search">
          <Input placeholder="Search MAC or interface…" icon={<Icon.search size={14} />} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Select
          options={[{ value: "all", label: "All types" }, { value: "dynamic", label: "Dynamic" }, { value: "static", label: "Static" }]}
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
          style={{ maxWidth: 160 }}
        />
      </div>

      <DataTable<MacAddressEntry>
        columns={[
          { key: "mac", header: "MAC Address", sortValue: (m) => m.macAddress, render: (m) => <span className="mono">{m.macAddress}</span> },
          { key: "vlan", header: "VLAN", sortValue: (m) => m.vlan, render: (m) => <Badge tone="outline">{m.vlan}</Badge> },
          { key: "interface", header: "Interface", sortValue: (m) => m.interfaceName, render: (m) => <span className="mono">{m.interfaceName}</span> },
          { key: "type", header: "Type", render: (m) => (m.type === "static" ? <Badge tone="outline">static</Badge> : "dynamic") },
          { key: "age", header: "Age", align: "right", render: (m) => (m.type === "static" ? "—" : `${m.age}m`) },
        ]}
        rows={filtered}
        getRowId={(m) => m.id}
        loading={loading}
        emptyTitle="No MAC entries"
        emptyBody="No learned or static MAC addresses match this filter."
      />
    </>
  );
}
