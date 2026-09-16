import { ReactNode } from "react";
import "./MetricCard.css";

export interface MetricCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  tone?: "default" | "online" | "warning" | "error";
  meter?: number; // 0-100, renders a thin utilization bar
  footnote?: ReactNode;
}

/**
 * The primary unit for numeric device/network state (CPU, memory,
 * uptime, interface counts). Value renders in mono for tabular
 * alignment across a metric row.
 */
export function MetricCard({ label, value, unit, tone = "default", meter, footnote }: MetricCardProps) {
  return (
    <div className="cd-metric">
      <div className="cd-metric-label">{label}</div>
      <div className={`cd-metric-value cd-metric-${tone} mono`}>
        {value}
        {unit && <span className="cd-metric-unit">{unit}</span>}
      </div>
      {typeof meter === "number" && (
        <div className="cd-meter">
          <span
            style={{
              width: `${Math.min(100, Math.max(0, meter))}%`,
              background: `var(--${
                tone === "default" ? "accent" : `status-${tone}`
              })`,
            }}
          />
        </div>
      )}
      {footnote && <div className="cd-metric-footnote">{footnote}</div>}
    </div>
  );
}
