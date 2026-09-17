import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./InterfaceDetailPage.css";
import { PageHeader } from "../../components/layout";
import {
  Badge,
  Button,
  Checkbox,
  ConfirmDialog,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  Select,
  StatusIndicator,
  Tabs,
  useToast,
} from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { interfaceService } from "../../services/mock/interfaceService";
import { monitoringService } from "../../services/mock/monitoringService";
import { InterfaceConfigDraft } from "../../types/interface";
import { formatBytesPerSecond } from "../../utils/formatters";

const STATUS_TONE = { up: "online", down: "error", "admin-down": "offline" } as const;

function draftFromInterface(i: {
  description: string;
  ipv4?: string;
  prefix?: number;
  status: string;
  speed: string;
  duplex: "full" | "half" | "auto";
  mode: "access" | "trunk" | "routed";
  vlan?: number;
}): InterfaceConfigDraft {
  return {
    description: i.description,
    ipv4: i.ipv4 || "",
    prefix: i.prefix || 24,
    adminStatus: i.status === "admin-down" ? "down" : "up",
    speed: i.speed,
    duplex: i.duplex,
    mode: i.mode,
    vlan: i.vlan,
  };
}

export function InterfaceDetailPage() {
  const { interfaceId } = useParams<{ interfaceId: string }>();
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const navigate = useNavigate();
  const toast = useToast();

  const { data: iface, loading, error, refetch } = useAsync(
    () => interfaceService.get(deviceId!, interfaceId!),
    [deviceId, interfaceId]
  );

  const [draft, setDraft] = useState<InterfaceConfigDraft | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (iface) setDraft(draftFromInterface(iface));
  }, [iface]);

  if (loading) {
    return (
      <>
        <PageHeader title="Interface" />
        <LoadingState label="Loading interface…" />
      </>
    );
  }
  if (error || !iface || !draft) {
    return (
      <>
        <PageHeader title="Interface not found" />
        <ErrorState message={error || "This interface could not be found on the selected device."} onRetry={refetch} />
      </>
    );
  }

  async function handlePreview() {
    setPreviewing(true);
    try {
      const text = await interfaceService.previewConfig(iface!, draft!);
      setPreview(text);
    } finally {
      setPreviewing(false);
    }
  }

  async function handleApply() {
    setApplying(true);
    try {
      await interfaceService.applyConfig(deviceId!, interfaceId!, draft!);
      toast.show(`Configuration applied to ${iface!.name} (simulated).`, "success");
      setPreview(null);
      setConfirmOpen(false);
      refetch();
    } catch (err) {
      toast.show((err as Error).message, "error");
      setConfirmOpen(false);
    } finally {
      setApplying(false);
    }
  }

  function resetDraft() {
    setDraft(draftFromInterface(iface!));
    setPreview(null);
  }

  return (
    <>
      <PageHeader
        title={iface.name}
        subtitle={iface.description || "No description"}
        actions={<StatusIndicator tone={STATUS_TONE[iface.status]} label={iface.status} />}
      />

      <Tabs
        tabs={[
          {
            id: "overview",
            label: "Overview",
            content: (
              <div className="cd-stat-row" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                <div className="cd-stat"><span className="cd-stat-value">{iface.protocol}</span><span className="cd-stat-label">PROTOCOL</span></div>
                <div className="cd-stat"><span className="cd-stat-value">{iface.speed === "auto" ? "auto" : `${iface.speed} Mb/s`}</span><span className="cd-stat-label">SPEED</span></div>
                <div className="cd-stat"><span className="cd-stat-value">{iface.duplex}</span><span className="cd-stat-label">DUPLEX</span></div>
                <div className="cd-stat"><span className="cd-stat-value mono">{iface.ipv4 ? `${iface.ipv4}/${iface.prefix}` : "—"}</span><span className="cd-stat-label">IP ADDRESS</span></div>
                <div className="cd-stat"><span className="cd-stat-value">{iface.mode}</span><span className="cd-stat-label">MODE</span></div>
                <div className="cd-stat"><span className="cd-stat-value">{iface.vlan ?? "—"}</span><span className="cd-stat-label">VLAN</span></div>
              </div>
            ),
          },
          {
            id: "configuration",
            label: "Configuration",
            content: (
              <div>
                <div className="cd-config-form">
                  <Input label="Description" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} />
                  <Select
                    label="Administrative Status"
                    options={[{ value: "up", label: "up (no shutdown)" }, { value: "down", label: "down (shutdown)" }]}
                    value={draft.adminStatus}
                    onChange={(e) => setDraft({ ...draft, adminStatus: e.target.value as "up" | "down" })}
                  />
                  <Input label="IPv4 Address" mono value={draft.ipv4} onChange={(e) => setDraft({ ...draft, ipv4: e.target.value })} placeholder="10.0.0.1" />
                  <Input
                    label="Prefix Length"
                    type="number"
                    value={draft.prefix}
                    onChange={(e) => setDraft({ ...draft, prefix: Number(e.target.value) })}
                  />
                  <Select
                    label="Switchport / Routed Mode"
                    options={[{ value: "access", label: "Access" }, { value: "trunk", label: "Trunk" }, { value: "routed", label: "Routed" }]}
                    value={draft.mode}
                    onChange={(e) => setDraft({ ...draft, mode: e.target.value as InterfaceConfigDraft["mode"] })}
                  />
                  {draft.mode === "access" && (
                    <Input
                      label="VLAN"
                      type="number"
                      value={draft.vlan ?? ""}
                      onChange={(e) => setDraft({ ...draft, vlan: Number(e.target.value) })}
                    />
                  )}
                  <Select
                    label="Speed"
                    options={["auto", "10", "100", "1000", "10000"].map((s) => ({ value: s, label: s === "auto" ? "auto" : `${s} Mb/s` }))}
                    value={draft.speed}
                    onChange={(e) => setDraft({ ...draft, speed: e.target.value })}
                  />
                  <Select
                    label="Duplex"
                    options={[{ value: "auto", label: "auto" }, { value: "full", label: "full" }, { value: "half", label: "half" }]}
                    value={draft.duplex}
                    onChange={(e) => setDraft({ ...draft, duplex: e.target.value as InterfaceConfigDraft["duplex"] })}
                  />
                </div>

                <div className="flex gap-2" style={{ marginTop: 18 }}>
                  <Button variant="primary" onClick={handlePreview} disabled={previewing}>
                    {previewing ? "Generating preview…" : "Preview"}
                  </Button>
                  <Button variant="default" onClick={resetDraft}>Reset</Button>
                </div>

                {preview && (
                  <>
                    <div className="cd-config-preview">{preview}</div>
                    <div className="flex gap-2" style={{ marginTop: 12 }}>
                      <Button variant="primary" onClick={() => setConfirmOpen(true)}>Confirm &amp; Apply</Button>
                      <Button variant="ghost" onClick={() => setPreview(null)}>Cancel</Button>
                    </div>
                  </>
                )}
              </div>
            ),
          },
          {
            id: "traffic",
            label: "Traffic",
            content: <InterfaceTrafficTab deviceId={deviceId!} interfaceName={iface.name} />,
          },
          {
            id: "errors",
            label: "Errors",
            content: (
              <div className="cd-stat-row" style={{ display: "flex", gap: 32 }}>
                <div className="cd-stat"><span className="cd-stat-value" style={{ color: iface.rxErrors ? "var(--status-error)" : undefined }}>{iface.rxErrors}</span><span className="cd-stat-label">RX ERRORS</span></div>
                <div className="cd-stat"><span className="cd-stat-value" style={{ color: iface.txErrors ? "var(--status-error)" : undefined }}>{iface.txErrors}</span><span className="cd-stat-label">TX ERRORS</span></div>
                <div className="cd-stat"><span className="cd-stat-value" style={{ color: iface.crcErrors ? "var(--status-error)" : undefined }}>{iface.crcErrors}</span><span className="cd-stat-label">CRC ERRORS</span></div>
              </div>
            ),
          },
          {
            id: "logs",
            label: "Logs",
            content: <InterfaceLogsTab deviceId={deviceId!} interfaceName={iface.name} />,
          },
        ]}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Apply interface configuration"
        message={`This will apply the previewed configuration to ${iface.name} on ${selectedDevice?.hostname}. This is simulated — no real device is changed.`}
        confirmLabel={applying ? "Applying…" : "Apply"}
        onConfirm={handleApply}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}

function InterfaceTrafficTab({ deviceId, interfaceName }: { deviceId: string; interfaceName: string }) {
  const { data, loading } = useAsync(() => monitoringService.getTraffic(deviceId, interfaceName), [deviceId, interfaceName]);
  if (loading) return <LoadingState label="Loading traffic…" />;
  if (!data) return <EmptyState title="No traffic data" body="This interface has no traffic samples." />;
  const max = Math.max(...data.samples.map((s) => s.rxBps), 1);
  return (
    <div>
      <div className="cd-stat-row" style={{ display: "flex", gap: 32 }}>
        <div className="cd-stat"><span className="cd-stat-value">{data.packets.toLocaleString()}</span><span className="cd-stat-label">PACKETS</span></div>
        <div className="cd-stat"><span className="cd-stat-value">{data.errors}</span><span className="cd-stat-label">ERRORS</span></div>
        <div className="cd-stat"><span className="cd-stat-value">{data.utilizationPercent}%</span><span className="cd-stat-label">UTILIZATION</span></div>
      </div>
      <div className="cd-traffic-bars">
        {data.samples.map((s, i) => (
          <div key={i} className="cd-traffic-bar" style={{ height: `${Math.max(4, (s.rxBps / max) * 90)}px` }} title={formatBytesPerSecond(s.rxBps)} />
        ))}
      </div>
    </div>
  );
}

function InterfaceLogsTab({ deviceId, interfaceName }: { deviceId: string; interfaceName: string }) {
  const { data: logs, loading } = useAsync(() => monitoringService.listLogs(deviceId), [deviceId]);
  if (loading) return <LoadingState label="Loading logs…" />;
  const related = (logs || []).filter((l) => l.message.includes(interfaceName) || l.message.includes(interfaceName.replace("GigabitEthernet", "Gi")));
  if (related.length === 0) return <EmptyState title="No related logs" body={`No log entries mention ${interfaceName}.`} />;
  return (
    <div className="cd-activity-list">
      {related.map((l) => (
        <div className="cd-activity-row" key={l.id}>
          <Badge tone={l.severity === "info" ? "online" : l.severity === "warning" ? "warning" : "error"}>{l.source}</Badge>
          <span className="grow">{l.message}</span>
        </div>
      ))}
    </div>
  );
}
