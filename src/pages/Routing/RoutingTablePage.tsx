import { PageHeader } from "../../components/layout";
import { Badge, DataTable } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { routingService } from "../../services/mock/routingService";
import { RouteEntry } from "../../types/routing";

const PROTOCOL_TONE = { connected: "outline", static: "outline", ospf: "online", bgp: "warning", eigrp: "outline" } as const;

export function RoutingTablePage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data: routes, loading } = useAsync(() => routingService.listRoutes(deviceId!), [deviceId]);

  return (
    <>
      <PageHeader title="Routing Table" subtitle={selectedDevice?.hostname} />
      <DataTable<RouteEntry>
        columns={[
          { key: "protocol", header: "Protocol", sortValue: (r) => r.protocol, render: (r) => <Badge tone={PROTOCOL_TONE[r.protocol]}>{r.protocol.toUpperCase()}</Badge> },
          { key: "prefix", header: "Prefix", sortValue: (r) => r.prefix, render: (r) => <span className="mono">{r.prefix}</span> },
          { key: "nextHop", header: "Next Hop", render: (r) => <span className="mono">{r.nextHop}</span> },
          { key: "interface", header: "Interface", render: (r) => <span className="mono">{r.interfaceName}</span> },
          { key: "metric", header: "Metric", align: "right", render: (r) => r.metric },
          { key: "ad", header: "Admin Distance", align: "right", render: (r) => r.adminDistance },
        ]}
        rows={routes || []}
        getRowId={(r) => r.id}
        loading={loading}
        emptyTitle="No routes"
        emptyBody="The routing table for this device is empty."
      />
    </>
  );
}
