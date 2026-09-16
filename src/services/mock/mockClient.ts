import { MOCK_LATENCY_MS } from "../../utils/constants";

export class MockServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MockServiceError";
  }
}

interface SimulateOptions {
  /** Override the default mock latency for this call. */
  latencyMs?: number;
  /** If set, reject with this message instead of resolving. */
  failWith?: string;
}

/**
 * Every mock service function resolves through here so calling code
 * already looks and behaves like it's talking to a real async API
 * (§22 — Frontend → Hook/Store → Mock Service → Mock Data). Swapping
 * a mock service's internals for real `fetch` calls later doesn't
 * change any calling code's shape.
 */
export function simulateRequest<T>(data: T, options: SimulateOptions = {}): Promise<T> {
  const delay = options.latencyMs ?? MOCK_LATENCY_MS;
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (options.failWith) reject(new MockServiceError(options.failWith));
      else resolve(data);
    }, delay);
  });
}

/** Deep-clones mock fixtures before handing them out so callers can't mutate the shared in-memory dataset. */
export function cloneData<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}
