import { PageHeader } from "../../components/layout";
import { LoadingState, MetricCard, StatusIndicator } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";

/**
 * Minimal Phase-2/3 placeholder for the real Dashboard (built out
 * fully in Phase 4 §7). Shows just enough — bound to the selected
 * device — to prove the shell's device context actually flows into
 * pages through the mock service layer (§22).
 */
export function DashboardPage() {
  const { selectedDevice, loading } = useDeviceContext();

  if (loading || !selectedDevice) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <LoadingState label="Loading device…" />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`Overview for ${selectedDevice.hostname}`}
        actions={<StatusIndicator tone={selectedDevice.status} label={selectedDevice.status} />}
      />
      <div className="flex gap-4 flex-wrap">
        <MetricCard label="MANAGEMENT IP" value={<span className="mono">{selectedDevice.managementIp}</span>} />
        <MetricCard label="PLATFORM" value={selectedDevice.platform} />
        <MetricCard label="OS VERSION" value={<span className="mono">{selectedDevice.osVersion}</span>} />
        <MetricCard label="UPTIME" value={<span className="mono">{selectedDevice.uptime}</span>} />
      </div>
      <p className="text-sm text-muted" style={{ marginTop: 20 }}>
        Full metrics, interface overview, traffic, alerts and recent activity (§7) are built in
        Phase 4 once the mock data architecture (Phase 3) is in place.
      </p>
    </>
  );
}
