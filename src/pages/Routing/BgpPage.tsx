import { PageHeader } from "../../components/layout";
import { Badge, DataTable, EmptyState, LoadingState, MetricCard } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { routingService } from "../../services/mock/routingService";

const STATE_TONE = { Established: "online", Idle: "offline", Connect: "warning", Active: "warning", OpenSent: "warning", OpenConfirm: "warning" } as const;

export function BgpPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data, loading } = useAsync(() => routingService.getBgp(deviceId!), [deviceId]);

  return (
    <>
      <PageHeader title="BGP" subtitle={selectedDevice?.hostname} />
      {loading ? (
        <LoadingState label="Loading BGP state…" />
      ) : !data?.process ? (
        <EmptyState title="BGP not configured" body="This device has no active BGP process." />
      ) : (
        <>
          <div className="flex gap-4 flex-wrap" style={{ marginBottom: 20 }}>
            <MetricCard label="LOCAL AS" value={data.process.localAs} />
            <MetricCard label="ROUTER ID" value={<span className="mono">{data.process.routerId}</span>} />
            <MetricCard label="NEIGHBORS" value={data.neighbors.length} />
          </div>
          <DataTable
            columns={[
              { key: "neighborIp", header: "Neighbor", render: (n) => <span className="mono">{n.neighborIp}</span> },
              { key: "remoteAs", header: "Remote AS", render: (n) => n.remoteAs },
              { key: "state", header: "State", render: (n) => <Badge tone={STATE_TONE[n.state]}>{n.state}</Badge> },
              { key: "received", header: "Prefixes Received", align: "right", render: (n) => n.prefixesReceived },
              { key: "advertised", header: "Prefixes Advertised", align: "right", render: (n) => n.prefixesAdvertised },
              { key: "uptime", header: "Uptime", render: (n) => <span className="mono">{n.uptime}</span> },
            ]}
            rows={data.neighbors}
            getRowId={(n) => n.id}
            emptyTitle="No BGP neighbors"
            emptyBody="This device has no BGP peers configured."
          />
        </>
      )}
    </>
  );
}
