import "./DashboardPage.css";
import { PageHeader } from "../../components/layout";
import { Badge, Button, EmptyState, LoadingState, MetricCard, StatusIndicator } from "../../components/ui";
import { Icon } from "../../components/icons/Icon";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useInterfaces } from "../../hooks/useInterfaces";
import { useAsync } from "../../hooks/useAsync";
import { monitoringService } from "../../services/mock/monitoringService";
import { formatBytesPerSecond, formatRelativeTime } from "../../utils/formatters";
import { LogSeverity } from "../../types/monitoring";

const SEVERITY_TONE: Record<LogSeverity, "online" | "warning" | "error"> = {
  info: "online",
  warning: "warning",
  error: "error",
  critical: "error",
};

/**
 * Full Dashboard (§7): device metrics, interface overview, aggregate
 * traffic, alerts derived from live mock state, and a recent-activity
 * feed sourced from the device's logs — all scoped to whichever
 * device is selected in the topbar.
 */
export function DashboardPage() {
  const { selectedDevice, loading: deviceLoading } = useDeviceContext();
  const deviceId = selectedDevice?.id;

  const { interfaces, loading: ifLoading } = useInterfaces(deviceId);
  const {
    data: logs,
    loading: logsLoading,
    error: logsError,
    refetch: refetchLogs,
  } = useAsync(() => monitoringService.listLogs(deviceId!), [deviceId]);

  if (deviceLoading || !selectedDevice) {
    return (
      <>
        <PageHeader title="Dashboard" />
        <LoadingState label="Loading device…" />
      </>
    );
  }

  const up = interfaces.filter((i) => i.status === "up").length;
  const down = interfaces.filter((i) => i.status === "down").length;
  const adminDown = interfaces.filter((i) => i.status === "admin-down").length;
  const totalRx = interfaces.reduce((s, i) => s + i.rxBps, 0);
  const totalTx = interfaces.reduce((s, i) => s + i.txBps, 0);
  const avgUtilization =
    interfaces.length === 0 ? 0 : Math.round((totalRx / (interfaces.length * 1_000_000_000)) * 100);

  const alerts: { severity: "error" | "warning"; message: string }[] = [];
  if (selectedDevice.status === "offline" || selectedDevice.status === "error") {
    alerts.push({ severity: "error", message: `Device unreachable — ${selectedDevice.hostname}` });
  }
  if (selectedDevice.cpu > 60) alerts.push({ severity: "warning", message: `High CPU — ${selectedDevice.cpu}%` });
  if (selectedDevice.memory > 70) alerts.push({ severity: "warning", message: `High memory — ${selectedDevice.memory}%` });
  interfaces
    .filter((i) => i.status === "down")
    .forEach((i) => alerts.push({ severity: "error", message: `Interface down — ${i.name}` }));
  interfaces
    .filter((i) => i.status === "up" && i.rxBps > 350_000_000)
    .forEach((i) => alerts.push({ severity: "warning", message: `High interface utilization — ${i.name}` }));

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={selectedDevice.hostname}
        actions={
          <>
            <StatusIndicator tone={selectedDevice.status} label={selectedDevice.status} />
            <Button variant="ghost" size="sm" onClick={refetchLogs}>
              Refresh
            </Button>
          </>
        }
      />

      <div className="cd-dash-grid">
        <MetricCard label="CPU" value={selectedDevice.cpu} unit="%" meter={selectedDevice.cpu} tone={selectedDevice.cpu > 60 ? "warning" : "default"} />
        <MetricCard label="MEMORY" value={selectedDevice.memory} unit="%" meter={selectedDevice.memory} tone={selectedDevice.memory > 70 ? "warning" : "default"} />
        <MetricCard label="TEMPERATURE" value={selectedDevice.temperature} unit="°C" meter={selectedDevice.temperature} tone={selectedDevice.temperature > 55 ? "error" : "default"} />
        <MetricCard label="UPTIME" value={<span className="mono">{selectedDevice.uptime}</span>} />
      </div>

      <div className="cd-dash-cols">
        <div>
          <section className="cd-panel">
            <div className="cd-panel-header">
              <span className="cd-panel-title">Interface overview</span>
            </div>
            <div className="cd-panel-body">
              {ifLoading ? (
                <LoadingState label="Loading interfaces…" />
              ) : (
                <div className="cd-stat-row">
                  <div className="cd-stat">
                    <span className="cd-stat-value">{interfaces.length}</span>
                    <span className="cd-stat-label">TOTAL</span>
                  </div>
                  <div className="cd-stat">
                    <span className="cd-stat-value" style={{ color: "var(--status-online)" }}>{up}</span>
                    <span className="cd-stat-label">UP</span>
                  </div>
                  <div className="cd-stat">
                    <span className="cd-stat-value" style={{ color: "var(--status-error)" }}>{down}</span>
                    <span className="cd-stat-label">DOWN</span>
                  </div>
                  <div className="cd-stat">
                    <span className="cd-stat-value" style={{ color: "var(--text-muted)" }}>{adminDown}</span>
                    <span className="cd-stat-label">ADMIN DOWN</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="cd-panel">
            <div className="cd-panel-header">
              <span className="cd-panel-title">Traffic</span>
            </div>
            <div className="cd-panel-body">
              {ifLoading ? (
                <LoadingState label="Loading traffic…" />
              ) : (
                <div className="cd-stat-row">
                  <div className="cd-stat">
                    <span className="cd-stat-value">{formatBytesPerSecond(totalRx)}</span>
                    <span className="cd-stat-label">TOTAL RX</span>
                  </div>
                  <div className="cd-stat">
                    <span className="cd-stat-value">{formatBytesPerSecond(totalTx)}</span>
                    <span className="cd-stat-label">TOTAL TX</span>
                  </div>
                  <div className="cd-stat">
                    <span className="cd-stat-value">{avgUtilization}%</span>
                    <span className="cd-stat-label">AVG UTILIZATION</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="cd-panel">
            <div className="cd-panel-header">
              <span className="cd-panel-title">Alerts</span>
              <Badge tone="outline">{alerts.length}</Badge>
            </div>
            <div className="cd-panel-body">
              {alerts.length === 0 ? (
                <EmptyState title="No active alerts" body="Nothing needs attention on this device right now." />
              ) : (
                <div className="cd-alert-list">
                  {alerts.map((a, idx) => (
                    <div className="cd-alert-row" key={idx}>
                      <StatusIndicator tone={a.severity} />
                      <span>{a.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="cd-panel">
          <div className="cd-panel-header">
            <span className="cd-panel-title">Recent activity</span>
          </div>
          <div className="cd-panel-body">
            {logsLoading ? (
              <LoadingState label="Loading activity…" />
            ) : logsError ? (
              <EmptyState title="Couldn't load activity" body={logsError} />
            ) : !logs || logs.length === 0 ? (
              <EmptyState title="No recent activity" body="Nothing has happened on this device recently." />
            ) : (
              <div className="cd-activity-list">
                {logs.slice(0, 8).map((log) => (
                  <div className="cd-activity-row" key={log.id}>
                    <Badge tone={SEVERITY_TONE[log.severity]}>{log.source}</Badge>
                    <span className="grow">{log.message}</span>
                    <span className="cd-activity-time">{formatRelativeTime(log.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
