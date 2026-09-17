import { useEffect, useState } from "react";
import { PageHeader } from "../../components/layout";
import { EmptyState, LoadingState, Select } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useInterfaces } from "../../hooks/useInterfaces";
import { useAsync } from "../../hooks/useAsync";
import { monitoringService } from "../../services/mock/monitoringService";
import { formatBytesPerSecond } from "../../utils/formatters";

/** Traffic (§13): interface selector + RX/TX/packets/errors/utilization for the chosen interface. */
export function TrafficPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { interfaces, loading: ifLoading } = useInterfaces(deviceId);
  const [selectedName, setSelectedName] = useState<string>("");

  useEffect(() => {
    if (interfaces.length > 0 && !selectedName) setSelectedName(interfaces[0].name);
  }, [interfaces, selectedName]);

  const { data, loading } = useAsync(
    () => monitoringService.getTraffic(deviceId!, selectedName),
    [deviceId, selectedName]
  );

  return (
    <>
      <PageHeader title="Traffic" subtitle={selectedDevice?.hostname} />

      <div style={{ maxWidth: 280, marginBottom: 16 }}>
        <Select
          label="Interface"
          options={interfaces.map((i) => ({ value: i.name, label: i.name }))}
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          disabled={ifLoading || interfaces.length === 0}
        />
      </div>

      {ifLoading || loading ? (
        <LoadingState label="Loading traffic…" />
      ) : !data ? (
        <EmptyState title="No traffic data" body="Select an interface to view its traffic." />
      ) : (
        <section className="cd-panel">
          <div className="cd-panel-body">
            <div className="cd-stat-row" style={{ marginBottom: 14 }}>
              <div className="cd-stat"><span className="cd-stat-value">{formatBytesPerSecond(data.samples[data.samples.length - 1]?.rxBps ?? 0)}</span><span className="cd-stat-label">RX</span></div>
              <div className="cd-stat"><span className="cd-stat-value">{formatBytesPerSecond(data.samples[data.samples.length - 1]?.txBps ?? 0)}</span><span className="cd-stat-label">TX</span></div>
              <div className="cd-stat"><span className="cd-stat-value">{data.packets.toLocaleString()}</span><span className="cd-stat-label">PACKETS</span></div>
              <div className="cd-stat"><span className="cd-stat-value" style={{ color: data.errors ? "var(--status-error)" : undefined }}>{data.errors}</span><span className="cd-stat-label">ERRORS</span></div>
              <div className="cd-stat"><span className="cd-stat-value">{data.utilizationPercent}%</span><span className="cd-stat-label">UTILIZATION</span></div>
            </div>
            <TrafficBars samples={data.samples} />
          </div>
        </section>
      )}
    </>
  );
}

function TrafficBars({ samples }: { samples: { rxBps: number; txBps: number }[] }) {
  const max = Math.max(...samples.map((s) => Math.max(s.rxBps, s.txBps)), 1);
  return (
    <div style={{ display: "flex", gap: 4, height: 100, alignItems: "flex-end" }}>
      {samples.map((s, i) => (
        <div key={i} style={{ flex: 1, display: "flex", gap: 2, alignItems: "flex-end", height: "100%" }}>
          <div style={{ flex: 1, background: "var(--accent)", borderRadius: "2px 2px 0 0", height: `${Math.max(3, (s.rxBps / max) * 100)}%` }} title={formatBytesPerSecond(s.rxBps)} />
          <div style={{ flex: 1, background: "var(--status-warning)", borderRadius: "2px 2px 0 0", height: `${Math.max(3, (s.txBps / max) * 100)}%` }} title={formatBytesPerSecond(s.txBps)} />
        </div>
      ))}
    </div>
  );
}
