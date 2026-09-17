import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TopologyPage.css";
import { PageHeader } from "../../components/layout";
import { Badge, Button, LoadingState, StatusIndicator } from "../../components/ui";
import { useAsync } from "../../hooks/useAsync";
import { topologyService } from "../../services/mock/topologyService";
import { useDeviceContext } from "../../stores/DeviceContext";
import { TopologyNode } from "../../types/topology";

const STATUS_COLOR: Record<TopologyNode["status"], string> = {
  online: "var(--status-online)",
  warning: "var(--status-warning)",
  error: "var(--status-error)",
  offline: "var(--status-offline)",
};

/** Topology (§14): a functional node/link canvas built from the device inventory + link state. */
export function TopologyPage() {
  const { data, loading } = useAsync(() => topologyService.get(), []);
  const [selected, setSelected] = useState<TopologyNode | null>(null);
  const { selectDevice } = useDeviceContext();
  const navigate = useNavigate();

  if (loading || !data) {
    return (
      <>
        <PageHeader title="Topology" />
        <LoadingState label="Loading topology…" />
      </>
    );
  }

  const nodeById = new Map(data.nodes.map((n) => [n.id, n]));

  return (
    <>
      <PageHeader title="Topology" subtitle={`${data.nodes.length} devices · ${data.links.length} links`} />

      <div className="cd-topo-canvas-wrap">
        <svg width={600} height={470} viewBox="0 0 600 470">
          {data.links.map((link) => {
            const src = nodeById.get(link.sourceNodeId);
            const tgt = nodeById.get(link.targetNodeId);
            if (!src || !tgt) return null;
            const midX = (src.x + tgt.x) / 2;
            const midY = (src.y + tgt.y) / 2;
            return (
              <g key={link.id}>
                <line
                  x1={src.x} y1={src.y + 18} x2={tgt.x} y2={tgt.y - 18}
                  stroke={link.status === "up" ? "var(--border-strong)" : "var(--status-error)"}
                  strokeWidth={link.status === "up" ? 1.5 : 1.5}
                  strokeDasharray={link.status === "up" ? undefined : "4 3"}
                />
                <text x={midX + 6} y={midY} className="cd-topo-link-label">{link.speed}</text>
              </g>
            );
          })}
          {data.nodes.map((node) => (
            <g
              key={node.id}
              className="cd-topo-node-box"
              onClick={() => setSelected(node)}
              transform={`translate(${node.x - 60}, ${node.y - 18})`}
            >
              <rect width={120} height={36} rx={5} fill="var(--surface-raised)" stroke={selected?.id === node.id ? "var(--accent)" : "var(--border-strong)"} strokeWidth={selected?.id === node.id ? 2 : 1} />
              <circle cx={12} cy={18} r={4} fill={STATUS_COLOR[node.status]} />
              <text x={22} y={15} className="cd-topo-node-label">{node.hostname}</text>
              <text x={22} y={27} className="cd-topo-node-sub">{node.managementIp}</text>
            </g>
          ))}
        </svg>
      </div>

      {selected && (
        <section className="cd-panel cd-topo-detail">
          <div className="cd-panel-header">
            <span className="cd-panel-title mono">{selected.hostname}</span>
            <StatusIndicator tone={selected.status} label={selected.status} />
          </div>
          <div className="cd-panel-body flex-col gap-2">
            <div className="text-sm"><span className="text-muted">Type</span> — {selected.type}</div>
            <div className="text-sm"><span className="text-muted">Management IP</span> — <span className="mono">{selected.managementIp}</span></div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                selectDevice(selected.deviceId);
                navigate("/system/device-info");
              }}
            >
              View device information
            </Button>
          </div>
        </section>
      )}
    </>
  );
}
