import { PageHeader } from "../../components/layout";
import { DataTable } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { networkServicesService } from "../../services/mock/networkServicesService";
import { DhcpPool } from "../../types/service";

export function DhcpPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data: pools, loading } = useAsync(() => networkServicesService.listDhcpPools(deviceId!), [deviceId]);

  return (
    <>
      <PageHeader title="DHCP" subtitle={selectedDevice?.hostname} />
      <DataTable<DhcpPool>
        columns={[
          { key: "name", header: "Pool", render: (p) => p.name },
          { key: "network", header: "Network", render: (p) => <span className="mono">{p.network}</span> },
          { key: "gateway", header: "Gateway", render: (p) => <span className="mono">{p.gateway}</span> },
          { key: "dns", header: "DNS", render: (p) => <span className="mono text-sm">{p.dns.join(", ")}</span> },
          { key: "range", header: "Lease Range", render: (p) => <span className="mono text-sm">{p.leaseRangeStart} – {p.leaseRangeEnd}</span> },
          {
            key: "active",
            header: "Active Leases",
            align: "right",
            render: (p) => (
              <span className="mono">{p.activeLeases} / {p.totalAddresses}</span>
            ),
          },
        ]}
        rows={pools || []}
        getRowId={(p) => p.id}
        loading={loading}
        emptyTitle="No DHCP pools"
        emptyBody="No DHCP pools are configured on this device."
      />
    </>
  );
}
