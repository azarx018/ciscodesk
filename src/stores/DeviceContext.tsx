import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { Device } from "../types/device";
import { deviceService } from "../services/mock/deviceService";

interface DeviceContextValue {
  devices: Device[];
  selectedDevice: Device | null;
  selectDevice: (id: string) => void;
  loading: boolean;
}

const DeviceContext = createContext<DeviceContextValue | null>(null);

export function useDeviceContext(): DeviceContextValue {
  const ctx = useContext(DeviceContext);
  if (!ctx) throw new Error("useDeviceContext must be used within DeviceProvider");
  return ctx;
}

/**
 * Global "current device" — the context every page/table implicitly
 * scopes to, per §5. Reads through deviceService rather than the raw
 * mock dataset, per the Page → Store → Mock Service → Mock Data
 * layering in §22, so swapping in a real API later only touches
 * deviceService.
 */
export function DeviceProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    deviceService.list().then((result) => {
      setDevices(result);
      setDeviceId((current) => current ?? result[0]?.id ?? null);
      setLoading(false);
    });
  }, []);

  const value = useMemo<DeviceContextValue>(() => {
    const selectedDevice = devices.find((d) => d.id === deviceId) ?? devices[0] ?? null;
    return { devices, selectedDevice, selectDevice: setDeviceId, loading };
  }, [devices, deviceId, loading]);

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
}
