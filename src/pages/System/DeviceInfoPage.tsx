import { PageHeader } from "../../components/layout";
import { LoadingState, MetricCard, StatusIndicator } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useInterfaces } from "../../hooks/useInterfaces";

/** Device Information (§15): identity/hardware summary for the selected device. */
export function DeviceInfoPage() {
  const { selectedDevice, loading } = useDeviceContext();
  const { interfaces } = useInterfaces(selectedDevice?.id);

  if (loading || !selectedDevice) {
    return (
      <>
        <PageHeader title="Device Information" />
        <LoadingState label="Loading device…" />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Device Information" subtitle={selectedDevice.hostname} actions={<StatusIndicator tone={selectedDevice.status} label={selectedDevice.status} />} />
      <div className="cd-dash-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <MetricCard label="HOSTNAME" value={<span className="mono">{selectedDevice.hostname}</span>} />
        <MetricCard label="PLATFORM" value={selectedDevice.platform} />
        <MetricCard label="MODEL" value={selectedDevice.model} />
        <MetricCard label="SERIAL" value={<span className="mono">{selectedDevice.serial}</span>} />
        <MetricCard label="OS VERSION" value={<span className="mono">{selectedDevice.osVersion}</span>} />
        <MetricCard label="UPTIME" value={<span className="mono">{selectedDevice.uptime}</span>} />
        <MetricCard label="INTERFACES" value={interfaces.length} />
        <MetricCard label="MANAGEMENT IP" value={<span className="mono">{selectedDevice.managementIp}</span>} />
      </div>
    </>
  );
}
