import { PageHeader } from "../../components/layout";
import { Badge, DataTable, EmptyState, LoadingState } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { switchingService } from "../../services/mock/switchingService";

const ROLE_TONE = { root: "online", designated: "online", alternate: "warning", backup: "warning", disabled: "offline" } as const;
const STATE_TONE = { forwarding: "online", blocking: "offline", listening: "warning", learning: "warning", disabled: "offline" } as const;

/** STP (§9): per-VLAN spanning tree state — root bridge, root port, and per-port role/state/cost. */
export function StpPage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data: vlanStates, loading } = useAsync(() => switchingService.listStp(deviceId!), [deviceId]);

  return (
    <>
      <PageHeader title="STP" subtitle={selectedDevice?.hostname} />

      {loading ? (
        <LoadingState label="Loading STP state…" />
      ) : !vlanStates || vlanStates.length === 0 ? (
        <EmptyState title="No STP data" body="Spanning tree is not active on this device." />
      ) : (
        vlanStates.map((vlanState) => (
          <section className="cd-panel" key={vlanState.id}>
            <div className="cd-panel-header">
              <span className="cd-panel-title">VLAN {vlanState.vlan}</span>
              <span className="text-xs text-muted">
                Root: <span className="mono">{vlanState.rootBridge}</span>
                {vlanState.rootPort && <> · Root port: <span className="mono">{vlanState.rootPort}</span></>}
              </span>
            </div>
            <div className="cd-panel-body">
              <DataTable
                columns={[
                  { key: "interface", header: "Port", render: (p) => <span className="mono">{p.interfaceName}</span> },
                  { key: "role", header: "Role", render: (p) => <Badge tone={ROLE_TONE[p.role]}>{p.role}</Badge> },
                  { key: "state", header: "State", render: (p) => <Badge tone={STATE_TONE[p.state]}>{p.state}</Badge> },
                  { key: "cost", header: "Path Cost", align: "right", render: (p) => p.pathCost },
                ]}
                rows={vlanState.ports}
                getRowId={(p) => `${vlanState.id}-${p.interfaceName}`}
              />
            </div>
          </section>
        ))
      )}
    </>
  );
}
