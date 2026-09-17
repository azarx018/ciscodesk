import { PageHeader } from "../../components/layout";
import { EmptyState, LoadingState } from "../../components/ui";
import { Terminal } from "../../components/terminal/Terminal";
import { useDeviceContext } from "../../stores/DeviceContext";
import { runCommand, TERMINAL_SUGGESTIONS } from "../../services/mock/terminalService";

/** Terminal (§16): realistic Cisco CLI mock, scoped to the selected device. Never executes real commands. */
export function TerminalPage() {
  const { selectedDevice, loading } = useDeviceContext();

  if (loading) {
    return (
      <>
        <PageHeader title="Terminal" />
        <LoadingState label="Connecting…" />
      </>
    );
  }
  if (!selectedDevice) {
    return (
      <>
        <PageHeader title="Terminal" />
        <EmptyState title="No device selected" body="Select a device from the topbar to open a terminal session." />
      </>
    );
  }

  return (
    <>
      <PageHeader title="Terminal" subtitle={`${selectedDevice.hostname} — simulated CLI, no real device is contacted`} />
      <Terminal
        prompt={`${selectedDevice.hostname}#`}
        suggestions={TERMINAL_SUGGESTIONS}
        onRun={(cmd) => runCommand(selectedDevice, cmd)}
      />
    </>
  );
}
