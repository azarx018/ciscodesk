import { PageHeader } from "../../components/layout";
import { Badge, DataTable } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { securityService } from "../../services/mock/securityService";
import { PortSecurityEntry } from "../../types/security";

export function PortSecurityPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data: entries, loading } = useAsync(() => securityService.listPortSecurity(deviceId!), [deviceId]);

  return (
    <>
      <PageHeader title="Port Security" subtitle={selectedDevice?.hostname} />
      <DataTable<PortSecurityEntry>
        columns={[
          { key: "interface", header: "Interface", render: (p) => <span className="mono">{p.interfaceName}</span> },
          { key: "status", header: "Status", render: (p) => <Badge tone={p.status === "enabled" ? "online" : "offline"}>{p.status}</Badge> },
          { key: "max", header: "Maximum MAC", align: "right", render: (p) => p.maxMac },
          { key: "learned", header: "Learned MAC", align: "right", render: (p) => p.learnedMac },
          { key: "violationMode", header: "Violation Mode", render: (p) => p.violationMode },
          {
            key: "violationCount",
            header: "Violation Count",
            align: "right",
            render: (p) => (p.violationCount > 0 ? <Badge tone="error">{p.violationCount}</Badge> : "0"),
          },
        ]}
        rows={entries || []}
        getRowId={(p) => p.id}
        loading={loading}
        emptyTitle="No port security configured"
        emptyBody="No interfaces on this device have port security enabled."
      />
    </>
  );
}
