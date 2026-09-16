import { TOPOLOGY_LINKS, TOPOLOGY_NODES } from "../../data/topology";
import { cloneData, simulateRequest } from "./mockClient";

export const topologyService = {
  get() {
    return simulateRequest({ nodes: cloneData(TOPOLOGY_NODES), links: cloneData(TOPOLOGY_LINKS) });
  },
};
