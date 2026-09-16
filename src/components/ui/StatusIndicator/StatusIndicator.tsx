import "./StatusIndicator.css";

export type StatusTone = "online" | "warning" | "error" | "offline";

export interface StatusIndicatorProps {
  tone: StatusTone;
  label?: string;
  pulse?: boolean;
}

/**
 * Small dot + optional label, used in tables and lists where a
 * full Badge would be too heavy (e.g. one per row, every column).
 */
export function StatusIndicator({ tone, label, pulse }: StatusIndicatorProps) {
  return (
    <span className="cd-status">
      <span className={["cd-status-dot", `cd-status-${tone}`, pulse ? "cd-status-pulse" : ""].filter(Boolean).join(" ")} />
      {label && <span className="cd-status-label">{label}</span>}
    </span>
  );
}
