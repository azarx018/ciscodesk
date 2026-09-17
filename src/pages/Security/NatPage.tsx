import { PageHeader } from "../../components/layout";
import { Badge, DataTable } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { securityService } from "../../services/mock/securityService";
import { NatEntry } from "../../types/security";

export function NatPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data: entries, loading } = useAsync(() => securityService.listNat(deviceId!), [deviceId]);

  return (
    <>
      <PageHeader title="NAT" subtitle={selectedDevice?.hostname} />
      <DataTable<NatEntry>
        columns={[
          { key: "inside", header: "Inside Interface", render: (n) => <span className="mono">{n.insideInterface}</span> },
          { key: "outside", header: "Outside Interface", render: (n) => <span className="mono">{n.outsideInterface}</span> },
          { key: "local", header: "Local Address", render: (n) => <span className="mono">{n.localAddress}</span> },
          { key: "global", header: "Global Address", render: (n) => <span className="mono">{n.globalAddress}</span> },
          { key: "type", header: "Type", render: (n) => <Badge tone="outline">{n.type.toUpperCase()}</Badge> },
          { key: "status", header: "Status", render: (n) => <Badge tone={n.status === "active" ? "online" : "offline"}>{n.status}</Badge> },
        ]}
        rows={entries || []}
        getRowId={(n) => n.id}
        loading={loading}
        emptyTitle="No NAT rules"
        emptyBody="No NAT translations are configured on this device."
      />
    </>
  );
}
