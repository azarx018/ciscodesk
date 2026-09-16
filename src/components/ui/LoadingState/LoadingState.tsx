import "./LoadingState.css";

export interface LoadingStateProps {
  label?: string;
  rows?: number;
}

/** Skeleton rows for table/list contexts; falls back to a compact spinner + label. */
export function LoadingState({ label = "Loading…", rows }: LoadingStateProps) {
  if (rows && rows > 0) {
    return (
      <div className="cd-skeleton-list" aria-busy="true" aria-live="polite">
        {Array.from({ length: rows }).map((_, i) => (
          <div className="cd-skeleton-row" key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="cd-loading" role="status" aria-live="polite">
      <span className="cd-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
