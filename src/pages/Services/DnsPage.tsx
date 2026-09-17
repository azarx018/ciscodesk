import { PageHeader } from "../../components/layout";
import { Badge, DataTable, EmptyState, LoadingState, MetricCard } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { networkServicesService } from "../../services/mock/networkServicesService";

const STATUS_TONE = { operational: "online", degraded: "warning", failed: "error" } as const;

export function DnsPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data, loading } = useAsync(() => networkServicesService.getDns(deviceId!), [deviceId]);

  return (
    <>
      <PageHeader title="DNS" subtitle={selectedDevice?.hostname} />
      {loading ? (
        <LoadingState label="Loading DNS configuration…" />
      ) : !data ? (
        <EmptyState title="DNS not configured" body="No DNS configuration found on this device." />
      ) : (
        <>
          <div className="flex gap-4 flex-wrap" style={{ marginBottom: 20 }}>
            <MetricCard label="SERVERS" value={<span className="mono">{data.servers.join(", ")}</span>} />
            <MetricCard label="LOOKUP STATUS" value={<Badge tone={STATUS_TONE[data.lookupStatus]}>{data.lookupStatus}</Badge>} />
          </div>
          <DataTable
            columns={[
              { key: "hostname", header: "Hostname", render: (e) => <span className="mono">{e.hostname}</span> },
              { key: "ip", header: "IP", render: (e) => <span className="mono">{e.ip}</span> },
              { key: "type", header: "Type", render: (e) => <Badge tone="outline">{e.type}</Badge> },
            ]}
            rows={data.entries}
            getRowId={(e) => e.id}
            emptyTitle="No DNS entries"
            emptyBody="No static DNS entries are configured."
          />
        </>
      )}
    </>
  );
}
