import { PageHeader } from "../../components/layout";
import { Badge, EmptyState, LoadingState, MetricCard } from "../../components/ui";
import { useDeviceContext } from "../../stores/DeviceContext";
import { useAsync } from "../../hooks/useAsync";
import { systemService } from "../../services/mock/systemService";

const RELEASE_TONE = { "up-to-date": "online", "update-available": "warning", unsupported: "error" } as const;

export function FirmwarePage() {
  const { selectedDevice } = useDeviceContext();
  const deviceId = selectedDevice?.id;
  const { data, loading } = useAsync(() => systemService.getFirmware(deviceId!), [deviceId]);

  if (loading) {
    return (
      <>
        <PageHeader title="Firmware" subtitle={selectedDevice?.hostname} />
        <LoadingState label="Loading firmware information…" />
      </>
    );
  }
  if (!data) {
    return (
      <>
        <PageHeader title="Firmware" subtitle={selectedDevice?.hostname} />
        <EmptyState title="No firmware information" body="No firmware metadata is available for this device." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Firmware" subtitle={selectedDevice?.hostname} actions={<Badge tone={RELEASE_TONE[data.releaseStatus]}>{data.releaseStatus.replace("-", " ")}</Badge>} />
      <div className="flex gap-4 flex-wrap">
        <MetricCard label="CURRENT VERSION" value={<span className="mono">{data.currentVersion}</span>} />
        <MetricCard label="AVAILABLE VERSION" value={<span className="mono">{data.availableVersion ?? "—"}</span>} />
        <MetricCard label="IMAGE" value={<span className="mono text-sm">{data.imageName}</span>} />
        <MetricCard label="IMAGE SIZE" value={data.imageSizeMb} unit="MB" />
      </div>
    </>
  );
}
