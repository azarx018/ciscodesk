import { PageHeader } from "../../components/layout";
import { Badge, DataTable } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { networkServicesService } from "../../services/mock/networkServicesService";
import { NtpServer } from "../../types/service";

export function NtpPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data: servers, loading } = useAsync(() => networkServicesService.listNtp(deviceId!), [deviceId]);

  return (
    <>
      <PageHeader title="NTP" subtitle={selectedDevice?.hostname} />
      <DataTable<NtpServer>
        columns={[
          { key: "address", header: "Server", render: (s) => <span className="mono">{s.address}</span> },
          { key: "stratum", header: "Stratum", align: "right", render: (s) => s.stratum },
          { key: "offset", header: "Offset", align: "right", render: (s) => <span className="mono">{s.offsetMs.toFixed(1)} ms</span> },
          { key: "sync", header: "Synchronized", render: (s) => <Badge tone={s.synchronized ? "online" : "error"}>{s.synchronized ? "synced" : "unsynced"}</Badge> },
        ]}
        rows={servers || []}
        getRowId={(s) => s.id}
        loading={loading}
        emptyTitle="No NTP servers"
        emptyBody="No NTP servers are configured on this device."
      />
    </>
  );
}
