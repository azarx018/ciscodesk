import { useState } from "react";
import { PageHeader } from "../../components/layout";
import { Badge, DataTable, Select } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { monitoringService } from "../../services/mock/monitoringService";
import { LogEntry, LogSeverity } from "../../types/monitoring";
import { formatRelativeTime } from "../../utils/formatters";

const SEVERITY_TONE: Record<LogSeverity, "online" | "warning" | "error"> = {
  info: "online",
  warning: "warning",
  error: "error",
  critical: "error",
};

/** Logs (§13): Time / Severity / Source / Message, filterable by severity. */
export function LogsPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const [severity, setSeverity] = useState<"all" | LogSeverity>("all");
  const { data: logs, loading } = useAsync(
    () => monitoringService.listLogs(deviceId!, severity === "all" ? undefined : severity),
    [deviceId, severity]
  );

  return (
    <>
      <PageHeader title="Logs" subtitle={selectedDevice?.hostname} />

      <div className="cd-toolbar">
        <Select
          options={[
            { value: "all", label: "All" },
            { value: "info", label: "Info" },
            { value: "warning", label: "Warning" },
            { value: "error", label: "Error" },
            { value: "critical", label: "Critical" },
          ]}
          value={severity}
          onChange={(e) => setSeverity(e.target.value as typeof severity)}
          style={{ maxWidth: 160 }}
        />
      </div>

      <DataTable<LogEntry>
        columns={[
          { key: "time", header: "Time", sortValue: (l) => l.timestamp, render: (l) => <span className="mono text-sm">{formatRelativeTime(l.timestamp)}</span> },
          { key: "severity", header: "Severity", render: (l) => <Badge tone={SEVERITY_TONE[l.severity]}>{l.severity}</Badge> },
          { key: "source", header: "Source", render: (l) => <span className="mono">{l.source}</span> },
          { key: "message", header: "Message", render: (l) => l.message },
        ]}
        rows={logs || []}
        getRowId={(l) => l.id}
        loading={loading}
        emptyTitle="No log entries"
        emptyBody="No log entries match this filter."
      />
    </>
  );
}
