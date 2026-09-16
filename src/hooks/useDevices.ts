import { useCallback, useEffect, useState } from "react";
import { Device } from "../types/device";
import { deviceService } from "../services/mock/deviceService";

interface UseDevicesResult {
  devices: Device[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** Page-facing data hook: Page → Hook → Mock Service → Mock Data (§22). */
export function useDevices(): UseDevicesResult {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    deviceService
      .list()
      .then((result) => {
        if (!cancelled) setDevices(result);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  return { devices, loading, error, refetch };
}
