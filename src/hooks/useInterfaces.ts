import { useCallback, useEffect, useState } from "react";
import { NetworkInterface } from "../types/interface";
import { interfaceService } from "../services/mock/interfaceService";

interface UseInterfacesResult {
  interfaces: NetworkInterface[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** Interfaces for one device, scoped the same way every Interfaces page (§8) will consume it. */
export function useInterfaces(deviceId: string | undefined): UseInterfacesResult {
  const [interfaces, setInterfaces] = useState<NetworkInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    if (!deviceId) {
      setInterfaces([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    interfaceService
      .list(deviceId)
      .then((result) => {
        if (!cancelled) setInterfaces(result);
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
  }, [deviceId, reloadToken]);

  const refetch = useCallback(() => setReloadToken((t) => t + 1), []);

  return { interfaces, loading, error, refetch };
}
