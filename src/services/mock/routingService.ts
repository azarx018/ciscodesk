import {
  BGP_NEIGHBORS,
  BGP_PROCESSES,
  OSPF_NEIGHBORS,
  OSPF_PROCESSES,
  ROUTES,
  STATIC_ROUTES,
} from "../../data/routes";
import { StaticRoute } from "../../types/routing";
import { cloneData, simulateRequest } from "./mockClient";

let staticRoutes: StaticRoute[] = cloneData(STATIC_ROUTES);

export const routingService = {
  listRoutes(deviceId: string) {
    return simulateRequest(cloneData(ROUTES.filter((r) => r.deviceId === deviceId)));
  },
  listStaticRoutes(deviceId: string) {
    return simulateRequest(cloneData(staticRoutes.filter((r) => r.deviceId === deviceId)));
  },
  addStaticRoute(input: Omit<StaticRoute, "id">): Promise<StaticRoute> {
    const created: StaticRoute = { ...input, id: `sr-${Date.now()}` };
    staticRoutes = [...staticRoutes, created];
    return simulateRequest(cloneData(created));
  },
  removeStaticRoute(id: string) {
    staticRoutes = staticRoutes.filter((r) => r.id !== id);
    return simulateRequest({ id });
  },
  getOspf(deviceId: string) {
    return simulateRequest({
      process: cloneData(OSPF_PROCESSES.find((p) => p.deviceId === deviceId) ?? null),
      neighbors: cloneData(OSPF_NEIGHBORS.filter((n) => n.deviceId === deviceId)),
    });
  },
  getBgp(deviceId: string) {
    return simulateRequest({
      process: cloneData(BGP_PROCESSES.find((p) => p.deviceId === deviceId) ?? null),
      neighbors: cloneData(BGP_NEIGHBORS.filter((n) => n.deviceId === deviceId)),
    });
  },
};
