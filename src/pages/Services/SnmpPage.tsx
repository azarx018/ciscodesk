import { PageHeader } from "../../components/layout";
import { Badge, DataTable, EmptyState, LoadingState, MetricCard } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { networkServicesService } from "../../services/mock/networkServicesService";

export function SnmpPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data, loading } = useAsync(() => networkServicesService.getSnmp(deviceId!), [deviceId]);

  return (
    <>
      <PageHeader title="SNMP" subtitle={selectedDevice?.hostname} />
      {loading ? (
        <LoadingState label="Loading SNMP configuration…" />
      ) : !data ? (
        <EmptyState title="SNMP not configured" body="No SNMP configuration found on this device." />
      ) : (
        <>
          <div className="flex gap-4 flex-wrap" style={{ marginBottom: 20 }}>
            <MetricCard label="VERSION" value={data.version.toUpperCase()} />
            <MetricCard label="STATUS" value={<Badge tone={data.status === "enabled" ? "online" : "offline"}>{data.status}</Badge>} />
            <MetricCard label="COMMUNITY" value={<span className="mono">{data.maskedCommunity}</span>} />
          </div>
          <DataTable
            columns={[
              { key: "address", header: "Manager Target", render: (t) => <span className="mono">{t.address}</span> },
              { key: "port", header: "Port", align: "right", render: (t) => t.port },
            ]}
            rows={data.targets}
            getRowId={(t) => t.id}
            emptyTitle="No manager targets"
            emptyBody="No SNMP trap/manager destinations configured."
          />
        </>
      )}
    </>
  );
}
