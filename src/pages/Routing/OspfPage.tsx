import { PageHeader } from "../../components/layout";
import { Badge, DataTable, EmptyState, LoadingState, MetricCard } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { routingService } from "../../services/mock/routingService";

const STATE_TONE = { Full: "online", "2-Way": "online", Init: "warning", Down: "error", ExStart: "warning", Exchange: "warning" } as const;

export function OspfPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data, loading } = useAsync(() => routingService.getOspf(deviceId!), [deviceId]);

  return (
    <>
      <PageHeader title="OSPF" subtitle={selectedDevice?.hostname} />
      {loading ? (
        <LoadingState label="Loading OSPF state…" />
      ) : !data?.process ? (
        <EmptyState title="OSPF not configured" body="This device has no active OSPF process." />
      ) : (
        <>
          <div className="flex gap-4 flex-wrap" style={{ marginBottom: 20 }}>
            <MetricCard label="PROCESS ID" value={data.process.processId} />
            <MetricCard label="ROUTER ID" value={<span className="mono">{data.process.routerId}</span>} />
            <MetricCard label="AREAS" value={data.process.areas.join(", ")} />
            <MetricCard label="NEIGHBORS" value={data.neighbors.length} />
          </div>
          <DataTable
            columns={[
              { key: "neighborId", header: "Neighbor ID", render: (n) => <span className="mono">{n.neighborId}</span> },
              { key: "address", header: "Address", render: (n) => <span className="mono">{n.address}</span> },
              { key: "interface", header: "Interface", render: (n) => <span className="mono">{n.interfaceName}</span> },
              { key: "area", header: "Area", render: (n) => n.area },
              { key: "state", header: "State", render: (n) => <Badge tone={STATE_TONE[n.state]}>{n.state}</Badge> },
              { key: "uptime", header: "Uptime", render: (n) => <span className="mono">{n.uptime}</span> },
            ]}
            rows={data.neighbors}
            getRowId={(n) => n.id}
            emptyTitle="No OSPF neighbors"
            emptyBody="This device has no OSPF adjacencies formed."
          />
        </>
      )}
    </>
  );
}
