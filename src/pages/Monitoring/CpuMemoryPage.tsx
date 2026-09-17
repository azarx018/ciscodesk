import { PageHeader } from "../../components/layout";
import { LoadingState, MetricCard } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { monitoringService } from "../../services/mock/monitoringService";
import { ResourceHistory } from "../../types/monitoring";

/** CPU / Memory (§13): current/average/peak + a simple history sparkline for each metric. */
export function CpuMemoryPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data: cpu, loading: cpuLoading } = useAsync(() => monitoringService.getResourceHistory(deviceId!, "cpu"), [deviceId]);
  const { data: memory, loading: memLoading } = useAsync(() => monitoringService.getResourceHistory(deviceId!, "memory"), [deviceId]);

  return (
    <>
      <PageHeader title="CPU / Memory" subtitle={selectedDevice?.hostname} />
      <div className="flex-col gap-4">
        <ResourcePanel title="CPU" data={cpu} loading={cpuLoading} />
        <ResourcePanel title="Memory" data={memory} loading={memLoading} />
      </div>
    </>
  );
}

function ResourcePanel({ title, data, loading }: { title: string; data: ResourceHistory | null; loading: boolean }) {
  return (
    <section className="cd-panel">
      <div className="cd-panel-header">
        <span className="cd-panel-title">{title}</span>
      </div>
      <div className="cd-panel-body">
        {loading || !data ? (
          <LoadingState label={`Loading ${title.toLowerCase()} history…`} />
        ) : (
          <>
            <div className="flex gap-4 flex-wrap" style={{ marginBottom: 14 }}>
              <MetricCard label="CURRENT" value={data.current} unit="%" meter={data.current} />
              <MetricCard label="AVERAGE" value={data.average} unit="%" />
              <MetricCard label="PEAK" value={data.peak} unit="%" />
            </div>
            <div style={{ display: "flex", gap: 3, height: 70, alignItems: "flex-end" }}>
              {data.history.map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    background: h.value > 80 ? "var(--status-error)" : h.value > 60 ? "var(--status-warning)" : "var(--accent)",
                    borderRadius: "2px 2px 0 0",
                    height: `${Math.max(3, h.value)}%`,
                  }}
                  title={`${h.value}%`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
