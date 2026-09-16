import { useState } from "react";
import "./FoundationPage.css";
import { PageHeader } from "../../components/layout";
import {
  Badge,
  Button,
  Checkbox,
  ConfirmDialog,
  DataTable,
  EmptyState,
  ErrorState,
  Input,
  LoadingState,
  MetricCard,
  Modal,
  Select,
  StatusIndicator,
  Tabs,
  Tooltip,
  useToast,
} from "../../components/ui";

interface DemoRow {
  id: string;
  hostname: string;
  ip: string;
  status: "online" | "warning" | "error" | "offline";
  cpu: number;
}

const DEMO_ROWS: DemoRow[] = [
  { id: "1", hostname: "CORE-RTR-01", ip: "10.0.0.1", status: "online", cpu: 23 },
  { id: "2", hostname: "CORE-SW-01", ip: "10.0.0.2", status: "online", cpu: 31 },
  { id: "3", hostname: "ACCESS-SW-01", ip: "10.0.1.10", status: "warning", cpu: 68 },
  { id: "4", hostname: "EDGE-RTR-01", ip: "203.0.113.1", status: "error", cpu: 12 },
  { id: "5", hostname: "BRANCH-SW-01", ip: "10.0.4.5", status: "offline", cpu: 0 },
];

/**
 * Living style guide / smoke test for every reusable primitive
 * (Phase 1 deliverable). Not part of the real navigation — reachable
 * only via the footer link in the sidebar — kept around as a
 * reference and regression check as pages are built out.
 */
export function FoundationPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const toast = useToast();

  return (
    <>
      <PageHeader
        title="Design foundation"
        subtitle="Tokens, typography and reusable primitives — Phase 1"
        actions={
          <>
            <Button variant="ghost" onClick={() => toast.show("This is a toast notification.", "info")}>
              Show toast
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(true)}>
              Open modal
            </Button>
          </>
        }
      />

      <div className="flex-col gap-4">
        <section className="cd-panel">
          <div className="cd-panel-header">
            <span className="cd-panel-title">Color tokens</span>
          </div>
          <div className="cd-panel-body cd-swatch-row">
            {[
              ["--surface", "Surface"],
              ["--surface-raised", "Raised"],
              ["--accent", "Accent"],
              ["--status-online", "Online"],
              ["--status-warning", "Warning"],
              ["--status-error", "Error"],
              ["--status-offline", "Offline"],
            ].map(([token, label]) => (
              <div className="cd-swatch" key={token}>
                <div className="cd-swatch-color" style={{ background: `var(${token})` }} />
                <span className="cd-swatch-label">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="cd-panel">
          <div className="cd-panel-header">
            <span className="cd-panel-title">Typography</span>
          </div>
          <div className="cd-panel-body flex-col gap-2">
            <div className="text-xl">Interface configuration — text-xl</div>
            <div className="text-lg">GigabitEthernet0/1 — text-lg</div>
            <div className="text-md">Applied to running-config — text-md</div>
            <div className="text-base">Body copy at text-base for dense tables and forms.</div>
            <div className="text-sm text-secondary">Secondary text-sm, used for meta rows.</div>
            <div className="mono text-sm">10.0.0.1/30 · Gi0/0/1 · mono for addresses & counters</div>
          </div>
        </section>

        <section className="cd-gallery-grid">
          <div className="cd-panel">
            <div className="cd-panel-header">
              <span className="cd-panel-title">Metrics</span>
            </div>
            <div className="cd-panel-body flex gap-4">
              <MetricCard label="CPU" value={23} unit="%" meter={23} />
              <MetricCard label="MEMORY" value={68} unit="%" tone="warning" meter={68} />
              <MetricCard label="TEMP" value={82} unit="°C" tone="error" meter={92} />
            </div>
          </div>

          <div className="cd-panel">
            <div className="cd-panel-header">
              <span className="cd-panel-title">Status &amp; badges</span>
            </div>
            <div className="cd-panel-body flex-col gap-2">
              <StatusIndicator tone="online" label="Online" />
              <StatusIndicator tone="warning" label="Degraded" pulse />
              <StatusIndicator tone="error" label="Unreachable" />
              <div className="flex gap-2" style={{ marginTop: 6 }}>
                <Badge tone="online">up</Badge>
                <Badge tone="warning">flapping</Badge>
                <Badge tone="error">down</Badge>
                <Badge tone="outline">admin-down</Badge>
              </div>
            </div>
          </div>

          <div className="cd-panel">
            <div className="cd-panel-header">
              <span className="cd-panel-title">Form controls</span>
            </div>
            <div className="cd-panel-body flex-col gap-3">
              <Input label="Hostname / Management IP" placeholder="10.0.0.1" mono />
              <Select
                label="Connection Method"
                placeholder="Select method"
                options={[
                  { value: "ssh", label: "SSH" },
                  { value: "netconf", label: "NETCONF" },
                  { value: "restconf", label: "RESTCONF" },
                  { value: "auto", label: "Auto Detect" },
                ]}
              />
              <Checkbox label="Enable periodic health polling" defaultChecked />
              <div className="flex gap-2">
                <Button variant="primary">Apply</Button>
                <Button variant="default">Cancel</Button>
                <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                  Delete device
                </Button>
              </div>
            </div>
          </div>

          <div className="cd-panel">
            <div className="cd-panel-header">
              <span className="cd-panel-title">Tabs</span>
            </div>
            <div className="cd-panel-body">
              <Tabs
                tabs={[
                  { id: "overview", label: "Overview", content: <p className="text-sm text-secondary">Overview content.</p> },
                  { id: "config", label: "Configuration", content: <p className="text-sm text-secondary">Configuration content.</p> },
                  { id: "traffic", label: "Traffic", content: <p className="text-sm text-secondary">Traffic content.</p> },
                ]}
              />
            </div>
          </div>
        </section>

        <section className="cd-panel">
          <div className="cd-panel-header">
            <span className="cd-panel-title">Data table</span>
            <Tooltip content="Sortable, selectable — shared by every list page">
              <Badge tone="outline">shared component</Badge>
            </Tooltip>
          </div>
          <div className="cd-panel-body">
            <DataTable<DemoRow>
              columns={[
                { key: "hostname", header: "Hostname", render: (r) => <span className="mono">{r.hostname}</span>, sortValue: (r) => r.hostname },
                { key: "ip", header: "Management IP", render: (r) => <span className="mono">{r.ip}</span>, sortValue: (r) => r.ip },
                { key: "status", header: "Status", render: (r) => <StatusIndicator tone={r.status} label={r.status} /> },
                { key: "cpu", header: "CPU", render: (r) => `${r.cpu}%`, sortValue: (r) => r.cpu, align: "right" },
              ]}
              rows={DEMO_ROWS}
              getRowId={(r) => r.id}
              selectable
              selectedIds={selected}
              onSelectionChange={setSelected}
            />
          </div>
        </section>

        <section className="cd-gallery-grid">
          <div className="cd-panel">
            <div className="cd-panel-header">
              <span className="cd-panel-title">Empty state</span>
            </div>
            <div className="cd-panel-body">
              <EmptyState title="No ACL rules yet" body="Create a rule to start filtering traffic on this interface." />
            </div>
          </div>
          <div className="cd-panel">
            <div className="cd-panel-header">
              <span className="cd-panel-title">Loading state</span>
            </div>
            <div className="cd-panel-body">
              <LoadingState label="Fetching interface counters…" />
            </div>
          </div>
          <div className="cd-panel">
            <div className="cd-panel-header">
              <span className="cd-panel-title">Error state</span>
            </div>
            <div className="cd-panel-body">
              <ErrorState message="Device unreachable — the last successful poll was 6 minutes ago." onRetry={() => toast.show("Retrying…")} />
            </div>
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete device"
        message="This will remove CORE-RTR-01 from CiscoDesk's local mock inventory. This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          setConfirmOpen(false);
          toast.show("CORE-RTR-01 removed (simulated).", "success");
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Example modal">
        <p className="text-sm text-secondary">
          This modal, the confirm dialog, drawer and toast all share the same overlay and
          elevation tokens so dialogs feel consistent across every workflow.
        </p>
      </Modal>
    </>
  );
}
