import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Device } from "../types/device";
import { DEVICES } from "../data/devices";

interface DeviceContextValue {
  devices: Device[];
  selectedDevice: Device;
  selectDevice: (id: string) => void;
}

const DeviceContext = createContext<DeviceContextValue | null>(null);

export function useDeviceContext(): DeviceContextValue {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDeviceContext must be used within DeviceProvider");
  return ctx;
}

/**
 * Global "current device" — the context every page/table implicitly
 * scopes to, per master prompt §5. Backed by the static mock list for
 * now; Phase 3 swaps this to read from deviceService.
 */
export function DeviceProvider({ children }: { children: ReactNode }) {
  const [deviceId, setDeviceId] = useState(DEVICES[0].id);

  const value = useMemo<DeviceContextValue>(() => {
    const selectedDevice = DEVICES.find((d) => d.id === deviceId) || DEVICES[0];
    return { devices: DEVICES, selectedDevice, selectDevice: setDeviceId };
  }, [deviceId]);

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}
