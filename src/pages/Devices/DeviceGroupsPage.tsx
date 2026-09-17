import "./DeviceGroupsPage.css";
import { PageHeader } from "../../components/layout";
import { EmptyState, LoadingState, StatusIndicator } from "../../components/ui";
import { useDevices } from "../../hooks/useDevices";
import { DEVICE_GROUPS_MOCK } from "../../data/devices";

/** Device Groups (§6): devices bucketed by their assigned group. */
export function DeviceGroupsPage() {
  const { devices, loading } = useDevices();

  return (
    <>
      <PageHeader title="Device Groups" subtitle="Devices bucketed by assigned group" />
      {loading ? (
        <LoadingState label="Loading groups…" />
      ) : (
        <div className="cd-group-grid">
          {DEVICE_GROUPS_MOCK.map((group) => {
            const groupDevices = devices.filter((d) => d.group === group);
            return (
              <div className="cd-group-card" key={group}>
                <div className="cd-group-name">{group}</div>
                <div className="cd-group-count">
                  {groupDevices.length} device{groupDevices.length === 1 ? "" : "s"}
                </div>
                {groupDevices.length === 0 ? (
                  <EmptyState title="No devices" body="No devices assigned to this group yet." />
                ) : (
                  <div className="cd-group-devices">
                    {groupDevices.map((d) => (
                      <div className="cd-group-device-row" key={d.id}>
                        <StatusIndicator tone={d.status} />
                        <span className="mono">{d.hostname}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
