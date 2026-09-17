import { PageHeader } from "../../components/layout";
import { Badge, LoadingState, MetricCard } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { monitoringService } from "../../services/mock/monitoringService";

const OK_TONE = { normal: "online", degraded: "warning", failed: "error" } as const;

/** Health (§13): CPU/memory/temperature/power/fans/storage/uptime/interface health snapshot. */
export function HealthPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data, loading } = useAsync(() => monitoringService.getHealth(deviceId!), [deviceId]);

  if (loading || !data) {
    return (
      <>
        <PageHeader title="Health" subtitle={selectedDevice?.hostname} />
        <LoadingState label="Loading health snapshot…" />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Health" subtitle={selectedDevice?.hostname} />
      <div className="cd-dash-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20 }}>
        <MetricCard label="CPU" value={data.cpu} unit="%" meter={data.cpu} tone={data.cpu > 60 ? "warning" : "default"} />
        <MetricCard label="MEMORY" value={data.memory} unit="%" meter={data.memory} tone={data.memory > 70 ? "warning" : "default"} />
        <MetricCard label="TEMPERATURE" value={data.temperature} unit="°C" tone={data.temperature > 55 ? "error" : "default"} />
        <MetricCard label="UPTIME" value={<span className="mono">{data.uptime}</span>} />
      </div>
      <section className="cd-panel">
        <div className="cd-panel-header"><span className="cd-panel-title">Hardware &amp; interfaces</span></div>
        <div className="cd-panel-body cd-stat-row">
          <div className="cd-stat"><Badge tone={OK_TONE[data.power]}>{data.power}</Badge><span className="cd-stat-label">POWER</span></div>
          <div className="cd-stat"><Badge tone={OK_TONE[data.fans]}>{data.fans}</Badge><span className="cd-stat-label">FANS</span></div>
          <div className="cd-stat"><span className="cd-stat-value">{data.storagePercent}%</span><span className="cd-stat-label">STORAGE USED</span></div>
          <div className="cd-stat"><span className="cd-stat-value" style={{ color: "var(--status-online)" }}>{data.interfacesUp}</span><span className="cd-stat-label">INTERFACES UP</span></div>
          <div className="cd-stat"><span className="cd-stat-value" style={{ color: "var(--status-error)" }}>{data.interfacesDown}</span><span className="cd-stat-label">INTERFACES DOWN</span></div>
        </div>
      </section>
    </>
  );
}
