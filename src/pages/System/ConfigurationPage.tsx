import "./ConfigurationPage.css";
import { PageHeader } from "../../components/layout";
import { EmptyState, LoadingState, Tabs } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { systemService } from "../../services/mock/systemService";

/** Configuration (§15): Running / Startup / Diff / History tabs. */
export function ConfigurationPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data, loading } = useAsync(() => systemService.getConfig(deviceId!), [deviceId]);

  if (loading || !data) {
    return (
      <>
        <PageHeader title="Configuration" subtitle={selectedDevice?.hostname} />
        <LoadingState label="Loading configuration…" />
      </>
    );
  }

  if (!data.snapshot) {
    return (
      <>
        <PageHeader title="Configuration" subtitle={selectedDevice?.hostname} />
        <EmptyState title="No configuration on file" body="No running/startup configuration has been captured for this device yet." />
      </>
    );
  }

  const runningLines = data.snapshot.running.split("\n");
  const startupLines = new Set(data.snapshot.startup.split("\n"));

  return (
    <>
      <PageHeader title="Configuration" subtitle={selectedDevice?.hostname} />
      <Tabs
        tabs={[
          { id: "running", label: "Running Config", content: <pre className="cd-config-block">{data.snapshot.running}</pre> },
          { id: "startup", label: "Startup Config", content: <pre className="cd-config-block">{data.snapshot.startup}</pre> },
          {
            id: "diff",
            label: "Diff",
            content: (
              <pre className="cd-config-block">
                {runningLines.map((line, i) => (
                  <div key={i} className={!startupLines.has(line) && line.trim() ? "cd-diff-add" : undefined}>
                    {!startupLines.has(line) && line.trim() ? "+ " : "  "}
                    {line}
                  </div>
                ))}
              </pre>
            ),
          },
          {
            id: "history",
            label: "History",
            content:
              data.history.length === 0 ? (
                <EmptyState title="No configuration history" body="No configuration changes have been recorded yet." />
              ) : (
                <div className="cd-activity-list">
                  {data.history.map((h) => (
                    <div className="cd-activity-row" key={h.id}>
                      <span className="text-muted mono text-sm" style={{ width: 140, flex: "none" }}>{new Date(h.timestamp).toLocaleString()}</span>
                      <span className="grow">{h.summary}</span>
                      <span className="text-muted text-sm">{h.user}</span>
                    </div>
                  ))}
                </div>
              ),
          },
        ]}
      />
    </>
  );
}
